export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  ...props
}) {
  return (
    <div className='w-full'>
      {label && (
        <label className='block mb-2 text-sm font-semibold text-gray-700'>
          {label}
        </label>
      )}
      <div className='flex items-center px-3 mb-4 transition-all bg-white border border-gray-300 rounded-md focus-within:border-[#00543D] focus-within:ring-1 focus-within:ring-[#00543D]'>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className='w-full bg-transparent outline-none h-11 text-gray-800'
          {...props}
        />
        {/* Contenedor para botones o íconos al final del input (ej. Mostrar contraseña) */}
        {icon && <div className='ml-2'>{icon}</div>}
      </div>
    </div>
  );
}
