import { expect, test } from 'vitest'
import { actualizarNombre } from '../utils/usuarios'

const usuarios = [
  { correo: 'ana@duocuc.cl', nombre: 'Ana' },
  { correo: 'beto@gmail.com', nombre: 'Beto' },
]

test('cambia solo el nombre del usuario indicado y quita espacios', () => {
  const resultado = actualizarNombre(usuarios, 'ana@duocuc.cl', '  Ana María ')
  expect(resultado[0].nombre).toBe('Ana María')
  expect(resultado[1].nombre).toBe('Beto')
})

test('no modifica la lista original', () => {
  actualizarNombre(usuarios, 'ana@duocuc.cl', 'Otra')
  expect(usuarios[0].nombre).toBe('Ana')
})
