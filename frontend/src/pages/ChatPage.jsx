import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatAcciones from '../components/chat/ChatAcciones';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import ChatListaMensajes from '../components/chat/ChatListaMensajes';
import ChatSidebar from '../components/chat/ChatSidebar';
import { useAuth } from '../features/auth/AuthContext';
import { contactosChatMock, mensajesChatMock } from '../mocks/chat';

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const [activeChatId, setActiveChatId] = useState(1);
  const [contacts, setContacts] = useState(contactosChatMock);
  const [tempContact, setTempContact] = useState(null);
  const [messages, setMessages] = useState(mensajesChatMock);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const incoming = location.state?.newContact;
    if (!incoming) return;

    const exists = contacts.find((contact) => contact.id === incoming.id);

    if (exists) {
      setActiveChatId(exists.id);
    } else {
      setTempContact({
        ...incoming,
        lastMessage: incoming.initialMessage || 'Escribe el primer mensaje...',
        time: 'Ahora',
        unread: 0,
      });
      setActiveChatId(incoming.id);

      if (incoming.initialMessage) {
        setMessages((previousMessages) => ({
          ...previousMessages,
          [incoming.id]: [
            {
              id: Date.now(),
              sender: 'me',
              text: incoming.initialMessage,
              time: getCurrentTime(),
            },
          ],
        }));
      }
    }

    navigate(location.pathname, { replace: true, state: {} });
  }, [contacts, location.pathname, location.state, navigate]);

  const displayContacts = tempContact
    ? [tempContact, ...contacts].filter(
        (contact, index, allContacts) =>
          allContacts.findIndex((item) => item.id === contact.id) === index,
      )
    : contacts;

  const filteredContacts = displayContacts.filter((contact) => {
    const normalizedSearch = searchTerm.toLowerCase();

    return (
      contact.name.toLowerCase().includes(normalizedSearch) ||
      contact.item.toLowerCase().includes(normalizedSearch)
    );
  });

  const activeChat = displayContacts.find(
    (contact) => contact.id === activeChatId,
  );
  const currentMessages = messages[activeChatId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  const addMessage = (text) => {
    const sentMessage = {
      id: Date.now(),
      sender: 'me',
      text,
      time: getCurrentTime(),
    };

    setMessages((previousMessages) => ({
      ...previousMessages,
      [activeChatId]: [
        ...(previousMessages[activeChatId] || []),
        sentMessage,
      ],
    }));

    if (tempContact && activeChatId === tempContact.id) {
      setContacts((previousContacts) => [
        { ...tempContact, lastMessage: text },
        ...previousContacts,
      ]);
      setTempContact(null);
    } else {
      setContacts((previousContacts) =>
        previousContacts.map((contact) =>
          contact.id === activeChatId
            ? { ...contact, lastMessage: text }
            : contact,
        ),
      );
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const sentMessage = {
      id: Date.now(),
      sender: 'me',
      text: trimmedMessage,
      time: getCurrentTime(),
    };

    setMessages((previousMessages) => ({
      ...previousMessages,
      [activeChatId]: [
        ...(previousMessages[activeChatId] || []),
        sentMessage,
      ],
    }));

    if (tempContact && activeChatId === tempContact.id) {
      setContacts((previousContacts) => [
        { ...tempContact, lastMessage: trimmedMessage },
        ...previousContacts,
      ]);
      setTempContact(null);
    } else {
      setContacts((previousContacts) =>
        previousContacts.map((contact) =>
          contact.id === activeChatId
            ? { ...contact, lastMessage: trimmedMessage }
            : contact,
        ),
      );
    }

    setNewMessage('');
  };

  const handleSharePhone = () => {
    const phone = currentUser?.phone?.trim();
    addMessage(
      phone
        ? `Mi telefono es ${phone}.`
        : 'Aun no tengo un telefono registrado en mi perfil.',
    );
  };

  const handleConfirmReceived = () => {
    addMessage(`Confirmo que recibi el articulo "${activeChat.item}".`);
  };

  const handleConfirmDelivery = () => {
    addMessage(`Confirmo que entregue el articulo "${activeChat.item}".`);
  };

  const handleRejectLoan = () => {
    addMessage(`No podre continuar con el prestamo de "${activeChat.item}".`);
  };

  return (
    <main className='mx-auto flex h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-4 py-6 md:px-8'>
      <div className='flex h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
        <ChatSidebar
          chats={filteredContacts}
          onSearchChange={setSearchTerm}
          onSelectChat={setActiveChatId}
          searchTerm={searchTerm}
          selectedChatId={activeChatId}
        />

        <section className='hidden flex-1 flex-col bg-[#F9FAFB] md:flex'>
          {activeChat && (
            <>
              <ChatHeader chat={activeChat} />
              <ChatListaMensajes
                messages={currentMessages}
                messagesEndRef={messagesEndRef}
              />
              <ChatAcciones
                isMyPost={activeChat.isMyPost}
                onConfirmDelivery={handleConfirmDelivery}
                onConfirmReceived={handleConfirmReceived}
                onRejectLoan={handleRejectLoan}
                onSharePhone={handleSharePhone}
              />
              <ChatInput
                onChange={setNewMessage}
                onSubmit={handleSendMessage}
                value={newMessage}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
