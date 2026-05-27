import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Layout from "./Layout";
import Post from "./Post";
import Auth from "./pages/Auth";
import Perfil from "./pages/Perfil";
import { cerrarSesion, obtenerUsuarioActual } from "./services/usuarioService";

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [vistaAuth, setVistaAuth] = useState("registro");
  const [paginaActiva, setPaginaActiva] = useState("explorar");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const usuario = await obtenerUsuarioActual();
      setUsuarioActual(usuario);
      setCargando(false);
    };

    verificarSesion();
  }, []);

  const manejarLogin = (usuario) => {
    setUsuarioActual(usuario);
    setPaginaActiva("explorar");
  };

  const manejarCerrarSesion = async () => {
    await cerrarSesion();
    setUsuarioActual(null);
    setVistaAuth("login");
  };

  const actualizarUsuario = (usuarioActualizado) => {
    setUsuarioActual(usuarioActualizado);
  };

  if (cargando) {
    return <p className="p-8 text-gray-600">Cargando...</p>;
  }

  if (!usuarioActual) {
    return (
      <Auth
        vista={vistaAuth}
        cambiarVista={setVistaAuth}
        onLogin={manejarLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        paginaActiva={paginaActiva}
        cambiarPagina={setPaginaActiva}
        cerrarSesion={manejarCerrarSesion}
      />

      {paginaActiva === "explorar" && <Post />}
      {paginaActiva === "actividad" && <Layout />}
      {paginaActiva === "perfil" && (
        <Perfil
          usuarioLogueado={usuarioActual}
          actualizarUsuario={actualizarUsuario}
        />
      )}
    </div>
  );
}
