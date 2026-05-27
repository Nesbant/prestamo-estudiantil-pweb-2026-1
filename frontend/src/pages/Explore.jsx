import { useContext } from 'react';
import Post from '../features/posts/Post';
import { PostContext } from '../features/posts/PostContext';
import { useAuth } from '../features/auth/AuthContext';

export default function ExplorePage() {
  const { posts, setPosts } = useContext(PostContext);
  const { currentUser } = useAuth();

  const toggleFavorite = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, isFavorite: !post.isFavorite } : post,
      ),
    );
  };

  return (
    <main className='mx-15 mt-6'>
      <section className='mb-8'>
        <h1 className='text-4xl font-semibold mb-2'>Explorar Publicaciones</h1>
        <p className='text-gray-600'>
          Descubre artículos que otros estudiantes están prestando o buscando.
        </p>
      </section>

      <section className='grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onToggleFavorite={() => toggleFavorite(post.id)}
            isMyPost={post.authorId === currentUser?.id}
          />
        ))}
      </section>
    </main>
  );
}
