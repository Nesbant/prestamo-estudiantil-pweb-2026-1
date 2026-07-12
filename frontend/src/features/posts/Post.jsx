import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faClock,
  faRotateLeft,
  faPen,
  faTrash,
  faStar as faStarSolid,
  faExclamationTriangle,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../auth/AuthContext';
import { PostContext } from './PostContext';

const Post = ({
  post,
  onDeletePost,
  onToggleFavorite,
  isPreview = false,
  isMyPost = false,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { handleToggleFavorite } = useContext(PostContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isPrestando = post.status === 'lending';
  const isBuscando = post.status === 'requesting';
  const isPrestadoActualmente = post.status === 'lent';

  const { badgeColor, statusText } = isPrestando
    ? { badgeColor: 'bg-[#00543D] text-white', statusText: 'Prestando' }
    : isBuscando
      ? { badgeColor: 'bg-blue-600 text-white', statusText: 'Buscando' }
      : {
          badgeColor: 'bg-gray-800 text-white',
          statusText: 'Prestado actualmente',
        };

  const isDisabled = isPrestadoActualmente;

  return (
    <>
      <article className='relative flex flex-col h-full overflow-hidden transition-all bg-white border border-gray-200 shadow-sm group rounded-2xl hover:shadow-md'>
        {/* Top: Image & Badges */}
        <div
          onClick={() => !isPreview && navigate(`/post/${post.id}`)}
          className={`relative aspect-4/3 overflow-hidden bg-gray-100 ${!isPreview ? 'cursor-pointer' : ''}`}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className={`object-cover w-full h-full transition-transform duration-500 ${!isPreview ? 'group-hover:scale-105' : ''}`}
          />

          {/* Status Badge flotante */}
          <div className='absolute top-3 left-3'>
            <span
              className={`px-3 py-1.5 text-xs font-bold tracking-wide uppercase rounded-lg shadow-sm backdrop-blur-md bg-opacity-95 ${badgeColor}`}
            >
              {statusText}
            </span>
          </div>

          {/* Favorite Button flotante */}
          {currentUser && !isMyPost && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) {
                  onToggleFavorite(post.id);
                } else {
                  handleToggleFavorite(post.id);
                }
              }}
              className='absolute p-2.5 transition-colors bg-white/90 rounded-full shadow-sm top-3 right-3 hover:bg-white z-10'
              title={
                post.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'
              }
            >
              <FontAwesomeIcon
                icon={post.isFavorite ? faStarSolid : faStarRegular}
                className={`text-lg ${post.isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}
              />
            </button>
          )}
        </div>

        {/* Bottom: Content */}
        <div className='flex flex-col p-5 grow'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-bold tracking-wider text-[#00543D] uppercase'>
              {post.category}
            </span>
            <div className='flex items-center gap-1.5 text-xs font-medium text-gray-500'>
              {isPrestando && (
                <>
                  <FontAwesomeIcon icon={faEye} /> {post.views}
                </>
              )}
              {isBuscando && (
                <>
                  <FontAwesomeIcon icon={faClock} /> {post.timeAgo}
                </>
              )}
              {isPrestadoActualmente && (
                <>
                  <FontAwesomeIcon icon={faRotateLeft} /> {post.returnDays}d
                </>
              )}
            </div>
          </div>

          <h3
            onClick={() => !isPreview && navigate(`/post/${post.id}`)}
            className={`mb-2 text-lg font-bold text-gray-900 line-clamp-1 ${!isPreview ? 'cursor-pointer hover:text-[#00543D]' : ''}`}
          >
            {post.title}
          </h3>

          <p className='mb-4 text-sm text-gray-600 line-clamp-2 grow'>
            {post.description}
          </p>

          {/* Footer: Author & Location / Actions */}
          <div className='flex flex-col gap-4 pt-4 mt-auto border-t border-gray-100'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <img
                  src={
                    post.author?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&background=00543D&color=fff`
                  }
                  alt={post.author?.name}
                  className='object-cover border border-gray-200 rounded-full w-7 h-7'
                />
                <span className='text-xs font-medium text-gray-700 truncate max-w-25'>
                  {post.author?.name || 'Usuario'}
                </span>
              </div>
              {post.pickupLocation && (
                <span className='flex items-center gap-1 text-xs text-gray-500 truncate max-w-30'>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className='text-gray-400'
                  />
                  {post.pickupLocation}
                </span>
              )}
            </div>

            {!isPreview && isMyPost && (
              <div className='flex items-center gap-2 pt-3 border-t border-gray-50'>
                <button
                  disabled={isDisabled}
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${isDisabled ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                >
                  <FontAwesomeIcon icon={faPen} /> Editar
                </button>
                <button
                  disabled={isDisabled}
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${isDisabled ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
                >
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Modal de Confirmación de Eliminación */}
      {!isPreview && showDeleteConfirm && (
        <Modal
          titulo='¿Borrar Publicación?'
          mensaje='¿Estás seguro de que deseas eliminar esta publicación? Esta acción es permanente y no se puede deshacer.'
          icon={faExclamationTriangle}
          iconClassName='text-red-500'
          confirmText='Sí, eliminar'
          onConfirm={onDeletePost}
          onClose={() => setShowDeleteConfirm(false)}
        >
          {/* Tarjeta de vista previa */}
          <div className='pointer-events-none opacity-90'>
            <Post post={post} isPreview={true} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default Post;
