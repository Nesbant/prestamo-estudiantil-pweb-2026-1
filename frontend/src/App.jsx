<<<<<<< HEAD
import Dashboard from './Dashboard.jsx'

export default function App() {
  return <Dashboard />
=======
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import PostForm from './features/posts/PostForm';
import PostPage from './pages/PostDetails';
import ExplorePage from './pages/Explore';
import Profile from './features/profile/Profile';
import Auth from './features/auth/Auth';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { PostProvider } from './features/posts/PostContext';
import { AuthProvider, useAuth } from './features/auth/AuthContext';

// Componente auxiliar para redirigir URLs dinámicas antiguas
function RedirectEdit() {
  const { id } = useParams();
  return <Navigate to={`/edit/${id}`} replace />;
}

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <p className='p-8 text-center text-gray-600'>Cargando...</p>;
  }

  return (
    <PostProvider>
      <BrowserRouter>
        {/* Solo mostramos el Navbar si el usuario está logueado */}
        {currentUser && <Navbar />}
        <Routes>
          {/* Ruta de Autenticación. Si ya estás logueado, te manda a '/' inmediatamente */}
          <Route
            path='/auth'
            element={!currentUser ? <Auth /> : <Navigate to='/' replace />}
          />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* REDIRECCIONES DE RETROCOMPATIBILIDAD (Para evitar el error 404) */}
            <Route path='explorar' element={<Navigate to='/' replace />} />
            <Route
              path='actividad'
              element={<Navigate to='/activity' replace />}
            />
            <Route path='crear' element={<Navigate to='/create' replace />} />
            <Route path='editar/:id' element={<RedirectEdit />} />

            <Route index element={<ExplorePage />} />
            <Route path='activity' element={<Home />} />
            <Route
              path='create'
              element={
                <>
                  <Home />
                  <PostForm />
                </>
              }
            />
            import Dashboard from './Dashboard.jsx'

            export default function App() {
              return <Dashboard />
            }
                  <PostForm />
