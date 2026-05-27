import Register from './Register';
import Login from './Login';
import logoUrl from '../../assets/logo.svg';
import { useAuth } from './AuthContext';

export default function Auth() {
  const { authView } = useAuth();

  return (
    <div className='min-h-screen bg-[#eef2ff] p-3'>
      <div className='mx-auto mt-28 flex min-h-140 w-[92%] max-w-6xl overflow-hidden rounded-2xl bg-gray-50 shadow-xl max-md:mt-10 max-md:flex-col'>
        <div className='w-1/2 bg-[#00543D] text-white max-md:w-full'>
          <div className='flex h-full min-h-90 flex-col justify-between bg-linear-to-br from-[#00543D] to-[#003d2c] p-10'>
            <div className='flex items-center gap-2'>
              <img
                src={logoUrl}
                alt='CampusLend'
                className='w-auto h-8 brightness-0 invert'
              />
            </div>

            <div>
              <h1 className='mb-5 text-5xl font-bold leading-tight max-md:text-4xl'>
                Comparte más.
                <br />
                Gasta menos.
              </h1>
              <p className='max-w-md leading-7 text-green-100'>
                Únete a la red estudiantil de confianza para prestar y pedir
                prestado artículos de uso diario. Seguro, confiable y en tu
                propio campus.
              </p>
            </div>

            <div className='flex gap-6 pt-6 text-sm text-green-100 border-t border-white/20 max-md:flex-col max-md:gap-2'>
              <span>Estudiantes verificados</span>
              <span>Plataforma segura</span>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center w-1/2 p-12 max-md:w-full max-md:p-8'>
          {authView === 'register' ? <Register /> : <Login />}
        </div>
      </div>
    </div>
  );
}
