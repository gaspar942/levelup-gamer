import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  guardarCategorias,
  guardarProductos,
  leerCategorias,
  leerProductos,
} from '../utils/almacenamiento'

describe('almacenamiento del catálogo', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('devuelve null si todavía no se guardó nada', () => {
    expect(leerProductos()).toBeNull()
    expect(leerCategorias()).toBeNull()
  })

  it('guarda y vuelve a leer productos y categorías', () => {
    const productos = [{ codigo: 'MS001', nombre: 'Mouse', precio: 1000 }]
    const categorias = ['Mouse', 'Accesorios']

    guardarProductos(productos)
    guardarCategorias(categorias)

    expect(leerProductos()).toEqual(productos)
    expect(leerCategorias()).toEqual(categorias)
  })

  it('distingue una lista vacía guardada de una que nunca se guardó', () => {
    guardarProductos([])

    expect(leerProductos()).toEqual([])
  })

  it('devuelve null si lo guardado está dañado o no es una lista', () => {
    localStorage.setItem('levelup_productos', '{no es json')
    localStorage.setItem('levelup_categorias', '{"a":1}')

    expect(leerProductos()).toBeNull()
    expect(leerCategorias()).toBeNull()
  })
})
