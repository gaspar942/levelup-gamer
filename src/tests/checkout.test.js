import { describe, expect, it, vi } from 'vitest'
import {
  PROBABILIDAD_RECHAZO,
  buscarOrden,
  crearOrden,
  datosDesdeOrden,
  generarNumeroOrden,
  procesarPago,
  validarCheckout,
} from '../utils/checkout'

const carrito = [
  { codigo: 'MS001', nombre: 'Mouse Gamer', precio: 10000, cantidad: 2 },
  { codigo: 'TC002', nombre: 'Teclado', precio: 5000, cantidad: 1 },
]

const datosValidos = {
  nombre: ' Ana ',
  apellidos: 'Rojas',
  correo: ' ANA@Duocuc.cl ',
  calle: 'Los Aromos 123',
  departamento: '',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Maipú',
  indicaciones: '',
}

const fecha = new Date(2026, 9, 19, 15, 30)

describe('validarCheckout', () => {
  it('no devuelve errores con datos completos', () => {
    expect(validarCheckout(datosValidos)).toEqual({})
  })

  it('marca como obligatorios los campos vacíos', () => {
    const errores = validarCheckout({
      nombre: '',
      apellidos: ' ',
      correo: '',
      calle: '',
      departamento: '',
      region: '',
      comuna: '',
      indicaciones: '',
    })

    expect(Object.keys(errores).sort()).toEqual(
      ['apellidos', 'calle', 'comuna', 'correo', 'nombre', 'region'].sort()
    )
  })

  it('rechaza un correo con formato inválido', () => {
    const errores = validarCheckout({ ...datosValidos, correo: 'ana@duoc' })

    expect(errores.correo).toMatch(/formato/)
  })

  it('el departamento y las indicaciones son opcionales', () => {
    const errores = validarCheckout({ ...datosValidos, departamento: '', indicaciones: '' })

    expect(errores.departamento).toBeUndefined()
    expect(errores.indicaciones).toBeUndefined()
  })
})

describe('procesarPago (con generador de azar simulado)', () => {
  it('aprueba el pago cuando el azar queda sobre la probabilidad de rechazo', () => {
    const azar = vi.fn(() => 0.9)

    expect(procesarPago(azar)).toEqual({ ok: true })
    expect(azar).toHaveBeenCalledTimes(1)
  })

  it('rechaza el pago cuando el azar queda bajo la probabilidad de rechazo', () => {
    const resultado = procesarPago(() => PROBABILIDAD_RECHAZO - 0.01)

    expect(resultado.ok).toBe(false)
    expect(resultado.motivo).toMatch(/rechaz/)
  })

  it('usa Math.random por defecto', () => {
    const espia = vi.spyOn(Math, 'random').mockReturnValue(0.5)

    expect(procesarPago().ok).toBe(true)
    expect(espia).toHaveBeenCalled()

    espia.mockRestore()
  })
})

describe('generarNumeroOrden', () => {
  it('parte con la fecha y el correlativo 01', () => {
    expect(generarNumeroOrden([], fecha)).toBe('2026101901')
  })

  it('incrementa el correlativo solo con las órdenes del mismo día', () => {
    const ordenes = [{ numero: '2026101901' }, { numero: '2026101801' }]

    expect(generarNumeroOrden(ordenes, fecha)).toBe('2026101902')
  })
})

describe('crearOrden', () => {
  it('crea una orden pagada con los totales y los datos limpios', () => {
    const orden = crearOrden({
      carrito,
      datos: datosValidos,
      resultadoPago: { ok: true },
      fecha,
    })

    expect(orden.estado).toBe('pagada')
    expect(orden.numero).toBe('2026101901')
    expect(orden.subtotal).toBe(25000)
    expect(orden.descuento).toBe(0)
    expect(orden.total).toBe(25000)
    expect(orden.cliente).toEqual({
      nombre: 'Ana',
      apellidos: 'Rojas',
      correo: 'ana@duocuc.cl',
    })
    expect(orden.items).toHaveLength(2)
  })

  it('aplica el descuento Duoc al total', () => {
    const orden = crearOrden({
      carrito,
      datos: datosValidos,
      descuento: 0.2,
      resultadoPago: { ok: true },
      fecha,
    })

    expect(orden.descuento).toBe(5000)
    expect(orden.total).toBe(20000)
  })

  it('guarda el motivo cuando el pago es rechazado', () => {
    const orden = crearOrden({
      carrito,
      datos: datosValidos,
      resultadoPago: { ok: false, motivo: 'Sin fondos.' },
      fecha,
    })

    expect(orden.estado).toBe('rechazada')
    expect(orden.motivo).toBe('Sin fondos.')
  })
})

describe('buscarOrden y datosDesdeOrden', () => {
  const orden = crearOrden({
    carrito,
    datos: datosValidos,
    resultadoPago: { ok: true },
    fecha,
  })

  it('encuentra una orden por su número o devuelve null', () => {
    expect(buscarOrden([orden], '2026101901')).toBe(orden)
    expect(buscarOrden([orden], '999')).toBeNull()
  })

  it('devuelve cliente y dirección juntos, con el formato del formulario', () => {
    const datos = datosDesdeOrden(orden)

    expect(datos.nombre).toBe('Ana')
    expect(datos.calle).toBe('Los Aromos 123')
    expect(datos.comuna).toBe('Maipú')
  })
})
