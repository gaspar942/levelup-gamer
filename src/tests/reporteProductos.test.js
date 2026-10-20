import { describe, expect, it } from 'vitest'
import { reporteProductos } from '../utils/reportes'
import { ordenDemo } from './ordenesDemo'

const productos = [
  { codigo: 'MS001', nombre: 'Mouse G203', categoria: 'Mouse', stock: 8 },
  { codigo: 'AC001', nombre: 'Auriculares Cloud', categoria: 'Accesorios', stock: 0 },
  { codigo: 'TC001', nombre: 'Teclado Pro', categoria: 'Teclados', stock: 20 },
  { codigo: 'XX001', nombre: 'Producto sin dato', categoria: 'Otros' },
]

const ordenes = [
  ordenDemo(),
  ordenDemo({
    numero: '2026102002',
    items: [{ codigo: 'AC001', nombre: 'Auriculares Cloud', precio: 10000, cantidad: 1 }],
    total: 10000,
  }),
  ordenDemo({
    numero: '2026102003',
    estado: 'rechazada',
    items: [{ codigo: 'TC001', nombre: 'Teclado Pro', precio: 5000, cantidad: 9 }],
    total: 45000,
  }),
]

describe('reporteProductos', () => {
  it('devuelve una fila por producto del catálogo con stock y ventas', () => {
    const filas = reporteProductos(ordenes, productos)

    expect(filas).toHaveLength(4)
    expect(filas[0]).toEqual({
      codigo: 'MS001',
      nombre: 'Mouse G203',
      categoria: 'Mouse',
      stock: 8,
      unidades: 2,
      ingresos: 40000,
    })
  })

  it('ordena de más a menos vendido y deja al final los que no se vendieron', () => {
    const codigos = reporteProductos(ordenes, productos).map((fila) => fila.codigo)

    expect(codigos).toEqual(['MS001', 'AC001', 'XX001', 'TC001'])
  })

  it('no cuenta las órdenes rechazadas', () => {
    const teclado = reporteProductos(ordenes, productos).find((fila) => fila.codigo === 'TC001')

    expect(teclado.unidades).toBe(0)
    expect(teclado.ingresos).toBe(0)
  })

  it('un producto sin stock conocido queda con stock null', () => {
    const sinDato = reporteProductos(ordenes, productos).find((fila) => fila.codigo === 'XX001')

    expect(sinDato.stock).toBeNull()
  })

  it('sin órdenes todos los productos quedan con cero ventas', () => {
    const filas = reporteProductos([], productos)

    expect(filas).toHaveLength(4)
    expect(filas.every((fila) => fila.unidades === 0 && fila.ingresos === 0)).toBe(true)
  })

  it('sin productos devuelve una lista vacía', () => {
    expect(reporteProductos(ordenes, [])).toEqual([])
  })
})
