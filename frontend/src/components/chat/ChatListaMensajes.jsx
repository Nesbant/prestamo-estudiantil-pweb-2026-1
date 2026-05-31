import ChatMensaje from './ChatMensaje';

function ChatListaMensajes({ messages, messagesEndRef }) {
  return (
    <div className='flex-1 space-y-4 overflow-y-auto bg-[#F9FAFB] p-4'>
      {messages.length === 0 ? (
        <div className='flex h-full items-center justify-center text-sm text-gray-500'>
          Envía un mensaje para comenzar a conversar.
        </div>
      ) : (
        messages.map((message) => (
          <ChatMensaje key={message.id} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatListaMensajes;
