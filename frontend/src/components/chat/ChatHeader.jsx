import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function ChatHeader({ chat }) {
  return (
    <header className='flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white p-4'>
      <div className='flex min-w-0 items-center gap-3'>
        <img
          alt={chat.name}
          className='h-10 w-10 rounded-full object-cover'
          src={chat.avatar}
        />
        <div className='min-w-0'>
          <h2 className='truncate font-semibold text-gray-800'>
            {chat.name}
          </h2>
          <p className='truncate text-xs font-medium text-[#00543D]'>
            Ref: {chat.item}
          </p>
        </div>
      </div>

      <button
        aria-label='Ver información del chat'
        className='text-gray-400 transition-colors hover:text-gray-600'
        type='button'
      >
        <FontAwesomeIcon icon={faInfoCircle} className='text-xl' />
      </button>
    </header>
  );
}

export default ChatHeader;
