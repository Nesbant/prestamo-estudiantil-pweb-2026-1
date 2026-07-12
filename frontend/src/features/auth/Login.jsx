import { useState } from 'react';
import { loginUser } from './userService';
import { useAuth } from './AuthContext';
import Input from '../../components/ui/Input';

export default function Login() {
  const { setAuthView, handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

    try {
      setSubmitting(true);
      const authData = await loginUser({ email, password });
      handleLogin(authData);
    } catch (error) {
      setError(error.message || 'Ocurrió un error inesperado.');
    } finally {
      setSubmitting(false);
    }
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

      <Input
        label='Correo electrónico institucional'
        type='email'
        placeholder='maria.garcia@universidad.edu.pe'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label='Contraseña'
        type={showPassword ? 'text' : 'password'}
        placeholder='********'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-sm font-semibold text-[#00543D]'
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        }
      />

      <button
        type='submit'
        disabled={submitting}
        className='h-12 w-full rounded-md bg-[#00543D] font-semibold text-white hover:bg-[#004231] disabled:cursor-not-allowed disabled:opacity-60'
      >
        {submitting ? 'Ingresando...' : 'Iniciar Sesión →'}
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
