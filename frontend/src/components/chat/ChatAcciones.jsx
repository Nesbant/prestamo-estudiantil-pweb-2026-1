function ChatAcciones({
  isMyPost,
  onConfirmDelivery,
  onConfirmReceived,
  onRejectLoan,
  onSharePhone,
}) {
  return (
    <div className='flex flex-wrap gap-2 border-t border-gray-200 bg-white px-4 py-3'>
      <button
        className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
        onClick={onSharePhone}
        type='button'
      >
        Compartir mi telefono
      </button>

      {isMyPost ? (
        <button
          className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          onClick={onConfirmDelivery}
          type='button'
        >
          Confirmar entrega
        </button>
      ) : (
        <button
          className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          onClick={onConfirmReceived}
          type='button'
        >
          Confirmar recibido
        </button>
      )}

      <button
        className='rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50'
        onClick={onRejectLoan}
        type='button'
      >
        Rechazar prestamo
      </button>
    </div>
  );
}

export default ChatAcciones;
