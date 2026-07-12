import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { getProfile } from './userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [authView, setAuthView] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (token) {
        try {
          const userProfile = await getProfile(token);
          setCurrentUser(userProfile);
        } catch (error) {
          console.error('Sesión inválida o expirada:', error);
          localStorage.removeItem('accessToken');
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false); // Dejar de cargar una vez que se verifica el token
    };
    checkSession();
  }, [token]);

  const handleLogin = useCallback((authData) => {
    const { user, accessToken } = authData;
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setCurrentUser(null);
    setAuthView('login');
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    // El backend puede devolver el objeto de usuario completo o el objeto de autenticación
    const userToUpdate = updatedUserData.user
      ? updatedUserData.user
      : updatedUserData;
    setCurrentUser(userToUpdate);

    // Si el backend devuelve un nuevo token al actualizar, lo guardamos
    if (updatedUserData.accessToken) {
      localStorage.setItem('accessToken', updatedUserData.accessToken);
      setToken(updatedUserData.accessToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        authView,
        setAuthView,
        loading,
        handleLogin,
        handleLogout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
