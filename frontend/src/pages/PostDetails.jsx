import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faStar as faStarSolid,
  faMapMarkerAlt,
  faShieldAlt,
  faPaperPlane,
  faCommentDots,
  faPen,
  faHandHoldingHeart,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendarAlt,
  faStar as faStarRegular,
} from '@fortawesome/free-regular-svg-icons';
import { PostContext } from '../features/posts/PostContext';
import { useAuth } from '../features/auth/AuthContext';
import Modal from '../components/ui/Modal';
import {
  getPostById,
  toggleFavorite as toggleFavoriteApi,
  requestLoan,
} from '../features/posts/postService';
import { findOrCreateChat } from '../features/chat/chatService';

// Mini componente para las tarjetas de información a la izquierda
const InfoCard = ({ icon, label, value }) => (
  <div className='flex items-center gap-4 p-4 bg-white border border-gray-200 shadow-sm rounded-xl'>
    <FontAwesomeIcon icon={icon} className='text-2xl text-[#00543D] shrink-0' />
    <div className='flex flex-col'>
      <span className='text-xs text-gray-500'>{label}</span>
      <span className='text-sm font-semibold text-gray-800'>{value}</span>
    </div>
  </div>
);

// Mini componente para la caja de garantía
const GuaranteeBox = () => (
  <div className='flex items-start gap-4 p-4 mb-6 bg-gray-100 border border-gray-200 rounded-xl'>
    <div className='mt-1 text-2xl text-gray-500 shrink-0'>
      <FontAwesomeIcon icon={faShieldAlt} />
    </div>
    <div>
      <h4 className='font-semibold text-gray-800'>Garantía Safe Campus</h4>
      <p className='mt-1 text-xs leading-relaxed text-gray-600'>
        Tu seguridad es nuestra prioridad. Todos los préstamos están respaldados
        por el acuerdo de convivencia estudiantil. Revisa siempre el estado del
        artículo al recibirlo.
      </p>
    </div>
  </div>
);

export default function PostPage() {
  const { posts, setPosts } = useContext(PostContext);
  const { currentUser, token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [postDetails, setPostDetails] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [openingChat, setOpeningChat] = useState(false);

  const post = postDetails || posts.find((p) => p.id === id);
  const author = post?.author || {};
  const authorName = author.name || 'Usuario';
  const authorAvatar =
    author.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=00543D&color=fff`;

  useEffect(() => {
    async function loadPost() {
      try {
        setLoadingPost(true);
        const data = await getPostById(id, token);
        setPostDetails(data);
      } catch {
        setError('No se pudo cargar la publicacion.');
      } finally {
        setLoadingPost(false);
      }
    }
    loadPost();
  }, [id, token]);

  if (loadingPost) {
    return <p className='p-8 text-center text-gray-600'>Cargando...</p>;
  }

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

  const submitLoanRequest = async (closeModal) => {
    try {
      setError('');
      await requestLoan(post.id, token);
      closeModal(false);
      setShowSuccessModal(true);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo enviar la solicitud.');
      closeModal(false);
    }
  };

  const handleRequestConfirm = () => submitLoanRequest(setShowRequestModal);
  const handleOfferConfirm = () => submitLoanRequest(setShowOfferModal);

  const toggleFavorite = async () => {
    try {
      setError('');
      const { isFavorite } = await toggleFavoriteApi(post.id, token);
      setPostDetails((currentPost) =>
        currentPost ? { ...currentPost, isFavorite } : currentPost,
      );
      setPosts((currentPosts) =>
        currentPosts.map((item) =>
          item.id === post.id ? { ...item, isFavorite } : item,
        ),
      );
    } catch (favoriteError) {
      setError(favoriteError.message || 'No se pudo actualizar favoritos.');
    }
  };

  const isPrestando = post.status === 'lending';
  const isBuscando = post.status === 'requesting';

  const isMyPost = currentUser && currentUser.id === post.authorId;

  const openChat = async () => {
    if (openingChat) return;

    setOpeningChat(true);
    setError('');
    try {
      if (post.authorId) {
        const chat = await findOrCreateChat(
          post.authorId,
          token,
          post.title,
          post.id,
        );
        navigate('/chat', {
          state: {
            newContact: {
              id: post.authorId,
              chatId: chat.id,
              name: authorName,
              avatar: authorAvatar,
              item: post.title,
              postId: post.id,
            },
          },
        });
      }
    } catch {
      setError('No se pudo iniciar el chat.');
    } finally {
      setOpeningChat(false);
    }
  };

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
    <main className='max-w-6xl px-6 mx-auto mt-10'>
      <button
        onClick={() => navigate(-1)}
        className='mb-6 flex items-center gap-2 font-medium text-gray-600 hover:text-[#00543D] transition-colors cursor-pointer'
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Volver
      </button>
      {error && (
        <div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
        {/* Columna Izquierda: Imagen y Tarjetas de Referencia */}
        <div className='flex flex-col h-full gap-4 md:col-span-5 lg:col-span-6'>
          <div className='relative flex overflow-hidden bg-gray-100 border border-gray-200 grow min-h-75 rounded-2xl'>
            <img
              src={post.imageUrl}
              alt={post.title}
              className='absolute inset-0 object-cover w-full h-full'
            />
          </div>

          <div className='flex flex-col gap-4'>
            <InfoCard
              icon={faCalendarAlt}
              label='Tiempo inicial'
              value={post.loanDuration || 'A coordinar'}
            />
            <InfoCard
              icon={faMapMarkerAlt}
              label='Lugar de recojo'
              value={post.pickupLocation || 'A coordinar'}
            />
          </div>
        </div>

        {/* Columna Derecha: Detalles del Post y Acciones */}
        <div className='flex flex-col gap-6 md:col-span-7 lg:col-span-6'>
          {/* Tarjeta Principal de Detalles */}
          <div className='relative p-6 bg-white border border-gray-200 shadow-sm rounded-2xl'>
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
              {!isMyPost && (
                <button
                  onClick={toggleFavorite}
                  className='text-2xl transition-colors cursor-pointer shrink-0'
                >
                  <FontAwesomeIcon
                    icon={post.isFavorite ? faStarSolid : faStarRegular}
                    className={
                      post.isFavorite
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-gray-400'
                    }
                  />
                </button>
              )}
            </div>

            <h1 className='mb-4 text-3xl font-bold text-gray-900'>
              {post.title}
            </h1>
            <p className='mb-6 leading-relaxed text-gray-600'>
              {post.description}
            </p>

            <hr className='mb-6 border-gray-200' />

            {/* Fila del Usuario */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <img
                  src={authorAvatar}
                  alt='Avatar'
                  className='object-cover w-12 h-12 border border-gray-200 rounded-full'
                />
                <div className='flex flex-col'>
                  <span className='font-semibold text-gray-800'>
                    {authorName}
                  </span>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <FontAwesomeIcon
                      icon={faStarSolid}
                      className='text-xs text-yellow-400'
                    />
                    <span className='font-medium'>
                      {post.rating?.toFixed(1) || '5.0'}
                    </span>
                    <span>({post.completedLoans || 0} préstamos)</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end text-sm text-gray-400'>
                <span>Publicado</span>
                <span className='font-medium'>
                  {post.timeAgo || 'hace poco'}
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Acciones */}
          <div className='p-6 bg-white border border-gray-200 shadow-sm rounded-2xl'>
            <GuaranteeBox />

                <div className='flex flex-col gap-3'>
                  {isMyPost ? (
                <button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className='flex items-center justify-center w-full gap-2 py-3.5 font-semibold text-gray-800 transition-colors bg-gray-100 cursor-pointer rounded-xl hover:bg-gray-200'
                >
                  <FontAwesomeIcon icon={faPen} /> Editar mi publicación
                </button>
              ) : (
                <>
                  {isPrestando && (
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className='flex items-center justify-center w-full gap-2 py-3.5 font-semibold text-white transition-colors shadow-sm cursor-pointer bg-[#00543D] rounded-xl hover:bg-[#00402e]'
                    >
                      <FontAwesomeIcon icon={faPaperPlane} /> Solicitar préstamo
                    </button>
                  )}
                  {isBuscando && (
                    <button
                      onClick={() => setShowOfferModal(true)}
                      className='flex items-center justify-center w-full gap-2 py-3.5 font-semibold text-white transition-colors shadow-sm cursor-pointer bg-[#00543D] rounded-xl hover:bg-[#00402e]'
                    >
                      <FontAwesomeIcon icon={faHandHoldingHeart} /> Ofrecer
                      artículo
                    </button>
                  )}
                  {post.status === 'lent' && (
                    <button
                      disabled
                      className='flex items-center justify-center w-full gap-2 py-3.5 font-semibold text-gray-500 bg-gray-200 rounded-xl cursor-not-allowed'
                    >
                      No disponible actualmente
                    </button>
                  )}
                  <button
                    onClick={openChat}
                    disabled={openingChat}
                    className='flex items-center justify-center w-full gap-2 py-3.5 font-semibold text-gray-700 transition-colors bg-white border border-gray-300 cursor-pointer rounded-xl hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    <FontAwesomeIcon icon={faCommentDots} />{' '}
                    {openingChat ? 'Abriendo chat...' : 'Enviar mensaje'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales de Interacción */}
      {showRequestModal && (
        <Modal
          titulo='Confirmar Solicitud'
          mensaje={`¿Estás seguro que deseas solicitar el préstamo de "${post.title}" a ${authorName}?`}
          confirmText='Sí, solicitar'
          onConfirm={handleRequestConfirm}
          onClose={() => setShowRequestModal(false)}
          icon={faPaperPlane}
        />
      )}

      {showOfferModal && (
        <Modal
          titulo='Ofrecer Artículo'
          mensaje={`¿Deseas ofrecer tu artículo "${post.title}" a ${authorName}?`}
          confirmText='Sí, ofrecer'
          onConfirm={handleOfferConfirm}
          onClose={() => setShowOfferModal(false)}
          icon={faHandHoldingHeart}
        />
      )}

      {showSuccessModal && (
        <Modal
          titulo='¡Operación exitosa!'
          mensaje='El usuario ha sido notificado. Te avisaremos cuando haya una respuesta.'
          confirmText='Entendido'
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </main>
  );
}
