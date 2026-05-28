function ChatHeader({ chat }) {
  return (
    <header className='flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4'>
      <div className='flex min-w-0 items-center gap-3'>
        <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-[#00543D]'>
          {chat.name.charAt(0)}
        </span>
        <div className='min-w-0'>
          <h2 className='truncate text-lg font-semibold text-gray-800'>
            {chat.name}
          </h2>
          <p className='truncate text-sm text-gray-500'>{chat.publicacion}</p>
        </div>
      </div>

      <button
        className='rounded-lg bg-[#00543D] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#004330]'
        onClick={() => console.log('Compartir mi telefono')}
        type='button'
      >
        Compartir mi telefono
      </button>
    </header>
  );
}

export default ChatHeader;
