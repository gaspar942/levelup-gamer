// Lógica de acceso del administrador. Son funciones puras: la cuenta se recibe por
// parámetro (con la de src/data como valor por defecto) para poder probarlas con otra.
import { administrador as administradorBase } from '../data/administrador'

export function esAdministrador(usuario) {
  return Boolean(usuario) && usuario.rol === 'admin'
}

// El correo del administrador no se puede usar para registrar un usuario común.
export function correoReservado(correo, admin = administradorBase) {
  return String(correo ?? '').trim().toLowerCase() === admin.correo
}

export function autenticarAdministrador(correo, contrasena, admin = administradorBase) {
  return correoReservado(correo, admin) && contrasena === admin.contrasena ? admin : null
}

// Devuelve el usuario de la sesión: el administrador o uno de los usuarios registrados.
export function buscarUsuarioSesion(usuarios, correo, admin = administradorBase) {
  if (!correo) {
    return null
  }

  if (correo === admin.correo) {
    return admin
  }

  return usuarios.find((usuario) => usuario.correo === correo) || null
}
