// Único lugar que toca localStorage y sessionStorage.
// Usuarios y reseñas van en localStorage, y la sesión en sessionStorage.

const CLAVE_USUARIOS = 'levelup_usuarios'
const CLAVE_SESION = 'levelup_sesion'
const CLAVE_RESENAS = 'levelup_resenas'

function leerLista(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || []
  } catch {
    return []
  }
}

export function leerUsuarios() {
  return leerLista(CLAVE_USUARIOS)
}

export function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

export function leerResenas() {
  return leerLista(CLAVE_RESENAS)
}

export function guardarResenas(resenas) {
  localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas))
}

export function leerSesion() {
  return sessionStorage.getItem(CLAVE_SESION)
}

export function guardarSesion(correo) {
  if (correo) {
    sessionStorage.setItem(CLAVE_SESION, correo)
  } else {
    sessionStorage.removeItem(CLAVE_SESION)
  }
}

const CLAVE_CARRITO = 'levelup_carrito'

export function leerCarrito() {
  return leerLista(CLAVE_CARRITO)
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
}

const CLAVE_ORDENES = 'levelup_ordenes'

export function leerOrdenes() {
  return leerLista(CLAVE_ORDENES)
}

export function guardarOrdenes(ordenes) {
  localStorage.setItem(CLAVE_ORDENES, JSON.stringify(ordenes))
}
