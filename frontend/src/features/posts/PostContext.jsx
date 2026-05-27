import { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      status: 'lending',
      category: 'Tecnología',
      title: 'Calculadora Científica Casio',
      description:
        'Calculadora en perfecto estado fx-991EX. Ideal para exámenes de cálculo y matrices.',
      imageUrl: 'https://placehold.co/200x200?text=Calculadora',
      views: 125,
      isFavorite: false,
      timeAgo: 'hace 2 horas',
      authorId: 101,
      authorName: 'Ana Ruiz',
      authorAvatar:
        'https://ui-avatars.com/api/?name=Ana+Ruiz&background=00543D&color=fff',
      rating: 4.9,
      completedLoans: 14,
      loanDuration: 'Durante el ciclo',
      pickupLocation: 'Pabellón de Ciencias',
    },
    {
      id: 2,
      status: 'requesting',
      category: 'Libros',
      title: 'Física Universitaria Vol. 2',
      description:
        'Necesito el libro de Sears Zemansky, 14va edición. Lo cuidaré muy bien.',
      imageUrl: 'https://placehold.co/200x200?text=Libro+Fisica',
      timeAgo: 'hace 3 horas',
      isFavorite: false,
      authorId: 102,
      authorName: 'Luis Torres',
      authorAvatar:
        'https://ui-avatars.com/api/?name=Luis+Torres&background=00543D&color=fff',
      rating: 4.5,
      completedLoans: 3,
      loanDuration: '2 semanas',
      pickupLocation: 'Biblioteca Central',
    },
    {
      id: 3,
      status: 'lent',
      category: 'Materiales',
      title: 'Juego de Escuadras y Regla T',
      description:
        'Materiales de dibujo técnico, prestados por el ciclo actual.',
      imageUrl: 'https://placehold.co/200x200?text=Escuadras',
      returnDays: 14,
      isFavorite: false,
      authorId: 103,
      authorName: 'Carlos Gómez',
      authorAvatar:
        'https://ui-avatars.com/api/?name=Carlos+Gomez&background=00543D&color=fff',
      rating: 5.0,
      completedLoans: 28,
      loanDuration: '1 semana',
      pickupLocation: 'Patio de Arquitectura',
    },
    {
      id: 4,
      status: 'lending',
      category: 'Ropa',
      title: 'Bata de Laboratorio Talla M',
      description:
        'Bata blanca 100% algodón, limpia y planchada. Solo para laboratorios de química.',
      imageUrl: 'https://placehold.co/200x200?text=Bata',
      views: 42,
      isFavorite: false,
      timeAgo: 'hace 5 horas',
      authorId: 104,
      authorName: 'María Pérez',
      authorAvatar:
        'https://ui-avatars.com/api/?name=Maria+Perez&background=00543D&color=fff',
      rating: 4.7,
      completedLoans: 8,
      loanDuration: 'A coordinar',
      pickupLocation: 'Laboratorio de Química',
    },
    {
      id: 5,
      status: 'requesting',
      category: 'Tecnología',
      title: 'Cargador de Laptop HP',
      description:
        'Busco un cargador de punta azul para HP Pavillion, el mío se malogró hoy.',
      imageUrl: 'https://placehold.co/200x200?text=Cargador',
      timeAgo: 'hace 1 día',
      isFavorite: false,
      authorId: 105,
      authorName: 'Diego López',
      authorAvatar:
        'https://ui-avatars.com/api/?name=Diego+Lopez&background=00543D&color=fff',
      rating: 4.2,
      completedLoans: 1,
      loanDuration: 'Urgente (hoy)',
      pickupLocation: 'Cafetería Central',
    },
  ]);

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
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
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        handleAddPost,
        handleDeletePost,
        handleUpdatePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
