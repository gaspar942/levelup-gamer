// Lógica de usuarios, referidos y niveles. Son funciones puras, sin storage.
import { calcularDescuento } from './validaciones'

export const PUNTOS_REFERIDO = 100

export function generarCodigoPropio(cantidadUsuarios) {
  return `LVL${String(cantidadUsuarios + 1).padStart(4, '0')}`
}

export function crearUsuario(usuarios, datos) {
  const correo = datos.correo.trim().toLowerCase()

  if (usuarios.some((usuario) => usuario.correo === correo)) {
    return { error: 'Ese correo ya está registrado.' }
  }

  const codigo = (datos.codigoReferido || '').trim().toUpperCase()
  let lista = usuarios

  if (codigo) {
    const referidor = usuarios.find((usuario) => usuario.codigoPropio === codigo)

    if (!referidor) {
      return { error: 'El código de referido no existe.' }
    }

    lista = usuarios.map((usuario) =>
      usuario.codigoPropio === codigo
        ? { ...usuario, puntos: usuario.puntos + PUNTOS_REFERIDO }
        : usuario
    )
  }

  const usuario = {
    nombre: datos.nombre.trim(),
    correo,
    contrasena: datos.contrasena,
    fechaNacimiento: datos.fechaNacimiento,
    descuento: calcularDescuento(correo),
    puntos: 0,
    codigoPropio: generarCodigoPropio(usuarios.length),
  }

  return { usuarios: [...lista, usuario], usuario }
}

export function autenticar(usuarios, correo, contrasena) {
  const texto = correo.trim().toLowerCase()

  return (
    usuarios.find(
      (usuario) => usuario.correo === texto && usuario.contrasena === contrasena
    ) || null
  )
}

export function nivelPorPuntos(puntos) {
  if (puntos >= 500) return 'Oro'
  if (puntos >= 200) return 'Plata'
  return 'Bronce'
}

export function actualizarNombre(usuarios, correo, nombre) {
  return usuarios.map((usuario) =>
    usuario.correo === correo ? { ...usuario, nombre: nombre.trim() } : usuario
  )
}
