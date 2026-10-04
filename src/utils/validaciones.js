// Reglas de negocio del registro. Son funciones puras para poder probarlas fácil.

const DOMINIOS_DUOC = ['@duoc.cl', '@duocuc.cl', '@profesor.duoc.cl']

export function validarEdad(fechaNacimiento, hoy = new Date()) {
  if (!fechaNacimiento) {
    return false
  }

  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number)
  let edad = hoy.getFullYear() - anio
  const mesActual = hoy.getMonth() + 1

  if (mesActual < mes || (mesActual === mes && hoy.getDate() < dia)) {
    edad -= 1
  }

  return edad >= 18
}

export function esCorreoDuoc(correo) {
  const texto = (correo || '').trim().toLowerCase()
  return DOMINIOS_DUOC.some((dominio) => texto.endsWith(dominio))
}

export function calcularDescuento(correo) {
  return esCorreoDuoc(correo) ? 0.2 : 0
}

export function validarRegistro(datos, hoy = new Date()) {
  const errores = {}

  if (!datos.nombre.trim()) {
    errores.nombre = 'Ingresa tu nombre.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
    errores.correo = 'Ingresa un correo válido.'
  }

  if (!datos.fechaNacimiento) {
    errores.fechaNacimiento = 'Ingresa tu fecha de nacimiento.'
  } else if (!validarEdad(datos.fechaNacimiento, hoy)) {
    errores.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte.'
  }

  if (datos.contrasena.length < 6) {
    errores.contrasena = 'La contraseña debe tener al menos 6 caracteres.'
  }

  return errores
}
