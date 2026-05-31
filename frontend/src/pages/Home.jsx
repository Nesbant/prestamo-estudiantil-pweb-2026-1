import NavButton from '../components/ui/NavButton';
import Stat from '../components/ui/Stat';
import Post from '../features/posts/Post';
import { useState, useContext, useEffect, useRef, useMemo } from 'react';
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
import Pagination from '../components/ui/Pagination';

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
  const myPosts = useMemo(
    () => posts.filter((p) => p.authorId === currentUser?.id),
    [posts, currentUser?.id],
  );

  // Cálculos dinámicos para las estadísticas
  const stats = useMemo(() => {
    return myPosts.reduce(
      (acc, post) => {
        if (post.status === 'lending') acc.countPrestando++;
        if (post.status === 'requesting') acc.countBuscando++;
        if (post.status === 'lent') acc.countPrestado++;
        if (post.isFavorite) acc.countFavoritos++;
        return acc;
      },
      {
        countPrestando: 0,
        countBuscando: 0,
        countPrestado: 0,
        countFavoritos: 0,
      },
    );
  }, [myPosts]);

  const navigate = useNavigate();

  const filteredPosts = useMemo(() => {
    return myPosts.filter(
      (post) => activeTab === 'all' || post.status === activeTab,
    );
  }, [myPosts, activeTab]);

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
          total={stats.countPrestando}
          description='Artículos disponibles'
          color='#00543D'
          icon={faListCheck}
        />
        <Stat
          title='Buscados'
          total={stats.countBuscando}
          description='Artículos solicitados'
          color='#EAB308'
          icon={faClipboardList}
        />
        <Stat
          title='Prestados'
          total={stats.countPrestado}
          description='En posesión de otros'
          color='#3B82F6'
          icon={faSquareCheck}
        />
        <Stat
          title='Favoritos'
          total={stats.countFavoritos}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
