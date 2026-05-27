import { useLocation, useNavigate } from 'react-router-dom';
import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';
import { faUser as faUserSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoUrl from './logo.svg';
import NavButton from './NavButton';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

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
          <button className='transition-colors cursor-pointer hover:text-gray-900'>
            <FontAwesomeIcon icon={faUserSolid} />
          </button>
        </div>
      </div>
    </nav>
  );
}
