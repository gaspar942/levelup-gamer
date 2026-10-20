import { describe, expect, it } from 'vitest'
import { buscarArticulo } from '../utils/blog'

const articulos = [
  { id: 1, titulo: 'Uno' },
  { id: 2, titulo: 'Dos' },
]

describe('buscarArticulo', () => {
  it('encuentra el artículo aunque el id llegue como texto (viene de la URL)', () => {
    expect(buscarArticulo(articulos, '2').titulo).toBe('Dos')
  })

  it('devuelve null si no existe', () => {
    expect(buscarArticulo(articulos, '99')).toBeNull()
  })
})
