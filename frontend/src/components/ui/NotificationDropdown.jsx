import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
  getNotifications,
  markNotificationsRead,
  respondToLoanRequest,
} from '../../features/notifications/notificationService';
import { findOrCreateChat } from '../../features/chat/chatService';

const relativeTime = (date) => {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(date)) / 60000));
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.floor(hours / 24)} d`;
};

export default function NotificationDropdown() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const notificationsRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    getNotifications(token).then(setNotifications).catch(() => setError('No se pudieron cargar.'));
  }, [token, showNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const markAllRead = async () => {
    try {
      await markNotificationsRead(token);
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    } catch {
      setError('No se pudieron marcar como leídas.');
    }
  };

  const openChatWithUser = async (event, notification) => {
    event.stopPropagation();
    try {
      setError('');
      const otherUser = notification.actor;
      const chat = await findOrCreateChat(
        notification.actorId,
        token,
        notification.post?.title || 'Préstamo',
        notification.postId,
      );
      setShowNotifications(false);
      navigate('/chat', {
        state: {
          newContact: {
            id: notification.actorId,
            chatId: chat.id,
            name: otherUser?.name || 'Usuario',
            avatar:
              otherUser?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'U')}&background=00543D&color=fff`,
            item: notification.post?.title || 'Préstamo',
            postId: notification.postId,
          },
        },
      });
    } catch (chatError) {
      setError(chatError.message || 'No se pudo abrir el chat.');
    }
  };

  const respondToRequest = async (event, notification, decision) => {
    event.stopPropagation();
    try {
      await respondToLoanRequest(notification.id, decision, token);
      setNotifications((items) =>
        items.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                isRead: true,
                type: decision === 'accept' ? 'loan_accepted' : 'loan_rejected',
              }
            : item,
        ),
      );
      if (decision === 'accept') {
        await openChatWithUser(event, notification);
      }
    } catch (responseError) {
      setError(responseError.message || 'No se pudo responder la solicitud.');
    }
  };

  return (
    <div className='relative' ref={notificationsRef}>
      <button
        className='relative flex items-center justify-center transition-colors cursor-pointer hover:text-gray-900'
        onClick={() => setShowNotifications((show) => !show)}
        title='Notificaciones'
      >
        <FontAwesomeIcon icon={faBellRegular} />
        {unreadCount > 0 && (
          <span className='absolute -top-2 -right-2 min-w-4 h-4 px-1 text-[10px] leading-4 text-center text-white bg-red-500 rounded-full'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className='absolute right-0 z-50 mt-4 overflow-hidden text-base font-normal text-left text-gray-800 bg-white border border-gray-200 shadow-lg w-80 rounded-xl'>
          <div className='flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50'>
            <span className='font-semibold'>Notificaciones</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className='text-xs text-[#00543D] cursor-pointer hover:underline'>
                Marcar como leídas
              </button>
            )}
          </div>
          <div className='overflow-y-auto max-h-80'>
            {error && <p className='p-4 text-sm text-red-600'>{error}</p>}
            {!error && notifications.length === 0 && (
              <p className='p-6 text-sm text-center text-gray-500'>No tienes notificaciones.</p>
            )}
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  setShowNotifications(false);
                  navigate(`/post/${notification.postId}`);
                }}
                role='button'
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') navigate(`/post/${notification.postId}`);
                }}
                className={`block w-full p-4 text-left border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${notification.isRead ? '' : 'bg-emerald-50'}`}
              >
                <p className='text-sm leading-snug text-gray-700'>{notification.message}</p>
                <span className='block text-xs text-gray-400 mt-1.5'>{relativeTime(notification.createdAt)}</span>
                {notification.type === 'loan_request' && (
                  <span className='flex gap-2 mt-3'>
                    <button
                      type='button'
                      onClick={(event) => respondToRequest(event, notification, 'accept')}
                      className='px-3 py-1.5 text-xs font-semibold text-white bg-[#00543D] rounded-md hover:bg-[#00402e]'
                    >
                      Aceptar
                    </button>
                    <button
                      type='button'
                      onClick={(event) => respondToRequest(event, notification, 'reject')}
                      className='px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-md hover:bg-red-100'
                    >
                      Rechazar
                    </button>
                  </span>
                )}
                {['request_accepted', 'loan_accepted'].includes(notification.type) && (
                  <button
                    type='button'
                    onClick={(event) => openChatWithUser(event, notification)}
                    className='mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-[#00543D] rounded-md hover:bg-[#00402e]'
                  >
                    Contactar por chat
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
