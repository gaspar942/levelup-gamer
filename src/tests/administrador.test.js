import { describe, expect, it } from 'vitest'
import { administrador } from '../data/administrador'
import {
  autenticarAdministrador,
  buscarUsuarioSesion,
  correoReservado,
  esAdministrador,
} from '../utils/administrador'

const usuarios = [{ nombre: 'Ana', correo: 'ana@duocuc.cl', contrasena: 'abc123' }]

describe('esAdministrador', () => {
  it('es verdadero solo para una cuenta con rol admin', () => {
    expect(esAdministrador(administrador)).toBe(true)
    expect(esAdministrador(usuarios[0])).toBe(false)
    expect(esAdministrador(null)).toBe(false)
  })
})

describe('autenticarAdministrador', () => {
  it('entrega la cuenta si el correo y la contraseña coinciden', () => {
    expect(autenticarAdministrador(administrador.correo, administrador.contrasena)).toBe(
      administrador
    )
  })

  it('acepta el correo con mayúsculas y espacios', () => {
    expect(
      autenticarAdministrador(`  ${administrador.correo.toUpperCase()} `, administrador.contrasena)
    ).toBe(administrador)
  })

  it('devuelve null con una contraseña o un correo incorrectos', () => {
    expect(autenticarAdministrador(administrador.correo, 'otra')).toBeNull()
    expect(autenticarAdministrador('ana@duocuc.cl', administrador.contrasena)).toBeNull()
  })
})

describe('correoReservado', () => {
  it('detecta el correo del administrador sin importar mayúsculas ni espacios', () => {
    expect(correoReservado(` ${administrador.correo.toUpperCase()}`)).toBe(true)
    expect(correoReservado('ana@duocuc.cl')).toBe(false)
    expect(correoReservado(undefined)).toBe(false)
  })
})

describe('buscarUsuarioSesion', () => {
  it('encuentra al administrador, a un usuario registrado o a nadie', () => {
    expect(buscarUsuarioSesion(usuarios, administrador.correo)).toBe(administrador)
    expect(buscarUsuarioSesion(usuarios, 'ana@duocuc.cl')).toBe(usuarios[0])
    expect(buscarUsuarioSesion(usuarios, 'otro@duocuc.cl')).toBeNull()
    expect(buscarUsuarioSesion(usuarios, null)).toBeNull()
  })
})
