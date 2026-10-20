// Edición y baja de usuarios desde el panel de administrador. Son funciones puras:
// reciben la lista actual y devuelven la lista nueva, o un { error } si no es válido.
// El correo identifica al usuario, por eso no se puede cambiar al editar.

function buscar(usuarios, correo) {
  return usuarios.find((usuario) => usuario.correo === correo) || null
}

export function editarUsuario(usuarios, correo, cambios) {
  const existente = buscar(usuarios, correo)

  if (!existente) {
    return { error: 'El usuario no existe.' }
  }

  const nombre = String(cambios.nombre ?? '').trim()

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  const usuario = { ...existente, nombre }

  return {
    usuarios: usuarios.map((item) => (item.correo === correo ? usuario : item)),
    usuario,
  }
}

export function eliminarUsuario(usuarios, correo) {
  const existente = buscar(usuarios, correo)

  if (!existente) {
    return { error: 'El usuario no existe.' }
  }

  return {
    usuarios: usuarios.filter((usuario) => usuario.correo !== correo),
    usuario: existente,
  }
}
