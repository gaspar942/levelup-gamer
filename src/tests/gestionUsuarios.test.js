import { describe, expect, it } from 'vitest'
import { editarUsuario, eliminarUsuario } from '../utils/gestionUsuarios'

const usuarios = [
  { nombre: 'Ana', correo: 'ana@duocuc.cl', puntos: 10 },
  { nombre: 'Beto', correo: 'beto@gmail.com', puntos: 0 },
]

describe('editarUsuario', () => {
  it('cambia el nombre y deja lo demás igual', () => {
    const resultado = editarUsuario(usuarios, 'ana@duocuc.cl', { nombre: '  Ana María ' })

    expect(resultado.usuario).toEqual({ nombre: 'Ana María', correo: 'ana@duocuc.cl', puntos: 10 })
    expect(resultado.usuarios[1]).toEqual(usuarios[1])
  })

  it('no modifica la lista original', () => {
    editarUsuario(usuarios, 'ana@duocuc.cl', { nombre: 'Otro' })

    expect(usuarios[0].nombre).toBe('Ana')
  })

  it('rechaza un nombre vacío', () => {
    expect(editarUsuario(usuarios, 'ana@duocuc.cl', { nombre: '   ' }).error).toBe(
      'El nombre es obligatorio.'
    )
  })

  it('rechaza un usuario que no existe', () => {
    expect(editarUsuario(usuarios, 'nadie@correo.cl', { nombre: 'X' }).error).toBe(
      'El usuario no existe.'
    )
  })
})

describe('eliminarUsuario', () => {
  it('quita al usuario de la lista', () => {
    const resultado = eliminarUsuario(usuarios, 'beto@gmail.com')

    expect(resultado.usuarios).toHaveLength(1)
    expect(resultado.usuario.nombre).toBe('Beto')
  })

  it('rechaza un usuario que no existe', () => {
    expect(eliminarUsuario(usuarios, 'nadie@correo.cl').error).toBe('El usuario no existe.')
  })
})
