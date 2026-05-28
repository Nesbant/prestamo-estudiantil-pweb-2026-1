import { useState } from 'react';
import ChatEstadosPanel from '../components/chat/ChatEstadosPanel';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import ChatListaMensajes from '../components/chat/ChatListaMensajes';
import ChatSidebar from '../components/chat/ChatSidebar';

const chats = [
  {
    id: 1,
    name: 'Maria Lopez',
    publicacion: 'Calculadora cientifica',
    lastMessage: 'Perfecto, nos vemos en biblioteca.',
    messages: [
      { id: 1, sender: 'other', text: 'Hola, vi tu solicitud de calculadora.' },
      { id: 2, sender: 'user', text: 'Si, la necesito para el examen de fisica.' },
      { id: 3, sender: 'other', text: 'Te la puedo prestar hasta el viernes.' },
    ],
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    publicacion: 'Libro de estadistica',
    lastMessage: 'Aun lo tienes disponible?',
    messages: [
      { id: 1, sender: 'other', text: 'Aun lo tienes disponible?' },
      { id: 2, sender: 'user', text: 'Si, podemos coordinar la entrega.' },
    ],
  },
];

function ChatPage() {
  const [selectedChat] = useState(chats[0]);

  return (
    <main className='mx-4 mt-6 mb-10 md:mx-10 lg:mx-15'>
      <section className='mb-6'>
        <h1 className='mb-2 text-4xl font-semibold'>Mensajes</h1>
        <p className='text-gray-600'>
          Coordina prestamos e intercambios con otros estudiantes.
        </p>
      </section>
      <section className='grid min-h-[680px] overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl lg:grid-cols-[320px_1fr]'>
        <ChatSidebar chats={chats} selectedChatId={selectedChat.id} />
        <div className='flex min-h-0 flex-col'>
          <ChatHeader chat={selectedChat} />
          <ChatListaMensajes messages={selectedChat.messages} />
          <ChatEstadosPanel />
          <ChatInput />
        </div>
      </section>
    </main>
  );
}

export default ChatPage;
