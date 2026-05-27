import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { actualizarUsuarioActual, obtenerUsuarioActual } from "../services/usuarioService";

export default function Perfil({ usuarioLogueado, actualizarUsuario }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioActual = await obtenerUsuarioActual();
      if (usuarioActual) {
        setNombre(usuarioActual.nombre || "");
        setTelefono(usuarioActual.telefono || "");
      }
    };

    cargarDatos();
  }, []);

  const guardarCambios = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío");
      return;
    }

    const usuarioActualizado = await actualizarUsuarioActual({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
    });

    actualizarUsuario(usuarioActualizado);
    setMostrarModal(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pb-12">
      <div className="rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-4xl font-semibold text-gray-800">Mi Perfil</h1>
        <p className="mb-6 text-gray-500">Visualiza y actualiza tu información básica.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-xl bg-gray-100 p-5 text-gray-700">
          <p>
            <strong>Correo institucional:</strong> {usuarioLogueado.email}
          </p>
        </div>

        <form onSubmit={guardarCambios}>
          <label className="mb-2 block font-semibold text-gray-700">Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mb-5 h-11 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-[#00543D]"
          />

          <label className="mb-2 block font-semibold text-gray-700">Teléfono</label>
          <input
            type="text"
            placeholder="Agrega tu teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mb-6 h-11 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-[#00543D]"
          />

          <button
            type="submit"
            className="h-12 w-full rounded-md bg-[#00543D] font-semibold text-white hover:bg-[#004231]"
          >
            Guardar cambios
          </button>
        </form>
      </div>

      {mostrarModal && (
        <Modal
          titulo="Perfil actualizado"
          mensaje="Tus datos fueron guardados correctamente."
          onClose={() => setMostrarModal(false)}
        />
      )}
    </main>
  );
}
