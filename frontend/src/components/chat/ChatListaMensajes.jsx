function ChatListaMensajes({ messages }) {
  return (
    <div className='flex-1 space-y-3 overflow-y-auto bg-gray-50 px-5 py-6'>
      {messages.map((msg) => (
        <div
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          key={msg.id}
        >
          <p
            className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
              msg.sender === 'user'
                ? 'bg-[#00543D] text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            {msg.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ChatListaMensajes;
