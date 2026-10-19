import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AdminProductoFormView from '../views/admin/AdminProductoFormView'

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
]

function renderizar(ruta, { onCrear = vi.fn(() => ({ producto: {} })), onEditar = vi.fn(() => ({ producto: {} })) } = {}) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos" element={<p>Listado de productos</p>} />
        <Route
          path="/admin/productos/nuevo"
          element={
            <AdminProductoFormView productos={productos} categorias={categorias} onCrear={onCrear} />
          }
        />
        <Route
          path="/admin/productos/:codigo"
          element={
            <AdminProductoFormView productos={productos} categorias={categorias} onEditar={onEditar} />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  return { onCrear, onEditar }
}

describe('AdminProductoFormView - nuevo producto', () => {
  it('muestra el formulario vacío con la primera categoría elegida', () => {
    renderizar('/admin/productos/nuevo')

    expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Código')).toHaveValue('')
    expect(screen.getByLabelText('Categoría')).toHaveValue('Mouse')
  })

  it('actualiza el estado del formulario mientras se escribe', async () => {
    const usuario = userEvent.setup()
    renderizar('/admin/productos/nuevo')

    await usuario.type(screen.getByLabelText('Nombre'), 'Teclado')
    await usuario.selectOptions(screen.getByLabelText('Categoría'), 'Accesorios')

    expect(screen.getByLabelText('Nombre')).toHaveValue('Teclado')
    expect(screen.getByLabelText('Categoría')).toHaveValue('Accesorios')
  })

  it('al enviar entrega los datos a onCrear y vuelve al listado', async () => {
    const usuario = userEvent.setup()
    const { onCrear } = renderizar('/admin/productos/nuevo')

    await usuario.type(screen.getByLabelText('Código'), 'ZZ100')
    await usuario.type(screen.getByLabelText('Nombre'), 'Producto Demo')
    await usuario.type(screen.getByLabelText(/^Precio/), '12345')
    await usuario.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(onCrear).toHaveBeenCalledWith({
      codigo: 'ZZ100',
      nombre: 'Producto Demo',
      categoria: 'Mouse',
      precio: '12345',
      fabricante: '',
      descripcion: '',
    })
    expect(screen.getByText('Listado de productos')).toBeInTheDocument()
  })

  it('muestra el error que devuelve onCrear y no sale del formulario', async () => {
    const usuario = userEvent.setup()
    renderizar('/admin/productos/nuevo', {
      onCrear: vi.fn(() => ({ error: 'Ya existe un producto con ese código.' })),
    })

    await usuario.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ya existe un producto con ese código.')
    expect(screen.queryByText('Listado de productos')).not.toBeInTheDocument()
  })
})

describe('AdminProductoFormView - editar producto', () => {
  it('carga los datos del producto y no deja cambiar el código', () => {
    renderizar('/admin/productos/MS001')

    expect(screen.getByRole('heading', { name: 'Editar producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Código')).toBeDisabled()
    expect(screen.getByLabelText('Código')).toHaveValue('MS001')
    expect(screen.getByLabelText('Nombre')).toHaveValue('Mouse G203')
    expect(screen.getByLabelText(/^Precio/)).toHaveValue(20000)
  })

  it('al guardar entrega el código y los datos cambiados a onEditar', async () => {
    const usuario = userEvent.setup()
    const { onEditar } = renderizar('/admin/productos/MS001')

    await usuario.clear(screen.getByLabelText('Nombre'))
    await usuario.type(screen.getByLabelText('Nombre'), 'Mouse G304')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(onEditar).toHaveBeenCalledWith(
      'MS001',
      expect.objectContaining({ nombre: 'Mouse G304' })
    )
    expect(screen.getByText('Listado de productos')).toBeInTheDocument()
  })

  it('avisa si el producto no existe', () => {
    renderizar('/admin/productos/NO999')

    expect(screen.getByText(/No encontramos el producto NO999/)).toBeInTheDocument()
    expect(screen.getByText('Volver al listado')).toHaveAttribute('href', '/admin/productos')
  })
})
