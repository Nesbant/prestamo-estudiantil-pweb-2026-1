function ChatInput() {
  return (
    <form className='flex gap-3 border-t border-gray-200 bg-white px-5 py-4'>
      <input
        className='h-11 flex-1 rounded-xl border border-gray-300 px-4 text-gray-800 outline-none transition-colors focus:border-[#00543D] focus:ring-1 focus:ring-[#00543D]'
        placeholder='Escribe un mensaje...'
        type='text'
      />
      <button
        className='rounded-xl bg-[#00543D] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#004330]'
        type='button'
      >
        Enviar
      </button>
    </form>
  );
}

export default ChatInput;
