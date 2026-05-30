function ChatSidebar({ chats, selectedChatId }) {
  return (
    <aside className='border-b border-gray-200 bg-gray-50 lg:border-b-0 lg:border-r'>
      <div className='border-b border-gray-200 px-5 py-4'>
        <h2 className='text-lg font-semibold text-gray-800'>Chats</h2>
        <p className='text-sm text-gray-500'>Conversaciones recientes</p>
      </div>
      <ul className='divide-y divide-gray-200'>
        {chats.map((chat) => (
          <li key={chat.id}>
            <button
              className={`w-full px-5 py-4 text-left transition-colors hover:bg-white ${
                chat.id === selectedChatId ? 'bg-white' : ''
              }`}
              type='button'
            >
              <div className='flex items-start gap-3'>
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00543D] text-sm font-semibold text-white'>
                  {chat.name.charAt(0)}
                </span>
                <div className='min-w-0'>
                  <p className='truncate font-semibold text-gray-800'>
                    {chat.name}
                  </p>
                  <p className='truncate text-sm text-gray-500'>
                    {chat.publicacion}
                  </p>
                  <p className='mt-1 truncate text-sm text-gray-400'>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default ChatSidebar;
