import { useState } from "react";
import Modal from "../components/Modal";
import { registrarUsuario } from "../services/usuarioService";

export default function Registro({ cambiarVista }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim() || !telefono.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    const resultado = await registrarUsuario({ nombre, email, telefono, password });

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    cambiarVista("login");
  };

  return (
    <>
      <form onSubmit={manejarRegistro} className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">Crea una cuenta</h1>
        <p className="mb-8 text-sm text-gray-500">Usa tu correo electrónico institucional</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mb-2 block text-sm font-semibold text-gray-700">Nombre Completo</label>
        <div className="mb-4 rounded-md border border-gray-300 bg-white px-3">
          <input
            type="text"
            placeholder="Jordan Doe"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="h-11 w-full outline-none"
          />
        </div>

        <label className="mb-2 block text-sm font-semibold text-gray-700">Correo electrónico institucional</label>
        <div className="mb-4 rounded-md border border-gray-300 bg-white px-3">
          <input
            type="email"
            placeholder="jordan@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full outline-none"
          />
        </div>

        <label className="mb-2 block text-sm font-semibold text-gray-700">Teléfono</label>
        <div className="mb-4 rounded-md border border-gray-300 bg-white px-3">
          <input
            type="text"
            placeholder="987654321"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="h-11 w-full outline-none"
          />
        </div>

        <label className="mb-2 block text-sm font-semibold text-gray-700">Contraseña</label>
        <div className="mb-5 flex items-center rounded-md border border-gray-300 bg-white px-3">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full outline-none"
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="text-sm font-semibold text-[#00543D]"
          >
            {mostrarPassword ? "Ocultar" : "Ver"}
          </button>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-md bg-[#00543D] font-semibold text-white hover:bg-[#004231]"
        >
          Sign Up →
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Ya tienes una cuenta?{" "}
          <button
            type="button"
            onClick={() => cambiarVista("login")}
            className="font-bold text-[#00543D]"
          >
            Iniciar sesión
          </button>
        </p>
      </form>

      {mostrarModal && (
        <Modal
          titulo="Registro exitoso"
          mensaje="Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión."
          onClose={cerrarModal}
        />
      )}
    </>
  );
}
