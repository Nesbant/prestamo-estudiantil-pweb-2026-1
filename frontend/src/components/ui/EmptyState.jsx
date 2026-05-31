import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

export default function EmptyState({
  icon = faBoxOpen,
  title = 'No hay resultados',
  description,
  actionButton,
}) {
  return (
    <section className='flex flex-col items-center justify-center py-20 mb-12 text-center border-2 border-gray-200 border-dashed bg-gray-50 rounded-2xl'>
      <FontAwesomeIcon icon={icon} className='mb-4 text-6xl text-gray-300' />
      <h3 className='mb-2 text-xl font-bold text-gray-700'>{title}</h3>
      {description && (
        <p className='max-w-md mb-6 text-gray-500'>{description}</p>
      )}
      {actionButton}
    </section>
  );
}
