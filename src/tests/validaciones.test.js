import { describe, expect, test } from 'vitest'
import {
  calcularDescuento,
  esCorreoDuoc,
  validarEdad,
  validarRegistro,
} from '../utils/validaciones'

const hoy = new Date(2026, 9, 3)

describe('validarEdad', () => {
  test('rechaza a quien cumple 18 mañana', () => {
    expect(validarEdad('2008-10-04', hoy)).toBe(false)
  })

  test('acepta a quien cumple 18 hoy', () => {
    expect(validarEdad('2008-10-03', hoy)).toBe(true)
  })

  test('acepta a un adulto y rechaza una fecha vacía', () => {
    expect(validarEdad('2000-01-01', hoy)).toBe(true)
    expect(validarEdad('', hoy)).toBe(false)
  })
})

describe('correo Duoc y descuento', () => {
  test('reconoce los dominios Duoc sin importar mayúsculas', () => {
    expect(esCorreoDuoc('ana@duocuc.cl')).toBe(true)
    expect(esCorreoDuoc('ANA@DUOC.CL')).toBe(true)
    expect(esCorreoDuoc('ana@gmail.com')).toBe(false)
  })

  test('da 20% solo con correo Duoc', () => {
    expect(calcularDescuento('ana@duocuc.cl')).toBe(0.2)
    expect(calcularDescuento('ana@gmail.com')).toBe(0)
  })
})

describe('validarRegistro', () => {
  const valido = {
    nombre: 'Ana',
    correo: 'ana@duocuc.cl',
    fechaNacimiento: '2000-01-01',
    contrasena: 'secreta1',
    codigoReferido: '',
  }

  test('no devuelve errores con datos válidos', () => {
    expect(validarRegistro(valido, hoy)).toEqual({})
  })

  test('marca la edad, el correo y la contraseña inválidos', () => {
    const errores = validarRegistro(
      { ...valido, correo: 'ana', fechaNacimiento: '2015-05-05', contrasena: '123' },
      hoy
    )
    expect(errores.correo).toBeDefined()
    expect(errores.fechaNacimiento).toMatch(/18/)
    expect(errores.contrasena).toBeDefined()
  })
})
