export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  ...props
}) {
  return (
    <div className='w-full'>
      {label && (
        <label className='block mb-2 text-sm font-semibold text-gray-700'>
          {label}
        </label>
      )}
      <div className='px-3 py-2 mb-4 transition-all bg-white border border-gray-300 rounded-md focus-within:border-[#00543D] focus-within:ring-1 focus-within:ring-[#00543D]'>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          className='w-full bg-transparent outline-none resize-none text-gray-800'
          {...props}
        ></textarea>
      </div>
    </div>
  );
}
