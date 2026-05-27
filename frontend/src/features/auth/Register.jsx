import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { registerUser } from './userService';
import { useAuth } from './AuthContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

// Diccionario investigado: Institución -> Sedes -> Carreras
const INSTITUTIONS_DATA = {
  'Pontificia Universidad Católica del Perú (PUCP)': {
    'Campus San Miguel (Principal)': [
      'Arquitectura',
      'Arte y Diseño',
      'Ciencias e Ingeniería',
      'Ciencias Sociales',
      'Comunicaciones',
      'Derecho',
      'Economía',
      'Gestión',
      'Psicología',
    ],
    'Centrum (Surco)': [
      'Administración de Negocios (Posgrado)',
      'Finanzas (Posgrado)',
    ],
  },
  'Universidad Nacional Mayor de San Marcos (UNMSM)': {
    'Ciudad Universitaria': [
      'Ingeniería de Sistemas',
      'Ingeniería Industrial',
      'Derecho',
      'Economía',
      'Administración',
      'Contabilidad',
      'Letras',
      'Matemática',
      'Biología',
    ],
    'San Fernando (Facultad de Medicina)': [
      'Medicina Humana',
      'Enfermería',
      'Nutrición',
      'Tecnología Médica',
      'Obstetricia',
    ],
  },
  'Universidad Nacional de Ingeniería (UNI)': {
    'Campus Central (Rímac)': [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería de Sistemas',
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Arquitectura',
      'Ingeniería Química',
      'Ciencias de la Computación',
    ],
  },
  'Universidad Peruana de Ciencias Aplicadas (UPC)': {
    Monterrico: [
      'Ingeniería de Software',
      'Ingeniería de Sistemas',
      'Comunicaciones',
      'Economía',
      'Administración',
      'Arquitectura',
    ],
    'San Isidro': [
      'Negocios Internacionales',
      'Marketing',
      'Administración y Finanzas',
    ],
    'San Miguel': [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Derecho',
      'Contabilidad',
    ],
    Villa: [
      'Medicina',
      'Odontología',
      'Nutrición',
      'Terapia Física',
      'Psicología',
      'Arquitectura',
    ],
  },
  'Universidad de Lima (ULima)': {
    'Campus Monterrico': [
      'Arquitectura',
      'Comunicación',
      'Derecho',
      'Economía',
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería de Sistemas',
      'Negocios Internacionales',
      'Psicología',
    ],
  },
  'Universidad de San Martín de Porres (USMP)': {
    'Pueblo Libre': ['Derecho', 'Odontología'],
    'San Isidro': [
      'Ciencias de la Comunicación',
      'Turismo y Hotelería',
      'Psicología',
    ],
    'Santa Anita': [
      'Ciencias Administrativas y Recursos Humanos',
      'Ciencias Contables',
      'Ingeniería y Arquitectura',
    ],
  },
  'Universidad Tecnológica del Perú (UTP)': {
    'Lima Centro': [
      'Ingeniería de Sistemas',
      'Ingeniería Industrial',
      'Administración',
      'Derecho',
      'Psicología',
      'Arquitectura',
    ],
    'Lima Norte (Los Olivos)': [
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Administración',
      'Contabilidad',
    ],
    'Lima Sur (VES)': [
      'Ingeniería Industrial',
      'Administración',
      'Ingeniería Mecatrónica',
      'Psicología',
    ],
    'Lima Este (SJL)': [
      'Ingeniería de Sistemas',
      'Ingeniería Industrial',
      'Administración',
      'Derecho',
    ],
    Ate: [
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Administración',
      'Contabilidad',
    ],
  },
  'Universidad Privada del Norte (UPN)': {
    Breña: [
      'Administración',
      'Derecho',
      'Ingeniería Industrial',
      'Arquitectura',
    ],
    Chorrillos: [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Administración',
      'Psicología',
    ],
    Comas: [
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Contabilidad',
      'Psicología',
    ],
    'Los Olivos': [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Administración',
      'Derecho',
    ],
    'San Juan de Lurigancho': [
      'Ingeniería Industrial',
      'Ingeniería de Sistemas',
      'Administración',
      'Derecho',
    ],
  },
  'Universidad César Vallejo (UCV)': {
    Ate: [
      'Administración',
      'Contabilidad',
      'Derecho',
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Psicología',
    ],
    Callao: [
      'Administración',
      'Contabilidad',
      'Derecho',
      'Ingeniería de Sistemas',
    ],
    'Los Olivos': [
      'Administración',
      'Arquitectura',
      'Derecho',
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Psicología',
      'Enfermería',
    ],
    'San Juan de Lurigancho': [
      'Administración',
      'Contabilidad',
      'Derecho',
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Psicología',
    ],
  },
  'Universidad Científica del Sur (UCSUR)': {
    Ate: ['Medicina Humana', 'Psicología', 'Nutrición', 'Obstetricia'],
    'Los Olivos (Norte)': [
      'Medicina Humana',
      'Psicología',
      'Nutrición',
      'Enfermería',
    ],
    'Villa (Chorrillos)': [
      'Medicina Veterinaria',
      'Biología Marina',
      'Medicina Humana',
      'Nutrición',
      'Psicología',
      'Ingeniería Ambiental',
      'Arquitectura',
    ],
  },
  'Universidad del Pacífico (UP)': {
    'Campus Jesús María': [
      'Economía',
      'Administración',
      'Finanzas',
      'Contabilidad',
      'Ingeniería de la Información',
      'Ingeniería Empresarial',
      'Derecho',
    ],
  },
  'Universidad ESAN': {
    'Campus Surco': [
      'Administración y Finanzas',
      'Economía y Negocios',
      'Ingeniería de Tecnologías de Información',
      'Derecho Corporativo',
      'Ingeniería Industrial',
    ],
  },
  'Universidad Nacional Agraria La Molina (UNALM)': {
    'Campus La Molina': [
      'Agronomía',
      'Biología',
      'Ingeniería Ambiental',
      'Industrias Alimentarias',
      'Zootecnia',
      'Economía',
      'Ingeniería Agrícola',
      'Ingeniería Forestal',
    ],
  },
  'Universidad Nacional Federico Villarreal (UNFV)': {
    'Centro de Lima (Central)': [
      'Derecho',
      'Ciencias Políticas',
      'Educación',
      'Ciencias Sociales',
    ],
    'El Agustino': ['Medicina', 'Tecnología Médica', 'Nutrición'],
    'Pueblo Libre': ['Odontología', 'Psicología'],
    'San Miguel': [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería de Sistemas',
      'Arquitectura',
    ],
  },
  'Universidad Peruana Cayetano Heredia (UPCH)': {
    'Campus Central (SMP)': [
      'Medicina',
      'Estomatología',
      'Enfermería',
      'Tecnología Médica',
      'Ciencias',
    ],
    'La Molina': ['Veterinaria', 'Biología', 'Ingeniería Ambiental'],
    Miraflores: ['Psicología', 'Salud Pública', 'Administración en Salud'],
  },
  'Universidad Ricardo Palma (URP)': {
    'Campus Surco': [
      'Arquitectura',
      'Ingeniería Civil',
      'Medicina Humana',
      'Psicología',
      'Traducción',
      'Ingeniería Informática',
      'Medicina Veterinaria',
    ],
  },
  'Universidad San Ignacio de Loyola (USIL)': {
    'La Molina': [
      'Administración',
      'Arte y Diseño',
      'Gastronomía',
      'Ingeniería Industrial',
      'Negocios Internacionales',
      'Comunicaciones',
    ],
    Magdalena: ['Administración', 'Marketing', 'Negocios Internacionales'],
    Pachacámac: ['Gastronomía', 'Industrias Alimentarias'],
  },
  Cibertec: {
    Ate: [
      'Administración',
      'Computación e Informática',
      'Contabilidad',
      'Diseño Gráfico',
    ],
    Bellavista: ['Administración', 'Computación e Informática', 'Mecatrónica'],
    Breña: ['Administración', 'Diseño de Interiores', 'Redes y Comunicaciones'],
    Independencia: ['Computación e Informática', 'Contabilidad', 'Logística'],
    Miraflores: [
      'Diseño Gráfico',
      'Traducción',
      'Marketing',
      'Comunicación Audiovisual',
    ],
    'San Juan de Lurigancho': [
      'Administración',
      'Computación e Informática',
      'Contabilidad',
    ],
    'San Miguel': ['Diseño Gráfico', 'Computación e Informática', 'Marketing'],
  },
  IDAT: {
    'Centro de Lima': [
      'Administración',
      'Desarrollo de Software',
      'Diseño de Interiores',
      'Mecatrónica',
    ],
    Surco: [
      'Administración',
      'Marketing',
      'Desarrollo de Sistemas de Información',
    ],
    'Independencia (Tomas Valle)': [
      'Desarrollo de Software',
      'Mecatrónica Automotriz',
      'Diseño Gráfico',
    ],
  },
  ISIL: {
    Miraflores: [
      'Comunicación Integral',
      'Marketing',
      'Diseño Gráfico',
      'Desarrollo de Software',
    ],
    'San Isidro': [
      'Administración y Finanzas',
      'Negocios Internacionales',
      'Marketing',
    ],
    'La Molina': [
      'Administración',
      'Comunicación Audiovisual',
      'Diseño de Interiores',
      'Sistemas de Información',
    ],
  },
  Senati: {
    Ate: [
      'Mecatrónica Automotriz',
      'Diseño Gráfico',
      'Ingeniería de Software',
      'Electrotecnia',
    ],
    'Cercado de Lima': [
      'Mecatrónica Automotriz',
      'Diseño Gráfico',
      'Administración Industrial',
    ],
    'Independencia (Sede Central)': [
      'Mecatrónica Automotriz',
      'Ingeniería de Software',
      'Electrotecnia',
      'Diseño Gráfico',
      'Administración Industrial',
    ],
    'San Juan de Lurigancho': [
      'Mecatrónica Automotriz',
      'Administración Industrial',
      'Diseño Gráfico',
    ],
    Surquillo: [
      'Diseño Gráfico',
      'Ingeniería de Software',
      'Administración Industrial',
    ],
  },
  TECSUP: {
    'Campus Lima (Santa Anita)': [
      'Mantenimiento de Maquinaria',
      'Diseño de Software',
      'Redes y Comunicaciones',
      'Electrotecnia',
      'Mecatrónica',
    ],
  },
  'Toulouse Lautrec': {
    'Chacarilla (Surco)': [
      'Diseño Gráfico',
      'Dirección y Diseño Gráfico',
      'Animación Digital',
      'Diseño de Interiores',
      'Comunicación Audiovisual',
    ],
    'Javier Prado (San Isidro)': [
      'Diseño Gráfico',
      'Diseño de Interiores',
      'Marketing',
    ],
    'Lima Norte (Independencia)': [
      'Diseño Gráfico',
      'Animación Digital',
      'Diseño de Interiores',
    ],
    'San Miguel': [
      'Diseño Gráfico',
      'Comunicación Audiovisual',
      'Diseño de Interiores',
    ],
  },
};

const INSTITUTIONS = Object.keys(INSTITUTIONS_DATA);

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
          disabled={!acceptTerms}
          className={`h-12 w-full rounded-md font-semibold text-white transition-colors ${
            acceptTerms
              ? 'bg-[#00543D] hover:bg-[#004231] cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
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
