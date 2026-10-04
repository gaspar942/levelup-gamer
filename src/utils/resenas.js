// Reglas de las reseñas. Son funciones puras, sin storage.

export function validarResena({ puntuacion, comentario }) {
  const errores = {}

  if (!Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 5) {
    errores.puntuacion = 'Elige una calificación de 1 a 5.'
  }

  if (comentario.trim().length < 5) {
    errores.comentario = 'Escribe un comentario de al menos 5 caracteres.'
  }

  return errores
}

export function agregarResena(resenas, nueva) {
  const repetida = resenas.some(
    (resena) => resena.codigo === nueva.codigo && resena.correo === nueva.correo
  )

  if (repetida) {
    return { error: 'Ya dejaste una reseña para este producto.' }
  }

  return { resenas: [...resenas, nueva] }
}

export function resenasDeProducto(resenas, codigo) {
  return resenas.filter((resena) => resena.codigo === codigo)
}

export function promedioPuntuacion(lista) {
  if (lista.length === 0) {
    return 0
  }

  const suma = lista.reduce((total, resena) => total + resena.puntuacion, 0)
  return Math.round((suma / lista.length) * 10) / 10
}
