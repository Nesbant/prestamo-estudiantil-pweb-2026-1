import { useState } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import Modal from '../../components/ui/Modal';

const Post = ({
  post,
  onToggleFavorite,
  onDeletePost,
  isPreview = false,
  isMyPost = false,
}) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isPrestando = post.status === 'lending';
  const isBuscando = post.status === 'requesting';
  const isPrestadoActualmente = post.status === 'lent';

  let borderColor = '';
  let badgeColor = '';
  let statusText = '';

  if (isPrestando) {
    borderColor = '#00543D'; // Verde
    badgeColor = 'bg-green-100 text-green-800';
    statusText = 'Prestando';
  } else if (isBuscando) {
    borderColor = '#3B82F6'; // Azul
    badgeColor = 'bg-blue-100 text-blue-800';
    statusText = 'Buscando';
  } else {
    borderColor = '#6b7280'; // Gris
    badgeColor = 'bg-gray-200 text-gray-800';
    statusText = 'Prestado actualmente';
  }

  const isDisabled = isPrestadoActualmente;

  return (
    <>
      <article
        className='flex h-full p-4 bg-white border border-gray-200 rounded-md shadow-sm'
        style={{ borderLeft: `5px solid ${borderColor}` }}
      >
        {/* Imagen del objeto */}
        <div
          onClick={() => !isPreview && navigate(`/post/${post.id}`)}
          className={`w-24 h-24 mr-4 shrink-0 sm:w-32 sm:h-32 ${!isPreview ? 'cursor-pointer' : ''}`}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className={`object-cover w-full h-full rounded ${!isPreview ? 'transition-transform hover:opacity-90' : ''}`}
          />
        </div>

        {/* Contenido derecho */}
        <div className='flex flex-col w-full grow'>
          <div className='flex items-start justify-between mb-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded ${badgeColor}`}
              >
                {statusText}
              </span>
              <span className='flex items-center gap-1 text-xs font-medium text-gray-600'>
                <span className='w-1.5 h-1.5 rounded-full bg-gray-400'></span>
                {post.category}
              </span>
            </div>
            <button
              onClick={onToggleFavorite}
              className='transition-colors cursor-pointer shrink-0'
              title={
                post.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'
              }
            >
              <FontAwesomeIcon
                icon={post.isFavorite ? faStarSolid : faStarRegular}
                className={`text-xl ${post.isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}
              />
            </button>
          </div>

          <h3
            onClick={() => !isPreview && navigate(`/post/${post.id}`)}
            className={`text-xl font-bold text-gray-900 line-clamp-1 ${!isPreview ? 'cursor-pointer hover:text-[#00543D] hover:underline' : ''}`}
          >
            {post.title}
          </h3>
          <p className='mb-4 text-sm text-gray-600 line-clamp-2'>
            {post.description}
          </p>

          {/* Divisor y Botones inferiores */}
          <div className='flex flex-wrap items-center justify-between gap-3 pt-3 mt-auto border-t border-gray-200'>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
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
              {isPrestadoActualmente && (
                <>
                  <FontAwesomeIcon icon={faRotateLeft} />{' '}
                  <span>Retorno en {post.returnDays} días</span>
                </>
              )}
            </div>

            {!isPreview && isMyPost && (
              <div className='flex items-center gap-2'>
                <button
                  disabled={isDisabled}
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${isDisabled ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                >
                  <FontAwesomeIcon icon={faPen} /> Editar
                </button>
                <button
                  disabled={isDisabled}
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${isDisabled ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
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
