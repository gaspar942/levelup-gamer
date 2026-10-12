import { expect, test } from 'vitest'
import { aplicarDescuento } from '../utils/carrito'

test('aplica el 20% de descuento Duoc al total', () => {
  expect(aplicarDescuento(100000, 0.2)).toEqual({ monto: 20000, totalFinal: 80000 })
})

test('sin descuento el total no cambia', () => {
  expect(aplicarDescuento(50000, 0)).toEqual({ monto: 0, totalFinal: 50000 })
})
