import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faEye,
  faClock,
  faStar as faStarSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

export default function PostPage({ posts, setPosts }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className='flex flex-col items-center justify-center h-[60vh]'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Publicación no encontrada
        </h2>
        <button
          onClick={() => navigate('/')}
          className='mt-4 px-6 py-2 font-medium text-white transition-colors bg-[#00543D] rounded-lg hover:bg-[#00402e] cursor-pointer'
        >
          Volver a explorar
        </button>
      </div>
    );
  }

  const toggleFavorite = () => {
    setPosts(
      posts.map((p) =>
        p.id === post.id ? { ...p, isFavorite: !p.isFavorite } : p,
      ),
    );
  };

  const isPrestando = post.status === 'prestando';
  const isBuscando = post.status === 'buscando';

  let badgeColor = isPrestando
    ? 'bg-green-100 text-green-800'
    : isBuscando
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-200 text-gray-800';
  let statusText = isPrestando
    ? 'Prestando'
    : isBuscando
      ? 'Buscando'
      : 'Prestado actualmente';

  return (
    <main className='max-w-5xl px-6 mx-auto mt-10'>
      <button
        onClick={() => navigate(-1)}
        className='mb-6 flex items-center gap-2 font-medium text-gray-600 hover:text-[#00543D] transition-colors cursor-pointer'
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Volver
      </button>

      <div className='flex flex-col overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl md:flex-row'>
        {/* Lado de la Imagen */}
        <div className='flex items-center justify-center bg-gray-100 md:w-1/2 min-h-[300px] md:min-h-[400px]'>
          <img
            src={post.imageUrl}
            alt={post.title}
            className='object-cover w-full h-full'
          />
        </div>

        {/* Lado de los Detalles */}
        <div className='flex flex-col p-8 md:w-1/2'>
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeColor}`}
              >
                {statusText}
              </span>
              <span className='text-sm font-medium text-gray-500'>
                {post.category}
              </span>
            </div>
            <button
              onClick={toggleFavorite}
              className='transition-colors cursor-pointer shrink-0'
            >
              <FontAwesomeIcon
                icon={post.isFavorite ? faStarSolid : faStarRegular}
                className={`text-2xl ${post.isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}
              />
            </button>
          </div>

          <h1 className='mb-4 text-3xl font-bold text-gray-900'>
            {post.title}
          </h1>
          <p className='flex-grow mb-6 leading-relaxed text-gray-600'>
            {post.description}
          </p>

          <div className='pt-4 mb-8 text-sm text-gray-500 border-t border-gray-100 flex items-center gap-4'>
            {isPrestando && (
              <>
                <FontAwesomeIcon icon={faEye} />{' '}
                <span>{post.views} vistas</span>
              </>
            )}
            {isBuscando && (
              <>
                <FontAwesomeIcon icon={faClock} /> <span>{post.timeAgo}</span>
              </>
            )}
          </div>

          <div className='flex gap-4 mt-auto'>
            <button className='flex-1 px-6 py-3 font-medium text-white transition-colors bg-[#00543D] rounded-lg hover:bg-[#00402e] cursor-pointer'>
              Contactar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
