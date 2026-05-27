const CLAVE_USUARIOS = "usuarios";
const CLAVE_USUARIO_ACTUAL = "usuarioActual";

export const obtenerUsuarios = async () => {
  const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);
  return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
};

export const guardarUsuarios = async (usuarios) => {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
};

export const registrarUsuario = async (datosUsuario) => {
  const usuarios = await obtenerUsuarios();

  const correoLimpio = datosUsuario.email.trim().toLowerCase();

  const correoExiste = usuarios.some(
    (usuario) => usuario.email.toLowerCase() === correoLimpio
  );

  if (correoExiste) {
    return {
      ok: false,
      mensaje: "Este correo ya se encuentra registrado",
    };
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre: datosUsuario.nombre.trim(),
    email: correoLimpio,
    password: datosUsuario.password,
    telefono: "",
  };

  const nuevaLista = [...usuarios, nuevoUsuario];
  await guardarUsuarios(nuevaLista);

  return {
    ok: true,
    mensaje: "Usuario registrado correctamente",
  };
};

export const iniciarSesion = async (email, password) => {
  const usuarios = await obtenerUsuarios();
  const correoLimpio = email.trim().toLowerCase();

  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.email.toLowerCase() === correoLimpio && usuario.password === password
  );

  if (!usuarioEncontrado) {
    return {
      ok: false,
      mensaje: "Correo o contraseña incorrectos",
    };
  }

  localStorage.setItem(CLAVE_USUARIO_ACTUAL, JSON.stringify(usuarioEncontrado));

  return {
    ok: true,
    usuario: usuarioEncontrado,
  };
};

export const obtenerUsuarioActual = async () => {
  const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO_ACTUAL);
  return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
};

export const actualizarUsuarioActual = async (datosActualizados) => {
  const usuarios = await obtenerUsuarios();
  const usuarioActual = await obtenerUsuarioActual();

  if (!usuarioActual) {
    return null;
  }

  const usuariosActualizados = usuarios.map((usuario) => {
    if (usuario.id === usuarioActual.id) {
      return {
        ...usuario,
        ...datosActualizados,
      };
    }
    return usuario;
  });

  const usuarioActualizado = {
    ...usuarioActual,
    ...datosActualizados,
  };

  await guardarUsuarios(usuariosActualizados);
  localStorage.setItem(CLAVE_USUARIO_ACTUAL, JSON.stringify(usuarioActualizado));

  return usuarioActualizado;
};

export const cerrarSesion = async () => {
  localStorage.removeItem(CLAVE_USUARIO_ACTUAL);
};
