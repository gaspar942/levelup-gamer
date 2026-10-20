// Validación del formulario de contacto. Es una función pura para poder probarla fácil.
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MENSAJE_MINIMO = 10
export const MENSAJE_MAXIMO = 500

export function validarContacto(datos) {
  const errores = {}
  const mensaje = datos.mensaje.trim()

  if (!datos.nombre.trim()) {
    errores.nombre = 'Ingresa tu nombre.'
  }

  if (!FORMATO_CORREO.test(datos.correo.trim())) {
    errores.correo = 'Ingresa un correo válido.'
  }

  if (mensaje.length < MENSAJE_MINIMO) {
    errores.mensaje = `El mensaje debe tener al menos ${MENSAJE_MINIMO} caracteres.`
  } else if (mensaje.length > MENSAJE_MAXIMO) {
    errores.mensaje = `El mensaje no puede superar los ${MENSAJE_MAXIMO} caracteres.`
  }

  return errores
}
