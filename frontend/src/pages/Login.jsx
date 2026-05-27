import { useState } from "react";
import { iniciarSesion } from "../services/usuarioService";

export default function Login({ cambiarVista, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const resultado = await iniciarSesion(email, password);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    onLogin(resultado.usuario);
  };

  return (
    <form onSubmit={manejarLogin} className="w-full max-w-md">
      <h1 className="mb-2 text-3xl font-bold text-gray-800">Iniciar sesión</h1>
      <p className="mb-8 text-sm text-gray-500">Ingresa con tu correo institucional</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
        Iniciar sesión →
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        No tienes una cuenta?{" "}
        <button
          type="button"
          onClick={() => cambiarVista("registro")}
          className="font-bold text-[#00543D]"
        >
          Regístrate
        </button>
      </p>
    </form>
  );
}
