import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { registerUser } from './userService';
import { useAuth } from './AuthContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { INSTITUTIONS_DATA, INSTITUTIONS } from '../../components/ui/institutions';

export default function Register() {
  const { setAuthView } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [major, setMajor] = useState('');
  const [campus, setCampus] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !name.trim() ||
      !email.trim() ||
      !institution.trim() ||
      !studentId.trim() ||
      !phone.trim() ||
      !major.trim() ||
      !campus.trim() ||
      !password.trim()
    ) {
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

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones de la comunidad');
      return;
    }

    setSubmitting(true);
    const result = await registerUser({
      name,
      email,
      institution,
      studentId,
      phone,
      major,
      campus,
      password,
    });
    setSubmitting(false);

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

        <Input
          label='Nombre completo'
          placeholder='Ej. María García'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          label='Universidad / Instituto'
          value={institution}
          onChange={(e) => {
            setInstitution(e.target.value);
            setCampus(''); // Resetear sede al cambiar institución
            setMajor(''); // Resetear carrera al cambiar institución
          }}
          options={INSTITUTIONS}
          placeholder='Selecciona tu institución...'
        />

        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Código de estudiante'
            placeholder='Ej. 20210456'
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <Input
            label='Teléfono'
            type='tel'
            placeholder='Ej. 987654321'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Sede (Campus)'
            value={campus}
            onChange={(e) => {
              setCampus(e.target.value);
              setMajor(''); // Resetear carrera al cambiar sede
            }}
            disabled={!institution}
            placeholder={
              !institution
                ? 'Elige institución primero'
                : 'Selecciona tu sede...'
            }
            options={
              institution ? Object.keys(INSTITUTIONS_DATA[institution]) : []
            }
          />
          <Select
            label='Carrera / Facultad'
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            disabled={!campus}
            placeholder={
              !campus ? 'Elige sede primero' : 'Selecciona tu carrera...'
            }
            options={campus ? INSTITUTIONS_DATA[institution][campus] : []}
          />
        </div>

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

        <div className='flex items-center gap-2 mb-5'>
          <input
            type='checkbox'
            id='terms'
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className='w-4 h-4 text-[#00543D] rounded cursor-pointer accent-[#00543D]'
          />
          <label
            htmlFor='terms'
            className='text-sm text-gray-600 cursor-pointer'
          >
            Acepto los{' '}
            <span className='text-[#00543D] underline font-medium'>
              términos y condiciones
            </span>{' '}
            del servicio
          </label>
        </div>

        <button
          type='submit'
          disabled={!acceptTerms || submitting}
          className={`h-12 w-full rounded-md font-semibold text-white transition-colors ${
            acceptTerms && !submitting
              ? 'bg-[#00543D] hover:bg-[#004231] cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Registrando...' : 'Registrarse →'}
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
