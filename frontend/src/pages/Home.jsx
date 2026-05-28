import NavButton from '../components/ui/NavButton';
import Stat from '../components/ui/Stat';
import Post from '../features/posts/Post';
import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  faListCheck,
  faClipboardList,
  faSquareCheck,
  faStar,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PostContext } from '../features/posts/PostContext';
import { useAuth } from '../features/auth/AuthContext';
import EmptyState from '../components/ui/EmptyState';

export default function Home() {
  const { posts, setPosts, handleDeletePost } = useContext(PostContext);
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  // Paginación a través de URL Params
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const postsPerPage = 12;

  const isMounted = useRef(false);

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

  // Lógica de paginación
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  useEffect(() => {
    if (isMounted.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      isMounted.current = true;
    }
  }, [currentPage, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ page: 1 });
  };

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
            onClick={() => handleTabChange('all')}
          >
            Todas
          </NavButton>
          <NavButton
            isActive={activeTab === 'lending'}
            onClick={() => handleTabChange('lending')}
          >
            Prestando
          </NavButton>
          <NavButton
            isActive={activeTab === 'requesting'}
            onClick={() => handleTabChange('requesting')}
          >
            Buscando
          </NavButton>
          <NavButton
            isActive={activeTab === 'lent'}
            onClick={() => handleTabChange('lent')}
          >
            Prestados Actualmente
          </NavButton>
        </nav>
      </section>
      {paginatedPosts.length > 0 ? (
        <>
          <section className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {paginatedPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onToggleFavorite={() => toggleFavorite(post.id)}
                onDeletePost={() => handleDeletePost(post.id)}
                isMyPost={true}
              />
            ))}
          </section>

          {/* Controles de Paginación */}
          {totalPages > 1 && (
            <div className='flex justify-center gap-2 mt-10 mb-12'>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className='px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Anterior
              </button>
              <span className='flex items-center px-4 font-medium text-gray-700'>
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className='px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={
            myPosts.length === 0
              ? 'Aún no tienes publicaciones'
              : 'No hay publicaciones en esta categoría'
          }
          description={
            myPosts.length === 0
              ? 'Empieza a compartir o pedir prestado artículos con otros estudiantes de tu campus.'
              : 'Intenta cambiar de pestaña para ver el resto de tus artículos o crea uno nuevo.'
          }
          actionButton={
            myPosts.length === 0 && (
              <button
                onClick={() => navigate('/create')}
                className='flex items-center gap-2 px-6 py-2.5 font-medium text-white transition-colors bg-[#00543D] rounded-lg hover:bg-[#00402e] cursor-pointer'
              >
                <FontAwesomeIcon icon={faPlus} /> Crear mi primera publicación
              </button>
            )
          }
        />
      )}
    </main>
  );
}
