function ChatEstadosPanel() {
  return (
    <div className='flex flex-wrap gap-3 border-t border-gray-200 bg-white px-5 py-3'>
      <button
        className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
        type='button'
      >
        Solicitar prestamo
      </button>
      <button
        className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
        type='button'
      >
        Confirmar entrega
      </button>
      <button
        className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
        type='button'
      >
        Confirmar recepcion
      </button>
    </div>
  );
}

export default ChatEstadosPanel;
