export default function Modal({ titulo, mensaje, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-xl">
        <h2 className="mb-3 text-2xl font-bold text-[#00543D]">{titulo}</h2>
        <p className="mb-6 text-gray-600">{mensaje}</p>
        <button
          onClick={onClose}
          className="rounded-lg bg-[#00543D] px-8 py-3 font-semibold text-white hover:bg-[#004231]"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
