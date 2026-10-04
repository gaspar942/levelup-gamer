import { describe, expect, test } from 'vitest'
import {
  agregarAlCarrito,
  calcularTotal,
  cambiarCantidad,
  contarItems,
  quitarDelCarrito,
} from '../utils/carrito'

const catan = { codigo: 'JM001', nombre: 'Catan', precio: 29990 }
const polera = { codigo: 'PP001', nombre: 'Polera', precio: 14990 }

describe('carrito', () => {
  test('agrega un producto nuevo con cantidad 1', () => {
    const carrito = agregarAlCarrito([], catan)
    expect(carrito).toEqual([{ ...catan, cantidad: 1 }])
  })

  test('si el producto ya existe, aumenta la cantidad', () => {
    const carrito = agregarAlCarrito(agregarAlCarrito([], catan), catan)
    expect(carrito).toHaveLength(1)
    expect(carrito[0].cantidad).toBe(2)
  })

  test('quita un producto por código', () => {
    const carrito = agregarAlCarrito(agregarAlCarrito([], catan), polera)
    expect(quitarDelCarrito(carrito, 'JM001')).toHaveLength(1)
  })

  test('cambia la cantidad y elimina el producto si baja de 1', () => {
    const carrito = agregarAlCarrito([], catan)
    expect(cambiarCantidad(carrito, 'JM001', 3)[0].cantidad).toBe(3)
    expect(cambiarCantidad(carrito, 'JM001', 0)).toEqual([])
  })

  test('calcula el total y cuenta los items', () => {
    let carrito = agregarAlCarrito([], catan)
    carrito = agregarAlCarrito(carrito, catan)
    carrito = agregarAlCarrito(carrito, polera)
    expect(calcularTotal(carrito)).toBe(29990 * 2 + 14990)
    expect(contarItems(carrito)).toBe(3)
  })
})
