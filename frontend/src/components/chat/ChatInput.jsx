import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function ChatInput({ value, onChange, onSubmit }) {
  return (
    <form
      className='shrink-0 border-t border-gray-200 bg-white p-4'
      onSubmit={onSubmit}
    >
      <div className='flex items-center gap-2'>
        <input
          className='flex-1 rounded-full border-none bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00543D]/20'
          onChange={(e) => onChange(e.target.value)}
          placeholder='Escribe un mensaje...'
          type='text'
          value={value}
        />
        <button
          className='flex h-12 w-12 items-center justify-center rounded-full bg-[#00543D] text-white transition-colors hover:bg-[#00402e] disabled:cursor-not-allowed disabled:opacity-50'
          disabled={!value.trim()}
          type='submit'
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
