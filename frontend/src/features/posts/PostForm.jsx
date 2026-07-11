import { useState, useEffect, useContext } from 'react';
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
import { PostContext } from './PostContext';
import { useAuth } from '../auth/AuthContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';

export default function PostForm() {
  const { posts, handleAddPost, handleUpdatePost } = useContext(PostContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [type, setType] = useState('lend');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loanDuration, setLoanDuration] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPost, setCreatedPost] = useState(null);

  const categories = ['Tecnología', 'Libros', 'Materiales', 'Ropa', 'Otros'];

  useEffect(() => {
    if (isEditing && posts.length > 0) {
      const postToEdit = posts.find((p) => p.id === Number(id));
      if (postToEdit) {
        setType(postToEdit.status === 'requesting' ? 'request' : 'lend');
        setTitle(postToEdit.title);
        setCategory(postToEdit.category);
        setDescription(postToEdit.description);
        setLoanDuration(postToEdit.loanDuration || '');
        setPickupLocation(postToEdit.pickupLocation || '');
        setImageUrl(postToEdit.imageUrl || '');
      }
    }
  }, [id, posts, isEditing]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Guarda la imagen en formato DataURL
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    const finalImageUrl =
      imageUrl ||
      `https://placehold.co/200x200?text=${encodeURIComponent(category || 'Articulo')}`;

    if (isEditing) {
      const existingPost = posts.find((p) => p.id === Number(id));
      const updatedPost = {
        ...existingPost,
        status: type === 'lend' ? 'lending' : 'requesting',
        category: category || 'Otros',
        title: title || 'Sin título',
        description: description || 'Sin descripción',
        loanDuration: loanDuration || 'A coordinar',
        pickupLocation: pickupLocation || 'A coordinar',
        imageUrl: finalImageUrl,
      };
      handleUpdatePost(updatedPost);
      setCreatedPost(updatedPost);
    } else {
      const newPost = {
        id: Date.now(),
        status: type === 'lend' ? 'lending' : 'requesting',
        category: category || 'Otros',
        title: title || 'Sin título',
        description: description || 'Sin descripción',
        loanDuration: loanDuration || 'A coordinar',
        pickupLocation: pickupLocation || 'A coordinar',
        imageUrl: finalImageUrl,
        views: 0,
        isFavorite: false,
        timeAgo: 'hace un momento',
        authorId: currentUser?.id,
        authorName: currentUser?.name || 'Usuario Anónimo',
        authorAvatar:
          currentUser?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=00543D&color=fff`,
        rating: 5.0,
        completedLoans: 0,
      };
      handleAddPost(newPost);
      setCreatedPost(newPost);
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Modal
        icon={faCheckCircle}
        titulo={
          isEditing ? '¡Publicación Actualizada!' : '¡Publicación Creada!'
        }
        mensaje={
          isEditing
            ? 'Los cambios en tu publicación se han guardado exitosamente.'
            : 'Tu artículo ha sido publicado exitosamente en CampusLend. Ahora otros estudiantes de la comunidad podrán verlo e interactuar con tu publicación.'
        }
        maxWidthClass='max-w-2xl'
      >
        {/* Preview del post creado, bloqueado para clicks de edición para que solo se vea visualmente */}
        <div className='w-full mb-8 text-left pointer-events-none opacity-90'>
          <Post post={createdPost} isPreview={true} />
        </div>

        <div className='flex justify-center gap-4'>
          <button
            onClick={() =>
              navigate(`/post/${createdPost.id}`, { replace: true })
            }
            className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white transition-colors bg-[#00543D] rounded-lg cursor-pointer hover:bg-[#00402e]'
          >
            <FontAwesomeIcon icon={faEye} /> Ver mi publicación
          </button>
          <button
            onClick={() => navigate('/', { replace: true })}
            className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300'
          >
            <FontAwesomeIcon icon={faStore} /> Regresar a explorar
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-2xl p-6 sm:p-8 bg-white shadow-xl rounded-2xl max-h-[95vh] overflow-y-auto'>
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
              onClick={() => setType('lend')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${type === 'lend' ? 'bg-white text-[#00543D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faHandHoldingHeart} /> Prestar
            </button>
            <button
              type='button'
              onClick={() => setType('request')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${type === 'request' ? 'bg-white text-[#00543D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faBullhorn} /> Solicitar
            </button>
          </div>
        </div>

        <Input
          label='Título'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Ej. Calculadora Científica Casio'
        />

        <Select
          label='Categoría'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories}
          placeholder='Selecciona una categoría...'
        />

        <Textarea
          label='Descripción detallada'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Describe el estado del artículo, condiciones del préstamo, etc.'
        />

        {/* Campos Nuevos: Tiempo y Lugar */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Input
            label='Tiempo de préstamo inicial'
            value={loanDuration}
            onChange={(e) => setLoanDuration(e.target.value)}
            placeholder='Ej. 1 semana (negociable)'
          />
          <Input
            label='Lugar de referencia para recojo'
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder='Ej. Biblioteca Central'
          />
        </div>

        {/* Fotos */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-2'>
            <label className='text-sm font-medium text-gray-700'>Fotos</label>
            <span className='text-xs text-gray-500'>Opcional</span>
          </div>
          <div className='relative flex flex-col items-center justify-center overflow-hidden transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer min-h-50 bg-gray-50 hover:bg-gray-100'>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer'
            />
            {imageUrl ? (
              <img
                src={imageUrl}
                alt='Vista previa'
                className='absolute inset-0 object-cover w-full h-full'
              />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faImage}
                  className='mb-2 text-3xl text-gray-400'
                />
                <span className='text-sm text-gray-500'>
                  Haz clic para subir o arrastra tu foto aquí
                </span>
              </>
            )}
          </div>
        </div>

        {/* Divisor y Botones */}
        <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
          <button
            type='button'
            onClick={() => navigate('/activity')}
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
