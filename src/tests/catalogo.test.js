import { describe, expect, it } from 'vitest'
import {
  actualizarProducto,
  buscarProducto,
  crearCategoria,
  crearProducto,
  eliminarCategoria,
  eliminarProducto,
  renombrarCategoria,
} from '../utils/catalogo'

const categorias = ['Mouse', 'Accesorios']

const productos = [
  {
    codigo: 'MS001',
    fabricante: 'Logitech',
    categoria: 'Mouse',
    nombre: 'Mouse G203',
    precio: 20000,
    descripcion: 'Mouse gamer.',
  },
  {
    codigo: 'AC001',
    fabricante: 'HyperX',
    categoria: 'Accesorios',
    nombre: 'Auriculares',
    precio: 50000,
    descripcion: 'Auriculares con micrófono.',
  },
]

const datosNuevo = {
  codigo: 'ms002',
  fabricante: 'Razer',
  categoria: 'Mouse',
  nombre: ' Mouse Viper ',
  precio: '35000',
  descripcion: 'Mouse liviano.',
}

describe('crearProducto', () => {
  it('agrega el producto con los datos limpios y sin modificar la lista original', () => {
    const resultado = crearProducto(productos, categorias, datosNuevo)

    expect(resultado.producto).toEqual({
      codigo: 'MS002',
      fabricante: 'Razer',
      categoria: 'Mouse',
      nombre: 'Mouse Viper',
      precio: 35000,
      descripcion: 'Mouse liviano.',
    })
    expect(resultado.productos).toHaveLength(3)
    expect(productos).toHaveLength(2)
  })

  it('rechaza un código que ya existe, sin importar las mayúsculas', () => {
    const resultado = crearProducto(productos, categorias, { ...datosNuevo, codigo: 'ms001' })

    expect(resultado.error).toBe('Ya existe un producto con ese código.')
    expect(resultado.productos).toBeUndefined()
  })

  it.each([
    ['sin código', { codigo: '  ' }, 'El código es obligatorio.'],
    ['sin nombre', { nombre: '  ' }, 'El nombre es obligatorio.'],
    ['con una categoría que no existe', { categoria: 'Inexistente' }, 'Elige una categoría válida.'],
    ['con precio cero', { precio: '0' }, 'El precio debe ser un número entero mayor a 0.'],
    ['con precio que no es número', { precio: 'abc' }, 'El precio debe ser un número entero mayor a 0.'],
    ['con precio con decimales', { precio: '1500.5' }, 'El precio debe ser un número entero mayor a 0.'],
  ])('rechaza un producto %s', (_caso, cambios, mensaje) => {
    const resultado = crearProducto(productos, categorias, { ...datosNuevo, ...cambios })

    expect(resultado.error).toBe(mensaje)
  })
})

describe('buscarProducto', () => {
  it('encuentra un producto por código y devuelve null si no existe', () => {
    expect(buscarProducto(productos, 'AC001')).toBe(productos[1])
    expect(buscarProducto(productos, 'NO999')).toBeNull()
  })
})

describe('actualizarProducto', () => {
  it('cambia los datos pero no el código ni los otros productos', () => {
    const resultado = actualizarProducto(productos, categorias, 'MS001', {
      codigo: 'XX999',
      nombre: 'Mouse G304',
      precio: '25000',
    })

    expect(resultado.producto.codigo).toBe('MS001')
    expect(resultado.producto.nombre).toBe('Mouse G304')
    expect(resultado.producto.precio).toBe(25000)
    expect(resultado.producto.fabricante).toBe('Logitech')
    expect(resultado.productos[1]).toBe(productos[1])
    expect(productos[0].nombre).toBe('Mouse G203')
  })

  it('avisa si el producto no existe o si los datos nuevos no son válidos', () => {
    expect(actualizarProducto(productos, categorias, 'NO999', { nombre: 'X' }).error).toBe(
      'El producto no existe.'
    )
    expect(actualizarProducto(productos, categorias, 'MS001', { precio: '-5' }).error).toBe(
      'El precio debe ser un número entero mayor a 0.'
    )
  })
})

describe('eliminarProducto', () => {
  it('quita el producto de la lista', () => {
    const resultado = eliminarProducto(productos, 'MS001')

    expect(resultado.productos).toEqual([productos[1]])
    expect(resultado.producto).toBe(productos[0])
    expect(productos).toHaveLength(2)
  })

  it('avisa si el producto no existe', () => {
    expect(eliminarProducto(productos, 'NO999').error).toBe('El producto no existe.')
  })
})

describe('crearCategoria', () => {
  it('agrega la categoría sin espacios sobrantes', () => {
    const resultado = crearCategoria(categorias, '  Teclados ')

    expect(resultado.categorias).toEqual(['Mouse', 'Accesorios', 'Teclados'])
    expect(categorias).toHaveLength(2)
  })

  it('rechaza nombres vacíos o repetidos', () => {
    expect(crearCategoria(categorias, '   ').error).toBe(
      'El nombre de la categoría es obligatorio.'
    )
    expect(crearCategoria(categorias, 'mouse').error).toBe('Esa categoría ya existe.')
  })
})

describe('renombrarCategoria', () => {
  it('cambia el nombre y actualiza los productos que la usan', () => {
    const resultado = renombrarCategoria(categorias, productos, 'Mouse', 'Ratones')

    expect(resultado.categorias).toEqual(['Ratones', 'Accesorios'])
    expect(resultado.productos[0].categoria).toBe('Ratones')
    expect(resultado.productos[1].categoria).toBe('Accesorios')
    expect(productos[0].categoria).toBe('Mouse')
  })

  it('rechaza categorías inexistentes, nombres vacíos o repetidos', () => {
    expect(renombrarCategoria(categorias, productos, 'Nada', 'X').error).toBe(
      'La categoría no existe.'
    )
    expect(renombrarCategoria(categorias, productos, 'Mouse', ' ').error).toBe(
      'El nombre de la categoría es obligatorio.'
    )
    expect(renombrarCategoria(categorias, productos, 'Mouse', 'accesorios').error).toBe(
      'Esa categoría ya existe.'
    )
  })
})

describe('eliminarCategoria', () => {
  it('elimina una categoría que no tiene productos', () => {
    const resultado = eliminarCategoria([...categorias, 'Vacía'], productos, 'Vacía')

    expect(resultado.categorias).toEqual(categorias)
  })

  it('no elimina una categoría con productos ni una que no existe', () => {
    expect(eliminarCategoria(categorias, productos, 'Mouse').error).toBe(
      'No puedes eliminar una categoría que tiene productos.'
    )
    expect(eliminarCategoria(categorias, productos, 'Nada').error).toBe(
      'La categoría no existe.'
    )
  })
})
