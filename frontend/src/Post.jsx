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

const Post = ({ post, onToggleFavorite, onDeletePost, isPreview = false }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isPrestando = post.status === 'prestando';
  const isBuscando = post.status === 'buscando';
  const isPrestadoActualmente = post.status === 'prestado_actualmente';

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

            {!isPreview && (
              <div className='flex items-center gap-2'>
                <button
                  disabled={isDisabled}
                  onClick={() => navigate(`/editar/${post.id}`)}
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
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='flex flex-col items-center w-full max-w-lg p-8 bg-white shadow-xl rounded-2xl'>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className='mb-4 text-5xl text-red-500'
            />
            <h3 className='mb-2 text-2xl font-bold text-gray-900'>
              ¿Borrar Publicación?
            </h3>
            <p className='mb-6 text-center text-gray-600'>
              ¿Estás seguro de que deseas eliminar esta publicación? Esta acción
              es permanente y no se puede deshacer.
            </p>

            {/* Tarjeta de vista previa */}
            <div className='w-full mb-8 text-left pointer-events-none opacity-90'>
              <Post post={post} isPreview={true} />
            </div>

            <div className='flex justify-center w-full gap-4'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer'
              >
                Cancelar
              </button>
              <button
                onClick={onDeletePost}
                className='px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer'
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
