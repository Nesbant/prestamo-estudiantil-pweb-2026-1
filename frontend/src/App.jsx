import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Layout from './Layout';
import PostForm from './PostForm';
import PostPage from './PostPage';
import ExplorePage from './ExplorePage';

export default function App() {
  // Estado de publicaciones levantado a App para que no se pierda al navegar
  const [posts, setPosts] = useState([
    {
      id: 1,
      status: 'prestando',
      category: 'Tecnología',
      title: 'Calculadora Científica Casio',
      description:
        'Calculadora en perfecto estado fx-991EX. Ideal para exámenes de cálculo y matrices.',
      imageUrl: 'https://placehold.co/200x200?text=Calculadora',
      views: 125,
      isFavorite: false,
    },
    {
      id: 2,
      status: 'buscando',
      category: 'Libros',
      title: 'Física Universitaria Vol. 2',
      description:
        'Necesito el libro de Sears Zemansky, 14va edición. Lo cuidaré muy bien.',
      imageUrl: 'https://placehold.co/200x200?text=Libro+Fisica',
      timeAgo: 'hace 3 horas',
      isFavorite: false,
    },
    {
      id: 3,
      status: 'prestado_actualmente',
      category: 'Materiales',
      title: 'Juego de Escuadras y Regla T',
      description:
        'Materiales de dibujo técnico, prestados por el ciclo actual.',
      imageUrl: 'https://placehold.co/200x200?text=Escuadras',
      returnDays: 14,
      isFavorite: false,
    },
    {
      id: 4,
      status: 'prestando',
      category: 'Ropa',
      title: 'Bata de Laboratorio Talla M',
      description:
        'Bata blanca 100% algodón, limpia y planchada. Solo para laboratorios de química.',
      imageUrl: 'https://placehold.co/200x200?text=Bata',
      views: 42,
      isFavorite: false,
    },
    {
      id: 5,
      status: 'buscando',
      category: 'Tecnología',
      title: 'Cargador de Laptop HP',
      description:
        'Busco un cargador de punta azul para HP Pavillion, el mío se malogró hoy.',
      imageUrl: 'https://placehold.co/200x200?text=Cargador',
      timeAgo: 'hace 1 día',
      isFavorite: false,
    },
  ]);

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]); // Agrega el nuevo post al inicio
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    );
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={
            <Layout
              posts={posts}
              setPosts={setPosts}
              onDeletePost={handleDeletePost}
            />
          }
        />
        <Route
          path='/crear'
          element={
            <>
              <Layout
                posts={posts}
                setPosts={setPosts}
                onDeletePost={handleDeletePost}
              />
              <PostForm onAddPost={handleAddPost} />
            </>
          }
        />
        <Route
          path='/editar/:id'
          element={
            <>
              <Layout
                posts={posts}
                setPosts={setPosts}
                onDeletePost={handleDeletePost}
              />
              <PostForm posts={posts} onUpdatePost={handleUpdatePost} />
            </>
          }
        />
        <Route
          path='/post/:id'
          element={<PostPage posts={posts} setPosts={setPosts} />}
        />
        <Route path='/explorar' element={<ExplorePage />} />
      </Routes>
    </BrowserRouter>
  );
}
