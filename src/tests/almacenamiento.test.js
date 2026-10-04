import { beforeEach, describe, expect, test } from 'vitest'
import {
  guardarResenas,
  guardarSesion,
  guardarUsuarios,
  leerResenas,
  leerSesion,
  leerUsuarios,
} from '../utils/almacenamiento'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('usuarios', () => {
  test('devuelve una lista vacía si no hay nada guardado', () => {
    expect(leerUsuarios()).toEqual([])
  })

  test('guarda y vuelve a leer los usuarios', () => {
    const usuarios = [{ nombre: 'Ana', correo: 'ana@duocuc.cl' }]
    guardarUsuarios(usuarios)
    expect(leerUsuarios()).toEqual(usuarios)
    expect(localStorage.getItem('levelup_usuarios')).toContain('ana@duocuc.cl')
  })

  test('devuelve una lista vacía si el contenido guardado está dañado', () => {
    localStorage.setItem('levelup_usuarios', '{no es json')
    expect(leerUsuarios()).toEqual([])
  })
})

describe('sesión', () => {
  test('guarda el correo de la sesión y lo borra con null', () => {
    guardarSesion('ana@duocuc.cl')
    expect(leerSesion()).toBe('ana@duocuc.cl')

    guardarSesion(null)
    expect(leerSesion()).toBeNull()
  })
})

describe('reseñas', () => {
  test('guarda y vuelve a leer las reseñas', () => {
    expect(leerResenas()).toEqual([])

    const resenas = [{ codigo: 'JM001', correo: 'ana@duocuc.cl', puntuacion: 5 }]
    guardarResenas(resenas)

    expect(leerResenas()).toEqual(resenas)
  })
})
