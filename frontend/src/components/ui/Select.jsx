export default function Select({
  label,
  value,
  onChange,
  options,
  disabled,
  placeholder,
  ...props
}) {
  return (
    <div className='w-full'>
      {label && (
        <label className='block mb-2 text-sm font-semibold text-gray-700'>
          {label}
        </label>
      )}
      <div
        className={`px-3 mb-4 transition-all border border-gray-300 rounded-md focus-within:border-[#00543D] focus-within:ring-1 focus-within:ring-[#00543D] ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          title={value || placeholder}
          className='w-full bg-transparent outline-none h-11 text-gray-800 disabled:text-gray-400 text-ellipsis overflow-hidden whitespace-nowrap'
          {...props}
        >
          <option value=''>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
