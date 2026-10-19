import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AdminProductosView from '../views/admin/AdminProductosView'

const productos = [
  {
    codigo: 'MS001',
    categoria: 'Mouse',
    nombre: 'Mouse G203',
    precio: 20000,
    descripcion: 'Mouse gamer.',
  },
  {
    codigo: 'AC001',
    categoria: 'Accesorios',
    nombre: 'Auriculares Cloud',
    precio: 50000,
    descripcion: 'Con micrófono.',
  },
]

function renderizar(onEliminar = vi.fn(() => ({ producto: productos[0] }))) {
  render(
    <MemoryRouter>
      <AdminProductosView productos={productos} onEliminar={onEliminar} />
    </MemoryRouter>
  )

  return onEliminar
}

describe('AdminProductosView', () => {
  afterEach(() => vi.restoreAllMocks())

  it('lista los productos con su código, categoría y precio', () => {
    renderizar()

    expect(screen.getByText('2 producto(s)')).toBeInTheDocument()
    expect(screen.getByText('MS001')).toBeInTheDocument()
    expect(screen.getByText('Auriculares Cloud')).toBeInTheDocument()
    expect(screen.getByText(`$${(50000).toLocaleString('es-CL')}`)).toBeInTheDocument()
  })

  it('tiene un acceso para crear un producto y uno para editar cada uno', () => {
    renderizar()

    expect(screen.getByText('Nuevo producto')).toHaveAttribute('href', '/admin/productos/nuevo')
    expect(screen.getByRole('button', { name: 'Editar Mouse G203' })).toHaveAttribute(
      'href',
      '/admin/productos/MS001'
    )
  })

  it('filtra la lista al buscar', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.type(screen.getByLabelText('Buscar producto'), 'mouse')

    expect(screen.getByText('1 producto(s)')).toBeInTheDocument()
    expect(screen.queryByText('Auriculares Cloud')).not.toBeInTheDocument()
  })

  it('avisa si la búsqueda no encuentra nada', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.type(screen.getByLabelText('Buscar producto'), 'zzzz')

    expect(screen.getByText('No hay productos que coincidan con la búsqueda.')).toBeInTheDocument()
  })

  it('elimina el producto cuando se confirma', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const onEliminar = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Mouse G203' }))

    expect(onEliminar).toHaveBeenCalledWith('MS001')
    expect(screen.getByRole('alert')).toHaveTextContent('Producto MS001 eliminado.')
  })

  it('no elimina nada si se cancela la confirmación', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const onEliminar = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Mouse G203' }))

    expect(onEliminar).not.toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('muestra el error si no se pudo eliminar', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderizar(vi.fn(() => ({ error: 'El producto no existe.' })))

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Mouse G203' }))

    expect(screen.getByRole('alert')).toHaveTextContent('El producto no existe.')
  })
})
