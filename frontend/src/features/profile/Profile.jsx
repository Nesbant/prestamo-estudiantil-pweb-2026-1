import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import { updateUser as updateUserService } from '../auth/userService';
import { useAuth } from '../auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import Input from '../../components/ui/Input';

export default function Profile() {
  const { currentUser, token, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const saveChanges = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    try {
      setSaving(true);
      const updatedData = await updateUserService(
        {
          name: name.trim(),
          phone: phone.trim(),
          avatar,
        },
        token,
      );
      updateUser(updatedData);
      setShowModal(true);
    } catch (error) {
      setError(error.message || 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Mostramos la vista previa
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className='max-w-3xl px-6 pb-12 mx-auto mt-10'>
      <div className='p-8 bg-white shadow-md rounded-2xl'>
        <h1 className='mb-2 text-4xl font-semibold text-gray-800'>Mi Perfil</h1>
        <p className='mb-6 text-gray-500'>
          Visualiza y actualiza tu información básica.
        </p>

        {error && (
          <div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'>
            {error}
          </div>
        )}

        <div className='flex items-center gap-6 mb-8'>
          <div className='w-24 h-24 overflow-hidden bg-gray-200 border-2 border-gray-100 rounded-full shadow-sm shrink-0'>
            <img
              src={
                avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=00543D&color=fff`
              }
              alt='Profile'
              className='object-cover w-full h-full'
            />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>
              {name || 'Tu Nombre'}
            </h2>
            <p className='text-sm text-[#00543D] font-medium'>
              Estudiante de CampusLend
            </p>
          </div>
        </div>

        <div className='p-5 mb-6 text-gray-700 bg-gray-100 rounded-xl'>
          <p>
            <strong>Correo institucional:</strong> {currentUser?.email}
          </p>
          <p className='mt-2'>
            <strong>Código de estudiante:</strong>{' '}
            {currentUser?.studentId || 'No registrado'}
          </p>
          <p className='mt-2'>
            <strong>Institución:</strong>{' '}
            {currentUser?.institution || 'No registrado'}
          </p>
          <p className='mt-2'>
            <strong>Carrera:</strong> {currentUser?.major || 'No registrado'}
          </p>
          <p className='mt-2'>
            <strong>Sede:</strong> {currentUser?.campus || 'No registrado'}
          </p>
        </div>

        <form onSubmit={saveChanges}>
          <Input
            label='Nombre completo'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label='Teléfono'
            placeholder='Agrega tu teléfono'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label className='block mb-2 font-semibold text-gray-700'>
            Foto de perfil
          </label>
          <div className='relative flex flex-col items-center justify-center p-6 mb-6 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            />
            <FontAwesomeIcon
              icon={faImage}
              className='mb-2 text-3xl text-gray-400'
            />
            <span className='text-sm text-gray-500'>
              Haz clic para subir o arrastra tu foto aquí
            </span>
          </div>

          <button
            type='submit'
            disabled={saving}
            className='h-12 w-full rounded-md bg-[#00543D] font-semibold text-white hover:bg-[#004231] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>

      {showModal && (
        <Modal
          titulo='Perfil actualizado'
          mensaje='Tus datos fueron guardados correctamente.'
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
