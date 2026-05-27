import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { registerUser } from './userService';
import { useAuth } from './AuthContext';

export default function Register() {
  const { setAuthView } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    const result = await registerUser({ name, email, password });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setAuthView('login');
  };

  return (
    <>
      <form onSubmit={handleRegister} className='w-full max-w-md'>
        <h1 className='mb-2 text-3xl font-bold text-gray-800'>
          Crea una cuenta
        </h1>
        <p className='mb-8 text-sm text-gray-500'>
          Usa tu correo electrónico institucional
        </p>

        {error && (
          <div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'>
            {error}
          </div>
        )}

        <label className='block mb-2 text-sm font-semibold text-gray-700'>
          Nombre completo
        </label>
        <div className='px-3 mb-4 bg-white border border-gray-300 rounded-md'>
          <input
            type='text'
            placeholder='Jordan Doe'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full outline-none h-11'
          />
        </div>

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
          Registrarse →
        </button>

        <p className='mt-6 text-sm text-center text-gray-500'>
          ¿Ya tienes una cuenta?{' '}
          <button
            type='button'
            onClick={() => setAuthView('login')}
            className='font-bold text-[#00543D]'
          >
            Inicia sesión
          </button>
        </p>
      </form>

      {showModal && (
        <Modal
          titulo='Registro exitoso'
          mensaje='Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión.'
          onClose={closeModal}
        />
      )}
    </>
  );
}
