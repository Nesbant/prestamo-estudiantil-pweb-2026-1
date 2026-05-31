export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className='flex justify-center gap-2 mt-10 mb-12'>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className='px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Anterior
      </button>
      <span className='flex items-center px-4 font-medium text-gray-700'>
        Página {currentPage} de {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className='px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Siguiente
      </button>
    </div>
  );
}
