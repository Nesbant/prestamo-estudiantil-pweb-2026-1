import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapSigns } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className='flex flex-col items-center justify-center h-[75vh] px-6 text-center'>
      <FontAwesomeIcon
        icon={faMapSigns}
        className='text-6xl text-gray-300 mb-6'
      />
      <h1 className='text-6xl font-bold text-gray-800 mb-4'>404</h1>
      <h2 className='text-2xl font-semibold text-gray-600 mb-4'>
        Página no encontrada
      </h2>
      <p className='text-gray-500 mb-8 max-w-md'>
        Parece que te has perdido. La página que estás buscando no existe o ha
        sido movida.
      </p>
      <button
        onClick={() => navigate('/')}
        className='px-6 py-3 font-medium text-white transition-colors bg-[#00543D] rounded-lg hover:bg-[#00402e] cursor-pointer'
      >
        Volver al inicio
      </button>
    </main>
  );
}
