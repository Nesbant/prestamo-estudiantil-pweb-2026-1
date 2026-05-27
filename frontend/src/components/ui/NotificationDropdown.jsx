import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';

export default function NotificationDropdown() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={notificationsRef}>
      <button
        className='relative flex items-center justify-center transition-colors cursor-pointer hover:text-gray-900'
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <FontAwesomeIcon icon={faBellRegular} />
        <span className='absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full'></span>
      </button>

      {showNotifications && (
        <div className='absolute right-0 z-50 mt-4 overflow-hidden text-base font-normal text-left text-gray-800 bg-white border border-gray-200 shadow-lg w-80 rounded-xl'>
          <div className='flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50'>
            <span className='font-semibold'>Notificaciones</span>
            <span className='text-xs text-[#00543D] cursor-pointer hover:underline'>
              Marcar como leídas
            </span>
          </div>
          <div className='overflow-y-auto max-h-80'>
            <div className='p-4 transition-colors border-b border-gray-100 cursor-pointer hover:bg-gray-50'>
              <p className='text-sm leading-snug text-gray-700'>
                <span className='font-semibold'>Ana Ruiz</span> ha solicitado tu{' '}
                <span className='font-medium'>
                  Calculadora Científica Casio
                </span>
                .
              </p>
              <span className='block text-xs text-gray-400 mt-1.5'>
                hace 10 min
              </span>
            </div>
            <div className='p-4 transition-colors cursor-pointer hover:bg-gray-50'>
              <p className='text-sm leading-snug text-gray-700'>
                Recordatorio: Debes devolver{' '}
                <span className='font-medium'>Física Universitaria Vol. 2</span>{' '}
                mañana.
              </p>
              <span className='block text-xs text-gray-400 mt-1.5'>
                hace 1 día
              </span>
            </div>
          </div>
          <div className='p-3 text-center transition-colors border-t border-gray-100 cursor-pointer bg-gray-50 hover:bg-gray-200'>
            <span className='text-sm font-medium text-[#00543D]'>
              Ver todas las notificaciones
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
