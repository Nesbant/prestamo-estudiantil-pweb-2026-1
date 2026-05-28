import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Modal({
  titulo,
  mensaje,
  onClose,
  onConfirm,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  icon,
  iconClassName = 'text-[#00543D]',
  maxWidthClass = 'max-w-lg',
  children,
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div
        className={`flex flex-col items-center w-full ${maxWidthClass} p-8 text-center bg-white shadow-xl rounded-2xl`}
      >
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={`mb-4 text-5xl ${iconClassName}`}
          />
        )}
        {titulo && (
          <h2
            className={`mb-2 text-2xl font-bold ${icon ? 'text-gray-900' : 'text-[#00543D]'}`}
          >
            {titulo}
          </h2>
        )}
        {mensaje && <p className='mb-6 text-gray-600'>{mensaje}</p>}

        {/* Contenedor dinámico por si se le pasan más componentes dentro */}
        {children && <div className='w-full mb-8 text-left'>{children}</div>}

        <div className='flex justify-center w-full gap-4'>
          {onClose && (
            <button
              onClick={onClose}
              className={
                onConfirm
                  ? 'px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer'
                  : 'rounded-lg bg-[#00543D] px-8 py-3 font-semibold text-white hover:bg-[#004231] cursor-pointer'
              }
            >
              {onConfirm ? cancelText : confirmText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className='px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer'
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
