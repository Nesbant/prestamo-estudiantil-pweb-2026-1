import { useState } from 'react';
import { loginUser } from './userService';
import { useAuth } from './AuthContext';

export default function Login() {
  const { setAuthView, handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    const result = await loginUser(email, password);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    handleLogin(result.user);
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-md'>
      <h1 className='mb-2 text-3xl font-bold text-gray-800'>Iniciar Sesión</h1>
      <p className='mb-8 text-sm text-gray-500'>
        Ingresa con tu correo institucional
      </p>

      {error && (
        <div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'>
          {error}
        </div>
      )}

      <label className='block mb-2 text-sm font-semibold text-gray-700'>
        Correo electrónico institucional
      </label>
      <div className='px-3 mb-4 bg-white border border-gray-300 rounded-md'>
        <input
          type='email'
          placeholder='jordan@university.edu'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full outline-none h-11'
        />
      </div>

      <label className='block mb-2 text-sm font-semibold text-gray-700'>
        Contraseña
      </label>
      <div className='flex items-center px-3 mb-5 bg-white border border-gray-300 rounded-md'>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder='********'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full outline-none h-11'
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='text-sm font-semibold text-[#00543D]'
        >
          {showPassword ? 'Ocultar' : 'Ver'}
        </button>
      </div>

      <button
        type='submit'
        className='h-12 w-full rounded-md bg-[#00543D] font-semibold text-white hover:bg-[#004231]'
      >
        Iniciar Sesión →
      </button>

      <p className='mt-6 text-sm text-center text-gray-500'>
        ¿No tienes una cuenta?{' '}
        <button
          type='button'
          onClick={() => setAuthView('register')}
          className='font-bold text-[#00543D]'
        >
          Regístrate
        </button>
      </p>
    </form>
  );
}
