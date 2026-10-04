import { describe, expect, test } from 'vitest'
import {
  agregarResena,
  promedioPuntuacion,
  resenasDeProducto,
  validarResena,
} from '../utils/resenas'

const resena = (codigo, correo, puntuacion) => ({
  codigo,
  correo,
  autor: 'Ana',
  puntuacion,
  comentario: 'Muy bueno',
  fecha: '2026-10-03',
})

describe('validarResena', () => {
  test('acepta una calificación y un comentario válidos', () => {
    expect(validarResena({ puntuacion: 4, comentario: 'Muy bueno' })).toEqual({})
  })

  test('rechaza calificación fuera de rango y comentario corto', () => {
    const errores = validarResena({ puntuacion: 0, comentario: 'ok' })
    expect(errores.puntuacion).toBeDefined()
    expect(errores.comentario).toBeDefined()
  })
})

describe('agregarResena', () => {
  test('agrega una reseña nueva', () => {
    const { resenas } = agregarResena([], resena('JM001', 'a@x.cl', 5))
    expect(resenas).toHaveLength(1)
  })

  test('rechaza una segunda reseña del mismo usuario al mismo producto', () => {
    const { resenas } = agregarResena([], resena('JM001', 'a@x.cl', 5))
    expect(agregarResena(resenas, resena('JM001', 'a@x.cl', 3)).error).toMatch(/Ya dejaste/)
  })
})

test('filtra por producto y calcula el promedio', () => {
  const todas = [
    resena('JM001', 'a@x.cl', 5),
    resena('JM001', 'b@x.cl', 4),
    resena('CO001', 'a@x.cl', 1),
  ]
  const delProducto = resenasDeProducto(todas, 'JM001')
  expect(delProducto).toHaveLength(2)
  expect(promedioPuntuacion(delProducto)).toBe(4.5)
  expect(promedioPuntuacion([])).toBe(0)
})
