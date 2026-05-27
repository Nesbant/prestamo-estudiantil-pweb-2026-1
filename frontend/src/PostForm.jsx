import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandHoldingHeart,
  faBullhorn,
  faImage,
  faPaperPlane,
  faCheckCircle,
  faEye,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import Post from './Post';
export default function PostForm({ onAddPost, onUpdatePost, posts = [] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [type, setType] = useState('prestar');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPost, setCreatedPost] = useState(null);

  const categories = ['Tecnología', 'Libros', 'Materiales', 'Ropa', 'Otros'];

  useEffect(() => {
    if (isEditing && posts.length > 0) {
      const postToEdit = posts.find((p) => p.id === Number(id));
      if (postToEdit) {
        setType(postToEdit.status === 'buscando' ? 'solicitar' : 'prestar');
        setTitle(postToEdit.title);
        setCategory(postToEdit.category);
        setDescription(postToEdit.description);
      }
    }
  }, [id, posts, isEditing]);

  const handlePublish = () => {
    if (isEditing) {
      const existingPost = posts.find((p) => p.id === Number(id));
      const updatedPost = {
        ...existingPost,
        status: type === 'prestar' ? 'prestando' : 'buscando',
        category: category || 'Otros',
        title: title || 'Sin título',
        description: description || 'Sin descripción',
      };
      onUpdatePost(updatedPost);
      setCreatedPost(updatedPost);
    } else {
      const newPost = {
        id: Date.now(),
        status: type === 'prestar' ? 'prestando' : 'buscando',
        category: category || 'Otros',
        title: title || 'Sin título',
        description: description || 'Sin descripción',
        imageUrl: `https://placehold.co/200x200?text=${encodeURIComponent(category || 'Articulo')}`,
        views: 0,
        isFavorite: false,
        timeAgo: 'hace un momento',
      };
      onAddPost(newPost);
      setCreatedPost(newPost);
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
        <div className='flex flex-col items-center w-full max-w-2xl p-8 text-center bg-white shadow-xl rounded-2xl'>
          <FontAwesomeIcon
            icon={faCheckCircle}
            className='mb-4 text-6xl text-[#00543D]'
          />
          <h2 className='mb-2 text-3xl font-bold text-gray-800'>
            {isEditing ? '¡Publicación Actualizada!' : '¡Publicación Creada!'}
          </h2>
          <p className='mb-6 text-gray-600'>
            {isEditing
              ? 'Los cambios en tu publicación se han guardado exitosamente.'
              : 'Tu artículo ha sido publicado exitosamente en CampusLend. Ahora otros estudiantes de la comunidad podrán verlo e interactuar con tu publicación.'}
          </p>

          {/* Preview del post creado, bloqueado para clicks de edición para que solo se vea visualmente */}
          <div className='w-full mb-8 text-left pointer-events-none opacity-90'>
            <Post post={createdPost} isPreview={true} />
          </div>

          <div className='flex justify-center gap-4'>
            <button
              onClick={() => navigate(`/post/${createdPost.id}`)}
              className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white transition-colors bg-[#00543D] rounded-lg cursor-pointer hover:bg-[#00402e]'
            >
              <FontAwesomeIcon icon={faEye} /> Ver mi publicación
            </button>
            <button
              onClick={() => navigate('/')}
              className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300'
            >
              <FontAwesomeIcon icon={faStore} /> Regresar a explorar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-2xl p-8 bg-white shadow-xl rounded-2xl'>
        <h2 className='mb-6 text-2xl font-bold text-gray-800'>
          {isEditing ? 'Editar Publicación' : 'Crear Publicación'}
        </h2>

        {/* Tipo de publicación */}
        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium text-gray-700'>
            Tipo de publicación
          </label>
          <div className='flex p-1 bg-gray-200 rounded-lg'>
            <button
              type='button'
              onClick={() => setType('prestar')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${type === 'prestar' ? 'bg-white text-[#00543D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faHandHoldingHeart} /> Prestar
            </button>
            <button
              type='button'
              onClick={() => setType('solicitar')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${type === 'solicitar' ? 'bg-white text-[#00543D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faBullhorn} /> Solicitar
            </button>
          </div>
        </div>

        {/* Título */}
        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-700'>
            Título
          </label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Ej. Calculadora Científica Casio'
            className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00543D]/50'
          />
        </div>

        {/* Categoría */}
        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-700'>
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00543D]/50'
          >
            <option value=''>Selecciona una categoría...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-700'>
            Descripción detallada
          </label>
          <textarea
            rows='4'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Describe el estado del artículo, condiciones del préstamo, etc.'
            className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00543D]/50 resize-none'
          ></textarea>
        </div>

        {/* Fotos */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-2'>
            <label className='text-sm font-medium text-gray-700'>Fotos</label>
            <span className='text-xs text-gray-500'>Opcional, máx 3</span>
          </div>
          <div className='flex flex-col items-center justify-center p-8 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
            <FontAwesomeIcon
              icon={faImage}
              className='mb-2 text-3xl text-gray-400'
            />
            <span className='text-sm text-gray-500'>
              Subir foto o arrastrar foto
            </span>
          </div>
        </div>

        {/* Divisor y Botones */}
        <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='px-6 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300'
          >
            Cancelar
          </button>
          <button
            type='button'
            onClick={handlePublish}
            className='flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#00543D] rounded-lg cursor-pointer hover:bg-[#00402e] transition-colors'
          >
            <FontAwesomeIcon icon={faPaperPlane} />{' '}
            {isEditing ? 'Guardar Cambios' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}
