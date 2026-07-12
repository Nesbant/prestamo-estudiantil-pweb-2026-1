import { useContext, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Post from '../features/posts/Post';
import { PostContext } from '../features/posts/PostContext';
import { useAuth } from '../features/auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import EmptyState from '../components/ui/EmptyState';

export default function ExplorePage() {
  const { posts } = useContext(PostContext);
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Paginación
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const postsPerPage = 12;

  const isMounted = useRef(false);

  // Búsqueda y filtros
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === '' || post.category === categoryFilter;
    const matchesType = typeFilter === 'all' || post.status === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setSearchParams({ page: totalPages }, { replace: true });
    }
  }, [currentPage, totalPages, setSearchParams]);

  useEffect(() => {
    if (isMounted.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      isMounted.current = true;
    }
  }, [currentPage]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setSearchParams({ page: 1 });
  };

  return (
    <main className='mt-6 mx-15'>
      <section className='mb-8'>
        <h1 className='mb-2 text-4xl font-semibold'>Explorar Publicaciones</h1>
        <p className='text-gray-600'>
          Descubre artículos que otros estudiantes están prestando o buscando.
        </p>
      </section>

      {/* Búsqueda y filtros */}
      <section className='flex flex-col gap-4 mb-8 md:flex-row'>
        <div className='relative grow'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
            <FontAwesomeIcon icon={faSearch} className='text-gray-400' />
          </div>
          <input
            type='text'
            className='w-full h-12 pl-11 pr-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#00543D] focus:ring-1 focus:ring-[#00543D] transition-colors shadow-sm'
            placeholder='Buscar artículos por nombre...'
            value={searchTerm}
            onChange={handleFilterChange(setSearchTerm)}
          />
        </div>

        <div className='flex gap-4 pb-2 overflow-x-auto shrink-0 md:pb-0'>
          <select
            className='h-12 px-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#00543D] focus:ring-1 focus:ring-[#00543D] transition-colors text-gray-700 shadow-sm cursor-pointer'
            value={categoryFilter}
            onChange={handleFilterChange(setCategoryFilter)}
          >
            <option value=''>Todas las categorías</option>
            <option value='Tecnología'>Tecnología</option>
            <option value='Libros'>Libros</option>
            <option value='Materiales'>Materiales</option>
            <option value='Ropa'>Ropa</option>
            <option value='Otros'>Otros</option>
          </select>
          <select
            className='h-12 px-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#00543D] focus:ring-1 focus:ring-[#00543D] transition-colors text-gray-700 shadow-sm cursor-pointer'
            value={typeFilter}
            onChange={handleFilterChange(setTypeFilter)}
          >
            <option value='all'>Todos los tipos</option>
            <option value='lending'>Prestando</option>
            <option value='requesting'>Buscando</option>
          </select>
        </div>
      </section>

      {/* Resultados */}
      {paginatedPosts.length > 0 ? (
        <>
          <section className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {paginatedPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                isMyPost={post.authorId === currentUser?.id}
              />
            ))}
          </section>

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
          title='No se encontraron resultados'
          description='Intenta ajustar tu búsqueda o cambiar los filtros para encontrar lo que necesitas.'
        />
      )}
    </main>
  );
}
