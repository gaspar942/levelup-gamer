import { describe, expect, it } from 'vitest'
import { rutaImagenProducto } from '../utils/imagenes'

describe('rutaImagenProducto', () => {
  it('arma la ruta de la foto con el código del producto', () => {
    expect(rutaImagenProducto('JM001')).toBe('/img/JM001.jpg')
  })

  it('codifica los caracteres especiales del código', () => {
    expect(rutaImagenProducto('a b')).toBe('/img/a%20b.jpg')
  })
})
