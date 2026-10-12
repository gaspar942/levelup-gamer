import { beforeEach, expect, test } from 'vitest'
import { guardarCarrito, leerCarrito } from '../utils/almacenamiento'

beforeEach(() => {
  localStorage.clear()
})

test('el carrito se guarda, se vuelve a leer y parte vacío', () => {
  expect(leerCarrito()).toEqual([])

  const carrito = [{ codigo: 'JM001', nombre: 'Catan', precio: 29990, cantidad: 2 }]
  guardarCarrito(carrito)

  expect(leerCarrito()).toEqual(carrito)
})
