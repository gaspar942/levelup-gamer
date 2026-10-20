import { describe, expect, it } from 'vitest'
import {
  ordenesPagadas,
  resumenOrdenes,
  totalVentas,
  ventasPorCategoria,
  ventasPorProducto,
} from '../utils/reportes'
import { ordenDemo } from './ordenesDemo'

const productos = [
  { codigo: 'MS001', categoria: 'Mouse' },
  { codigo: 'AC001', categoria: 'Accesorios' },
]

const ordenes = [
  ordenDemo(),
  ordenDemo({
    numero: '2026102002',
    items: [
      { codigo: 'AC001', nombre: 'Auriculares Cloud', precio: 10000, cantidad: 1 },
      { codigo: 'MS001', nombre: 'Mouse G203', precio: 20000, cantidad: 1 },
    ],
    total: 30000,
  }),
  ordenDemo({
    numero: '2026102003',
    estado: 'rechazada',
    items: [{ codigo: 'AC001', nombre: 'Auriculares Cloud', precio: 10000, cantidad: 9 }],
    total: 90000,
  }),
]

describe('reportes de ventas', () => {
  it('ordenesPagadas deja fuera las rechazadas', () => {
    expect(ordenesPagadas(ordenes)).toHaveLength(2)
  })

  it('resumenOrdenes cuenta pagadas, rechazadas y total', () => {
    expect(resumenOrdenes(ordenes)).toEqual({ pagadas: 2, rechazadas: 1, total: 3 })
  })

  it('totalVentas suma solo las órdenes pagadas', () => {
    expect(totalVentas(ordenes)).toBe(70000)
  })

  it('totalVentas sin órdenes es 0', () => {
    expect(totalVentas([])).toBe(0)
  })

  it('ventasPorProducto junta unidades e ingresos, del más vendido al menos', () => {
    const ventas = ventasPorProducto(ordenes)

    expect(ventas).toEqual([
      { codigo: 'MS001', nombre: 'Mouse G203', unidades: 3, ingresos: 60000 },
      { codigo: 'AC001', nombre: 'Auriculares Cloud', unidades: 1, ingresos: 10000 },
    ])
  })

  it('ventasPorCategoria agrupa por la categoría del catálogo, de más a menos ingresos', () => {
    expect(ventasPorCategoria(ordenes, productos)).toEqual([
      { categoria: 'Mouse', unidades: 3, ingresos: 60000 },
      { categoria: 'Accesorios', unidades: 1, ingresos: 10000 },
    ])
  })

  it('un producto que ya no está en el catálogo va a "Sin categoría"', () => {
    const resultado = ventasPorCategoria(ordenes, [])

    expect(resultado).toEqual([{ categoria: 'Sin categoría', unidades: 4, ingresos: 70000 }])
  })
})
