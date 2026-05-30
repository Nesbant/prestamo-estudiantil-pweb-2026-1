import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faSearch,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

// Mockups de conversaciones simulando interacciones por distintos artículos
const mockContacts = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    item: 'Calculadora Científica Casio fx-991',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    lastMessage: 'Sí, nos vemos en la cafetería.',
    time: '10:30 AM',
    unread: 0,
  },
  {
    id: 2,
    name: 'Lucía Fernández',
    item: 'Libro de Cálculo Diferencial',
    avatar: 'https://i.pravatar.cc/150?u=lucia',
    lastMessage: '¿Aún lo tienes disponible?',
    time: '09:15 AM',
    unread: 2,
  },
  {
    id: 3,
    name: 'Martín Suárez',
    item: 'Bata de Laboratorio Talla M',
    avatar: 'https://i.pravatar.cc/150?u=martin',
    lastMessage: 'Gracias por el préstamo!',
    time: 'Ayer',
    unread: 0,
  },
  {
    id: 4,
    name: 'Ana Gómez',
    item: 'Laptop HP (Para exposición)',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    lastMessage: 'Te lo devuelvo a las 5 PM.',
    time: 'Ayer',
    unread: 0,
  },
  {
    id: 5,
    name: 'Roberto Díaz',
    item: 'Regla T y Escuadras',
    avatar: 'https://i.pravatar.cc/150?u=roberto',
    lastMessage: 'Perfecto, te espero en el pabellón C.',
    time: 'Mar 12',
    unread: 0,
  },
];

// Mockups del historial de mensajes para algunas de las conversaciones
const initialMessages = {
  1: [
    {
      id: 1,
      sender: 'other',
      text: 'Hola, ¿qué tal? Quería saber si aún prestas la calculadora.',
      time: '10:00 AM',
    },
    {
      id: 2,
      sender: 'me',
      text: '¡Hola! Sí, claro que sí. ¿Para cuándo la necesitas?',
      time: '10:15 AM',
    },
    {
      id: 3,
      sender: 'other',
      text: 'Para hoy a las 11. ¿Podemos vernos en la cafetería central?',
      time: '10:25 AM',
    },
    {
      id: 4,
      sender: 'me',
      text: 'Me parece bien. Llevo una polera negra.',
      time: '10:28 AM',
    },
    {
      id: 5,
      sender: 'other',
      text: 'Sí, nos vemos en la cafetería.',
      time: '10:30 AM',
    },
  ],
  2: [
    {
      id: 1,
      sender: 'other',
      text: 'Hola! Vi tu publicación del libro de cálculo.',
      time: '09:10 AM',
    },
    {
      id: 2,
      sender: 'other',
      text: '¿Aún lo tienes disponible?',
      time: '09:15 AM',
    },
  ],
  3: [
    {
      id: 1,
      sender: 'me',
      text: 'Hola Martín, aquí te devuelvo la bata, muchas gracias.',
      time: 'Ayer, 4:00 PM',
    },
    {
      id: 2,
      sender: 'other',
      text: 'De nada, espero te haya servido.',
      time: 'Ayer, 4:15 PM',
    },
    {
      id: 3,
      sender: 'me',
      text: 'Muchísimo. ¡Gracias por el préstamo!',
      time: 'Ayer, 4:30 PM',
    },
  ],
};

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState(1);
  const [contacts, setContacts] = useState(mockContacts);
  const [tempContact, setTempContact] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Manejar el contacto nuevo que viene por la navegación desde un artículo
  useEffect(() => {
    const incoming = location.state?.newContact;
    if (incoming) {
      const exists = contacts.find((c) => c.id === incoming.id);
      if (exists) {
        setActiveChatId(exists.id);
      } else {
        setTempContact({
          ...incoming,
          time: 'Ahora',
          unread: 0,
          lastMessage: 'Escribe el primer mensaje...',
        });
        setActiveChatId(incoming.id);
      }
      // Limpiamos el historial del router para que no salte al actualizar estados
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, contacts, location.pathname, navigate]);

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
  const currentMessages = messages[activeChatId] || [];

  // Auto-scroll al final cuando se envía un mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsgObj],
    }));

    // Si es un contacto temporal, guardarlo en la lista permanente
    if (tempContact && activeChatId === tempContact.id) {
      setContacts((prev) => [
        { ...tempContact, lastMessage: newMessage },
        ...prev,
      ]);
      setTempContact(null);
    } else {
      // Actualizar el último mensaje del contacto existente en la barra lateral
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, lastMessage: newMessage } : c,
        ),
      );
    }

    setNewMessage('');
  };

  return (
    <main className='w-full max-w-7xl px-4 md:px-8 py-6 mx-auto h-[calc(100vh-80px)] flex flex-col'>
      <div className='flex h-full overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl'>
        {/* Sidebar - Lista de Contactos */}
        <div className='flex flex-col w-full border-r border-gray-200 md:w-80 lg:w-96 bg-gray-50/50 shrink-0'>
          <div className='p-4 border-b border-gray-200'>
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
