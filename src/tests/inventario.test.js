import { describe, expect, it } from 'vitest'
import { productosCriticos, stockDe, UMBRAL_CRITICO } from '../utils/inventario'

const inventario = { A1: 3, B2: 20, C3: 0 }

describe('stockDe', () => {
  it('usa el stock del propio producto si lo trae', () => {
    expect(stockDe({ codigo: 'A1', stock: 9 }, inventario)).toBe(9)
  })

  it('si no lo trae, lo busca en el inventario', () => {
    expect(stockDe({ codigo: 'A1' }, inventario)).toBe(3)
  })

  it('devuelve null cuando no hay dato en ninguno', () => {
    expect(stockDe({ codigo: 'Z9' }, inventario)).toBeNull()
  })
})

describe('productosCriticos', () => {
  const productos = [
    { codigo: 'A1', nombre: 'Uno' },
    { codigo: 'B2', nombre: 'Dos' },
    { codigo: 'C3', nombre: 'Tres' },
    { codigo: 'Z9', nombre: 'Sin dato' },
  ]

  it('deja solo los de stock igual o menor al umbral, del más bajo al más alto', () => {
    const lista = productosCriticos(productos, UMBRAL_CRITICO, inventario)

    expect(lista.map((producto) => producto.codigo)).toEqual(['C3', 'A1'])
    expect(lista[0].stock).toBe(0)
  })

  it('un umbral mayor deja entrar más productos', () => {
    const lista = productosCriticos(productos, 20, inventario)

    expect(lista).toHaveLength(3)
  })

  it('los productos sin dato de stock no se consideran críticos', () => {
    const lista = productosCriticos(productos, 100, inventario)

    expect(lista.some((producto) => producto.codigo === 'Z9')).toBe(false)
  })

  it('no modifica la lista original', () => {
    productosCriticos(productos, UMBRAL_CRITICO, inventario)

    expect(productos[0]).toEqual({ codigo: 'A1', nombre: 'Uno' })
  })
})
