import { describe, expect, it } from 'vitest'
import { filtrarOrdenes, ordenesDeCliente } from '../utils/ordenes'
import { ordenDemo } from './ordenesDemo'

const ordenes = [
  ordenDemo({ numero: '2026102001' }),
  ordenDemo({
    numero: '2026102002',
    estado: 'rechazada',
    cliente: { nombre: 'Luis', apellidos: 'Soto', correo: 'luis@gmail.com' },
  }),
  ordenDemo({ numero: '2026101905' }),
]

describe('filtrarOrdenes', () => {
  it('sin estado devuelve todas, las más recientes primero', () => {
    expect(filtrarOrdenes(ordenes).map((orden) => orden.numero)).toEqual([
      '2026102002',
      '2026102001',
      '2026101905',
    ])
  })

  it('filtra por estado', () => {
    const lista = filtrarOrdenes(ordenes, 'rechazada')

    expect(lista).toHaveLength(1)
    expect(lista[0].numero).toBe('2026102002')
  })

  it('no modifica el orden de la lista original', () => {
    filtrarOrdenes(ordenes)

    expect(ordenes[0].numero).toBe('2026102001')
  })
})

describe('ordenesDeCliente', () => {
  it('devuelve solo las compras del correo indicado', () => {
    const lista = ordenesDeCliente(ordenes, 'ana@duocuc.cl')

    expect(lista.map((orden) => orden.numero)).toEqual(['2026102001', '2026101905'])
  })

  it('no distingue mayúsculas ni espacios en el correo', () => {
    expect(ordenesDeCliente(ordenes, '  LUIS@gmail.com ')).toHaveLength(1)
  })

  it('un correo sin compras devuelve una lista vacía', () => {
    expect(ordenesDeCliente(ordenes, 'nadie@correo.cl')).toEqual([])
  })

  it('un correo vacío o nulo no encuentra nada', () => {
    expect(ordenesDeCliente(ordenes, null)).toEqual([])
  })
})
