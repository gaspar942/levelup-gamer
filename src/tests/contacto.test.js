import { describe, expect, it } from 'vitest'
import { MENSAJE_MAXIMO, validarContacto } from '../utils/contacto'

const validos = { nombre: 'Ana', correo: 'ana@duocuc.cl', mensaje: 'Hola, tengo una consulta.' }

describe('validarContacto', () => {
  it('con datos válidos no devuelve errores', () => {
    expect(validarContacto(validos)).toEqual({})
  })

  it('exige el nombre', () => {
    expect(validarContacto({ ...validos, nombre: '  ' }).nombre).toBe('Ingresa tu nombre.')
  })

  it('exige un correo con formato válido', () => {
    expect(validarContacto({ ...validos, correo: 'ana@' }).correo).toBe('Ingresa un correo válido.')
  })

  it('exige un mensaje de al menos 10 caracteres', () => {
    expect(validarContacto({ ...validos, mensaje: 'corto' }).mensaje).toBe(
      'El mensaje debe tener al menos 10 caracteres.'
    )
  })

  it('no acepta un mensaje demasiado largo', () => {
    const mensaje = 'a'.repeat(MENSAJE_MAXIMO + 1)

    expect(validarContacto({ ...validos, mensaje }).mensaje).toBe(
      'El mensaje no puede superar los 500 caracteres.'
    )
  })
})
