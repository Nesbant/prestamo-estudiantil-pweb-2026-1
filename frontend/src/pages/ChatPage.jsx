import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faSearch,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../features/auth/AuthContext';
import {
  getChats,
  getChatById,
  sendMessage,
  findOrCreateChat,
} from '../features/chat/chatService';

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [activeChatId, setActiveChatId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [tempContact, setTempContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Manejar el contacto nuevo que viene por la navegación desde un artículo
  useEffect(() => {
    async function handleIncomingContact() {
      const incoming = location.state?.newContact;
      if (!incoming) return;

      const exists = contacts.find((c) => c.id === incoming.chatId);
      if (exists) {
        setActiveChatId(exists.id);
      } else {
        let chatId = incoming.chatId;
        if (!chatId) {
          try {
            const chat = await findOrCreateChat(
              incoming.id,
              token,
              incoming.item,
            );
            chatId = chat.id;
          } catch {
            setError('No se pudo iniciar el chat.');
            return;
          }
        }

        setTempContact({
          ...incoming,
          id: chatId,
          time: 'Ahora',
          unread: 0,
          lastMessage: 'Escribe el primer mensaje...',
        });
        setActiveChatId(chatId);
      }

      // Limpiamos el historial del router para que no salte al actualizar estados
      navigate(location.pathname, { replace: true, state: {} });
    }

    handleIncomingContact();
  }, [location.state, contacts, location.pathname, navigate, token]);

  useEffect(() => {
    async function loadChats() {
      try {
        const chats = await getChats(token);
        const apiContacts = chats.map((chat) => {
          const participant = chat.participants?.[0] || {};
          const lastMessage = chat.messages?.[0];
          return {
            id: chat.id,
            participantId: participant.id,
            name: participant.name || 'Usuario',
            item: chat.reference || 'Conversación',
            avatar:
              participant.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name || 'U')}&background=00543D&color=fff`,
            lastMessage: lastMessage?.content || 'Sin mensajes todavía',
            time: lastMessage?.createdAt
              ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Ahora',
            unread: 0,
          };
        });

        if (apiContacts.length > 0) {
          setContacts(apiContacts);
          if (activeChatId && apiContacts.some((c) => c.id === activeChatId)) {
            setActiveChatId(activeChatId);
          } else {
            setActiveChatId(apiContacts[0].id);
          }
        }
      } catch {
        setError('No se pudieron cargar tus chats.');
      }
    }

    if (token) {
      loadChats();
    }
  }, [token, activeChatId]);

  const displayContacts = tempContact
    ? [tempContact, ...contacts].filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      )
    : contacts;

  const filteredContacts = displayContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeChat = displayContacts.find((c) => c.id === activeChatId);
  const currentMessages = useMemo(
    () => messages[activeChatId] || [],
    [messages, activeChatId],
  );

  useEffect(() => {
    async function loadChatMessages() {
      if (!activeChatId) return;
      try {
        const chatDetails = await getChatById(activeChatId, token);
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: chatDetails.messages.map((msg) => ({
            id: msg.id,
            sender: msg.sender?.id === currentUser?.id ? 'me' : 'other',
            text: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          })),
        }));
      } catch {
        // No hacemos nada si falla la carga de mensajes en este momento.
      }
    }

    loadChatMessages();
  }, [activeChatId, token, currentUser?.id]);

  // Auto-scroll al final cuando se envía un mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    const content = newMessage.trim();

    try {
      const sentMessage = await sendMessage(activeChatId, content, token);
      const newMsgObj = {
        id: sentMessage.id,
        sender: 'me',
        text: sentMessage.content,
        time: new Date(sentMessage.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newMsgObj],
      }));

      if (tempContact && activeChatId === tempContact.id) {
        setContacts((prev) => {
          const filteredPrev = prev.filter((c) => c.id !== tempContact.id);
          return [{ ...tempContact, lastMessage: content }, ...filteredPrev];
        });
        setTempContact(null);
      } else {
        setContacts((prev) =>
          prev.map((c) =>
            c.id === activeChatId ? { ...c, lastMessage: content } : c,
          ),
        );
      }

      setNewMessage('');
    } catch {
      setError('No se pudo enviar el mensaje.');
    }
  };

  return (
    <main className='w-full max-w-7xl px-4 md:px-8 py-6 mx-auto h-[calc(100vh-80px)] flex flex-col'>
      <div className='flex h-full overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl'>
        {/* Sidebar - Lista de Contactos */}
        <div className='flex flex-col w-full border-r border-gray-200 md:w-80 lg:w-96 bg-gray-50/50 shrink-0'>
          <div className='p-4 border-b border-gray-200'>
            {error && (
              <div className='p-2 mb-3 text-xs text-red-700 bg-red-100 rounded-lg'>
                {error}
              </div>
            )}
            <div className='relative'>
              <FontAwesomeIcon
                icon={faSearch}
                className='absolute text-gray-400 left-3 top-3'
              />
              <input
                type='text'
                placeholder='Buscar chats...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full py-2 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00543D]'
              />
            </div>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setActiveChatId(contact.id)}
                className={`flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  activeChatId === contact.id
                    ? 'bg-[#00543D]/5 border-l-4 border-l-[#00543D]'
                    : 'hover:bg-white border-l-4 border-l-transparent'
                }`}
              >
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className='object-cover w-12 h-12 rounded-full'
                />
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <h3 className='text-sm font-semibold text-gray-800 truncate'>
                      {contact.name}
                    </h3>
                    <span className='text-xs text-gray-400'>
                      {contact.time}
                    </span>
                  </div>
                  <p className='text-xs font-medium text-[#00543D] truncate'>
                    {contact.item}
                  </p>
                  <p
                    className={`text-sm truncate ${contact.unread > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}
                  >
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <span className='flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#00543D] rounded-full shrink-0'>
                    {contact.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Área Principal de Chat */}
        <div className='hidden md:flex flex-col flex-1 bg-[#F9FAFB]'>
          {activeChat ? (
            <>
              {/* Cabecera del Chat */}
              <div className='flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0'>
                <div className='flex items-center gap-3'>
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className='object-cover w-10 h-10 rounded-full'
                  />
                  <div>
                    <h2 className='font-semibold text-gray-800'>
                      {activeChat.name}
                    </h2>
                    <p className='text-xs text-[#00543D] font-medium'>
                      Ref: {activeChat.item}
                    </p>
                  </div>
                </div>
                <button className='text-gray-400 transition-colors hover:text-gray-600'>
                  <FontAwesomeIcon icon={faInfoCircle} className='text-xl' />
                </button>
              </div>

              {/* Historial de Mensajes */}
              <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
                {currentMessages.length === 0 ? (
                  <div className='flex items-center justify-center h-full text-sm text-gray-500'>
                    Envía un mensaje para comenzar a conversar.
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${msg.sender === 'me' ? 'bg-[#00543D] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}
                      >
                        <p className='text-sm leading-relaxed'>{msg.text}</p>
                      </div>
                      <span className='mt-1 text-xs text-gray-400'>
                        {msg.time}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input para Enviar Mensajes */}
              <form
                onSubmit={handleSendMessage}
                className='p-4 bg-white border-t border-gray-200 shrink-0'
              >
                <div className='flex items-center gap-2'>
                  <input
                    type='text'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Escribe un mensaje...'
                    className='flex-1 px-4 py-3 text-sm bg-gray-100 border-none rounded-full outline-none focus:ring-2 focus:ring-[#00543D]/20'
                  />
                  <button
                    type='submit'
                    disabled={!newMessage.trim()}
                    className='flex items-center justify-center w-12 h-12 text-white transition-colors bg-[#00543D] rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00402e]'
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
