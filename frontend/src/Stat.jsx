import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Stat = ({ title, total, description, color = '#007bff', icon }) => {
  return (
    <div
      className='flex flex-col p-5 bg-white border border-gray-200 rounded-md shadow-sm'
      style={{ borderTop: `4px solid ${color}` }}
    >
      <h2 className='flex items-center text-lg font-medium text-gray-700'>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            style={{ marginRight: '10px', color: color }}
          />
        )}
        {title}
      </h2>
      <div className='mt-4'>
        <p className='mb-1 text-sm text-gray-500'>{description}</p>
        <p className='text-3xl font-bold text-gray-900'>{total}</p>
      </div>
    </div>
  );
};

export default Stat;
