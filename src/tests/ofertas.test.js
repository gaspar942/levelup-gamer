import { describe, expect, it } from 'vitest'
import { ofertas } from '../data/ofertas'
import { productos } from '../data/productos'
import { aplicarOferta, productosConOferta } from '../utils/ofertas'

const tablaDePrueba = { X1: 50 }
const conDescuento = { codigo: 'X1', nombre: 'Producto X', precio: 1000 }
const sinDescuento = { codigo: 'Y2', nombre: 'Producto Y', precio: 2000 }

describe('aplicarOferta', () => {
  it('rebaja el precio y guarda el original y el porcentaje', () => {
    const resultado = aplicarOferta(conDescuento, tablaDePrueba)

    expect(resultado.precio).toBe(500)
    expect(resultado.precioOriginal).toBe(1000)
    expect(resultado.porcentajeOferta).toBe(50)
  })

  it('no modifica el producto original', () => {
    aplicarOferta(conDescuento, tablaDePrueba)

    expect(conDescuento.precio).toBe(1000)
    expect(conDescuento.precioOriginal).toBeUndefined()
  })

  it('devuelve el mismo producto si no tiene oferta', () => {
    expect(aplicarOferta(sinDescuento, tablaDePrueba)).toBe(sinDescuento)
  })

  it('no descuenta dos veces un producto que ya tiene la oferta aplicada', () => {
    const una = aplicarOferta(conDescuento, tablaDePrueba)
    const dos = aplicarOferta(una, tablaDePrueba)

    expect(dos.precio).toBe(500)
    expect(dos).toBe(una)
  })

  it('redondea el precio al peso más cercano', () => {
    const resultado = aplicarOferta({ codigo: 'X1', precio: 1001 }, tablaDePrueba)

    expect(resultado.precio).toBe(501)
  })
})

describe('productosConOferta', () => {
  it('deja solo los productos que tienen oferta', () => {
    const lista = productosConOferta([conDescuento, sinDescuento], tablaDePrueba)

    expect(lista).toHaveLength(1)
    expect(lista[0].codigo).toBe('X1')
    expect(lista[0].precio).toBe(500)
  })

  it('devuelve una lista vacía si no hay ofertas', () => {
    expect(productosConOferta([sinDescuento], tablaDePrueba)).toEqual([])
  })
})

describe('tabla de ofertas del proyecto', () => {
  it('todas las ofertas apuntan a productos que existen y tienen un porcentaje válido', () => {
    const codigos = productos.map((producto) => producto.codigo)

    Object.entries(ofertas).forEach(([codigo, porcentaje]) => {
      expect(codigos).toContain(codigo)
      expect(porcentaje).toBeGreaterThan(0)
      expect(porcentaje).toBeLessThan(100)
    })
  })
})
