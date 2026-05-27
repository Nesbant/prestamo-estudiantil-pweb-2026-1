import { useLocation, useNavigate } from 'react-router-dom';
import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faUser as faUserSolid,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoUrl from '../../assets/logo.svg';
import NavButton from '../ui/NavButton';
import { useAuth } from '../../features/auth/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  // Detectar la página activa según la ruta actual
  const isExplorar = location.pathname === '/explorar';
  const isActividad =
    location.pathname === '/' ||
    location.pathname === '/crear' ||
    location.pathname.startsWith('/editar');

  return (
    <nav className='sticky top-0 z-40 mb-8 bg-white border-b border-gray-500 shadow-sm'>
      <div className='flex justify-between px-1 py-4 mx-10 max-w-8xl'>
        <div>
          <img
            src={logoUrl}
            alt='CampusLend Logo'
            className='object-contain w-auto h-10 cursor-pointer'
            onClick={() => navigate('/')}
          />
        </div>
        <div className='flex gap-8 font-medium text-gray-600'>
          <NavButton
            isActive={isExplorar}
            onClick={() => navigate('/explorar')}
          >
            Explorar
          </NavButton>
          <NavButton isActive={isActividad} onClick={() => navigate('/')}>
            Mi actividad
          </NavButton>
        </div>
        <div className='flex items-center gap-6 text-xl text-gray-500'>
          <button className='transition-colors cursor-pointer hover:text-gray-900'>
            <FontAwesomeIcon icon={faBellRegular} />
          </button>
          <button
            className={`transition-colors cursor-pointer hover:text-gray-900 ${location.pathname === '/profile' ? 'text-[#00543D]' : ''}`}
            onClick={() => navigate('/profile')}
            title='Mi Perfil'
          >
            <FontAwesomeIcon icon={faUserSolid} />
          </button>
          <button
            className='transition-colors cursor-pointer hover:text-red-600'
            onClick={handleLogout}
            title='Cerrar sesión'
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </div>
    </nav>
  );
}
