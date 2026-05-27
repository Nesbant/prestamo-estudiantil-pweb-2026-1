import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';
import { faUser as faUserSolid } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoUrl from './logo.svg';

export default function Navbar({ paginaActiva, cambiarPagina, cerrarSesion }) {
  return (
    <nav className='bg-white border-b border-gray-300 shadow-sm mb-8'>
      <div className='flex items-center justify-between max-w-6xl px-1 py-4 mx-auto'>
        <div>
          <img
            src={logoUrl}
            alt='CampusLend Logo'
            className='object-contain w-auto h-10 cursor-pointer'
            onClick={() => cambiarPagina('explorar')}
          />
        </div>
        <div className='flex gap-8 font-medium text-gray-600'>
          <button
            onClick={() => cambiarPagina('explorar')}
            className={`transition-colors cursor-pointer underline-offset-8 decoration-2 ${paginaActiva === 'explorar' ? 'text-[#00543D] underline' : 'hover:text-gray-900'}`}
          >
            Explorar
          </button>
          <button
            onClick={() => cambiarPagina('actividad')}
            className={`transition-colors cursor-pointer underline-offset-8 decoration-2 ${paginaActiva === 'actividad' ? 'text-[#00543D] underline' : 'hover:text-gray-900'}`}
          >
            Mi actividad
          </button>
        </div>
        <div className='flex items-center gap-6 text-xl text-gray-500'>
          <button className='transition-colors cursor-pointer hover:text-gray-900'>
            <FontAwesomeIcon icon={faBellRegular} />
          </button>
          <button
            onClick={() => cambiarPagina('perfil')}
            className={`transition-colors cursor-pointer ${paginaActiva === 'perfil' ? 'text-[#00543D]' : 'hover:text-gray-900'}`}
          >
            <FontAwesomeIcon icon={faUserSolid} />
          </button>
          <button
            onClick={cerrarSesion}
            className='transition-colors cursor-pointer hover:text-red-600'
            title='Cerrar sesión'
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>
      </div>
    </nav>
  );
}
