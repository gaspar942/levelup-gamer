import { describe, expect, test } from 'vitest'
import { productos } from '../data/productos'
import { filtrarProductos } from '../utils/filtros'

describe('filtrarProductos', () => {
  test('sin filtros devuelve todo el catálogo', () => {
    expect(filtrarProductos(productos)).toHaveLength(productos.length)
  })

  test('filtra por categoría', () => {
    const resultado = filtrarProductos(productos, { categoria: 'Juegos de Mesa' })
    expect(resultado).toHaveLength(2)
  })

  test('busca por texto sin importar mayúsculas', () => {
    const resultado = filtrarProductos(productos, { busqueda: 'playstation' })
    expect(resultado.map((p) => p.codigo)).toEqual(['CO001'])
  })

  test('filtra por precio máximo y combina filtros', () => {
    const baratos = filtrarProductos(productos, { precioMax: 30000 })
    expect(baratos.every((p) => p.precio <= 30000)).toBe(true)

    const combinado = filtrarProductos(productos, {
      categoria: 'Juegos de Mesa',
      precioMax: 25000,
    })
    expect(combinado.map((p) => p.codigo)).toEqual(['JM002'])
  })
})
