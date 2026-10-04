import { describe, expect, test } from 'vitest'
import {
  PUNTOS_REFERIDO,
  autenticar,
  crearUsuario,
  nivelPorPuntos,
} from '../utils/usuarios'

const datos = {
  nombre: 'Ana',
  correo: 'Ana@duocuc.cl',
  fechaNacimiento: '2000-01-01',
  contrasena: 'secreta1',
  codigoReferido: '',
}

describe('crearUsuario', () => {
  test('crea el usuario con descuento Duoc y código propio', () => {
    const { usuario, usuarios } = crearUsuario([], datos)
    expect(usuarios).toHaveLength(1)
    expect(usuario.correo).toBe('ana@duocuc.cl')
    expect(usuario.descuento).toBe(0.2)
    expect(usuario.puntos).toBe(0)
    expect(usuario.codigoPropio).toBe('LVL0001')
  })

  test('rechaza un correo repetido', () => {
    const { usuarios } = crearUsuario([], datos)
    expect(crearUsuario(usuarios, datos).error).toMatch(/ya está registrado/)
  })

  test('suma puntos al referidor cuando el código existe', () => {
    const { usuarios } = crearUsuario([], datos)
    const resultado = crearUsuario(usuarios, {
      ...datos,
      correo: 'beto@gmail.com',
      codigoReferido: 'lvl0001',
    })
    expect(resultado.usuarios[0].puntos).toBe(PUNTOS_REFERIDO)
    expect(resultado.usuario.descuento).toBe(0)
  })

  test('rechaza un código de referido que no existe', () => {
    const resultado = crearUsuario([], { ...datos, codigoReferido: 'LVL9999' })
    expect(resultado.error).toMatch(/no existe/)
  })
})

describe('autenticar y nivel', () => {
  test('encuentra al usuario solo con las credenciales correctas', () => {
    const { usuarios } = crearUsuario([], datos)
    expect(autenticar(usuarios, 'ANA@duocuc.cl', 'secreta1')).not.toBeNull()
    expect(autenticar(usuarios, 'ana@duocuc.cl', 'otra')).toBeNull()
  })

  test('asigna el nivel según los puntos', () => {
    expect(nivelPorPuntos(0)).toBe('Bronce')
    expect(nivelPorPuntos(200)).toBe('Plata')
    expect(nivelPorPuntos(500)).toBe('Oro')
  })
})
