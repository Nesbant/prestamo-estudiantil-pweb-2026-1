import NavButton from '../components/ui/NavButton';
import Stat from '../components/ui/Stat';
import Post from '../features/posts/Post';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  faListCheck,
  faClipboardList,
  faSquareCheck,
  faStar,
  faPlus,
  faBoxOpen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PostContext } from '../features/posts/PostContext';
import { useAuth } from '../features/auth/AuthContext';

export default function Home() {
  const { posts, setPosts, handleDeletePost } = useContext(PostContext);
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  // Función para alternar el estado de favorito
  const toggleFavorite = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, isFavorite: !post.isFavorite } : post,
      ),
    );
  };

  // Filtrar solo las publicaciones del usuario actual
  const myPosts = posts.filter((p) => p.authorId === currentUser?.id);

  // Cálculos dinámicos para las estadísticas
  const countPrestando = myPosts.filter((p) => p.status === 'lending').length;
  const countBuscando = myPosts.filter((p) => p.status === 'requesting').length;
  const countPrestado = myPosts.filter((p) => p.status === 'lent').length;
  const countFavoritos = myPosts.filter((p) => p.isFavorite).length;

  const navigate = useNavigate();

  const filteredPosts = myPosts.filter(
    (post) => activeTab === 'all' || post.status === activeTab,
  );

  return (
    <main className='mx-15'>
      <section className='flex flex-wrap items-center justify-between gap-4 mt-6 mb-8'>
        <div>
          <h1 className='text-4xl font-semibold'>Mis Publicaciones</h1>
          <h2 className='mt-2 text-gray-600'>
            Gestiona los articulos que ofreces y los que estes buscando
          </h2>
        </div>
        <button
          onClick={() => navigate('/create')}
          className='flex items-center gap-2 px-6 py-2.5 font-medium text-white transition-colors bg-[#00543D] rounded-full hover:bg-[#00402e] cursor-pointer'
        >
          <FontAwesomeIcon icon={faPlus} /> Nueva Publicación
        </button>
      </section>
      <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <Stat
          title='Ofrecidos'
          total={countPrestando}
          description='Artículos disponibles'
          color='#00543D'
          icon={faListCheck}
        />
        <Stat
          title='Buscados'
          total={countBuscando}
          description='Artículos solicitados'
          color='#EAB308'
          icon={faClipboardList}
        />
        <Stat
          title='Prestados'
          total={countPrestado}
          description='En posesión de otros'
          color='#3B82F6'
          icon={faSquareCheck}
        />
        <Stat
          title='Favoritos'
          total={countFavoritos}
          description='Guardados para después'
          color='#EF4444'
          icon={faStar}
        />
      </section>
      <section>
        <nav className='flex gap-8 pb-3 mt-10 mb-8 border-b border-gray-300'>
          <NavButton
            isActive={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            Todas
          </NavButton>
          <NavButton
            isActive={activeTab === 'lending'}
            onClick={() => setActiveTab('lending')}
          >
            Prestando
          </NavButton>
          <NavButton
            isActive={activeTab === 'requesting'}
            onClick={() => setActiveTab('requesting')}
          >
            Buscando
          </NavButton>
          <NavButton
            isActive={activeTab === 'lent'}
            onClick={() => setActiveTab('lent')}
          >
            Prestados Actualmente
          </NavButton>
        </nav>
      </section>
      {filteredPosts.length > 0 ? (
        <section className='grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 lg:grid-cols-3'>
          {filteredPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onToggleFavorite={() => toggleFavorite(post.id)}
              onDeletePost={() => handleDeletePost(post.id)}
              isMyPost={true}
            />
          ))}
        </section>
      ) : (
        <section className='flex flex-col items-center justify-center py-20 mb-12 text-center border-2 border-gray-200 border-dashed bg-gray-50 rounded-2xl'>
          <FontAwesomeIcon
            icon={faBoxOpen}
            className='mb-4 text-6xl text-gray-300'
          />
          <h3 className='mb-2 text-xl font-bold text-gray-700'>
            {myPosts.length === 0
              ? 'Aún no tienes publicaciones'
              : 'No hay publicaciones en esta categoría'}
          </h3>
          <p className='max-w-md mb-6 text-gray-500'>
            {myPosts.length === 0
              ? 'Empieza a compartir o pedir prestado artículos con otros estudiantes de tu campus.'
              : 'Intenta cambiar de pestaña para ver el resto de tus artículos o crea uno nuevo.'}
          </p>
          {myPosts.length === 0 && (
            <button
              onClick={() => navigate('/create')}
              className='flex items-center gap-2 px-6 py-2.5 font-medium text-white transition-colors bg-[#00543D] rounded-lg hover:bg-[#00402e] cursor-pointer'
            >
              <FontAwesomeIcon icon={faPlus} /> Crear mi primera publicación
            </button>
          )}
        </section>
      )}
    </main>
  );
}
