import NavButton from './NavButton';
import Stat from './Stat';
import Post from './Post';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  faListCheck,
  faClipboardList,
  faSquareCheck,
  faStar,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Layout({ posts, setPosts, onDeletePost }) {
  const [activeTab, setActiveTab] = useState('todas');

  // Función para alternar el estado de favorito
  const toggleFavorite = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, isFavorite: !post.isFavorite } : post,
      ),
    );
  };

  // Cálculos dinámicos para las estadísticas
  const countPrestando = posts.filter((p) => p.status === 'prestando').length;
  const countBuscando = posts.filter((p) => p.status === 'buscando').length;
  const countPrestado = posts.filter(
    (p) => p.status === 'prestado_actualmente',
  ).length;
  const countFavoritos = posts.filter((p) => p.isFavorite).length;

  const navigate = useNavigate();

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
          onClick={() => navigate('/crear')}
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
            isActive={activeTab === 'todas'}
            onClick={() => setActiveTab('todas')}
          >
            Todas
          </NavButton>
          <NavButton
            isActive={activeTab === 'prestando'}
            onClick={() => setActiveTab('prestando')}
          >
            Prestando
          </NavButton>
          <NavButton
            isActive={activeTab === 'buscando'}
            onClick={() => setActiveTab('buscando')}
          >
            Buscando
          </NavButton>
          <NavButton
            isActive={activeTab === 'prestado_actualmente'}
            onClick={() => setActiveTab('prestado_actualmente')}
          >
            Prestados Actualmente
          </NavButton>
        </nav>
      </section>
      <section className='grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 lg:grid-cols-3'>
        {posts
          .filter((post) => activeTab === 'todas' || post.status === activeTab)
          .map((post) => (
            <Post
              key={post.id}
              post={post}
              onToggleFavorite={() => toggleFavorite(post.id)}
              onDeletePost={() => onDeletePost(post.id)}
            />
          ))}
      </section>
    </main>
  );
}
