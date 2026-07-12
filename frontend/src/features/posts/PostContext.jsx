import { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  getPosts,
  createPost,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
  toggleFavorite as toggleFavoriteApi,
} from './postService';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts({}, token); // Enviamos el token para saber si son favoritos
        setPosts(data);
      } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
      }
    };

    fetchPosts();
  }, [token]);

  const handleAddPost = useCallback(
    async (postData) => {
      const newPost = await createPost(postData, token);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return newPost;
    },
    [token],
  );

  const handleDeletePost = useCallback(
    async (id) => {
      await deletePostApi(id, token);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    },
    [token],
  );

  const handleUpdatePost = useCallback(
    async (id, postData) => {
      const updatedPost = await updatePostApi(id, postData, token);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post,
        ),
      );
      return updatedPost;
    },
    [token],
  );

  const handleToggleFavorite = useCallback(
    async (id) => {
      const { isFavorite } = await toggleFavoriteApi(id, token);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, isFavorite } : post,
        ),
      );
      return isFavorite;
    },
    [token],
  );

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        handleAddPost,
        handleDeletePost,
        handleUpdatePost,
        handleToggleFavorite,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
