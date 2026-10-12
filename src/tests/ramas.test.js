import { describe, expect, test } from 'vitest'
import { agregarAlCarrito, cambiarCantidad } from '../utils/carrito'
import { crearUsuario } from '../utils/usuarios'
import { validarRegistro } from '../utils/validaciones'

const catan = { codigo: 'JM001', nombre: 'Catan', precio: 29990 }
const polera = { codigo: 'PP001', nombre: 'Polera', precio: 14990 }

function carritoConDosProductos() {
  return agregarAlCarrito(agregarAlCarrito([], catan), polera)
}

describe('carrito con varios productos', () => {
  test('agregar un producto repetido no toca a los demás', () => {
    const resultado = agregarAlCarrito(carritoConDosProductos(), catan)
    expect(resultado.find((item) => item.codigo === 'JM001').cantidad).toBe(2)
    expect(resultado.find((item) => item.codigo === 'PP001').cantidad).toBe(1)
  })

  test('cambiar la cantidad no toca a los demás', () => {
    const resultado = cambiarCantidad(carritoConDosProductos(), 'JM001', 5)
    expect(resultado.find((item) => item.codigo === 'JM001').cantidad).toBe(5)
    expect(resultado.find((item) => item.codigo === 'PP001').cantidad).toBe(1)
  })
})

describe('referidos con varios usuarios', () => {
  const datos = (correo, codigoReferido = '') => ({
    nombre: 'X',
    correo,
    fechaNacimiento: '2000-01-01',
    contrasena: 'secreta1',
    codigoReferido,
  })

  test('los puntos solo los recibe el dueño del código', () => {
    let usuarios = crearUsuario([], datos('a@x.cl')).usuarios
    usuarios = crearUsuario(usuarios, datos('b@x.cl')).usuarios

    const resultado = crearUsuario(usuarios, datos('c@x.cl', 'LVL0001'))

    expect(resultado.usuarios[0].puntos).toBe(100)
    expect(resultado.usuarios[1].puntos).toBe(0)
  })
})

describe('validarRegistro con campos vacíos', () => {
  const valido = {
    nombre: 'Ana',
    correo: 'ana@duocuc.cl',
    fechaNacimiento: '2000-01-01',
    contrasena: 'secreta1',
    codigoReferido: '',
  }

  test('pide la fecha de nacimiento', () => {
    const errores = validarRegistro({ ...valido, fechaNacimiento: '' })
    expect(errores.fechaNacimiento).toBe('Ingresa tu fecha de nacimiento.')
  })

  test('pide el nombre', () => {
    const errores = validarRegistro({ ...valido, nombre: '   ' })
    expect(errores.nombre).toBe('Ingresa tu nombre.')
  })
})
