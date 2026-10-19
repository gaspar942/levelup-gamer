import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { administrador } from '../data/administrador'
import { categorias as categoriasBase } from '../data/categorias'
import { productos as productosBase } from '../data/productos'
import {
  guardarSesion,
  guardarUsuarios,
  leerCategorias,
  leerProductos,
} from '../utils/almacenamiento'

function renderizarApp(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  )
}

describe('App - panel de administrador', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('sin sesión el panel muestra el aviso de acceso', () => {
    renderizarApp('/admin')

    expect(screen.getByText(/solo para administradores/)).toBeInTheDocument()
  })

  it('un usuario común no entra al panel', () => {
    guardarUsuarios([{ nombre: 'Ana', correo: 'ana@duocuc.cl', contrasena: 'abc123' }])
    guardarSesion('ana@duocuc.cl')

    renderizarApp('/admin')

    expect(screen.getByText(/solo para administradores/)).toBeInTheDocument()
  })

  it('con la sesión del administrador muestra el dashboard', () => {
    guardarSesion(administrador.correo)

    renderizarApp('/admin')

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('crea un producto desde el panel y queda guardado', async () => {
    const usuario = userEvent.setup()
    guardarSesion(administrador.correo)

    renderizarApp('/admin/productos/nuevo')

    await usuario.type(screen.getByLabelText('Código'), 'zz100')
    await usuario.type(screen.getByLabelText('Nombre'), 'Producto Demo')
    await usuario.type(screen.getByLabelText(/^Precio/), '12345')
    await usuario.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument()
    expect(screen.getByText('Producto Demo')).toBeInTheDocument()
    expect(leerProductos()).toHaveLength(productosBase.length + 1)
  })

  it('no deja crear un producto con un código repetido', async () => {
    const usuario = userEvent.setup()
    guardarSesion(administrador.correo)

    renderizarApp('/admin/productos/nuevo')

    await usuario.type(screen.getByLabelText('Código'), productosBase[0].codigo)
    await usuario.type(screen.getByLabelText('Nombre'), 'Otro producto')
    await usuario.type(screen.getByLabelText(/^Precio/), '5000')
    await usuario.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ya existe un producto con ese código.')
    expect(leerProductos()).toBeNull()
  })

  it('elimina un producto desde el listado y queda guardado', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    guardarSesion(administrador.correo)

    renderizarApp('/admin/productos')

    await usuario.click(
      screen.getByRole('button', { name: `Eliminar ${productosBase[0].nombre}` })
    )

    expect(
      screen.queryByRole('button', { name: `Eliminar ${productosBase[0].nombre}` })
    ).not.toBeInTheDocument()
    expect(leerProductos()).toHaveLength(productosBase.length - 1)
  })

  it('crea una categoría desde el panel y queda guardada', async () => {
    const usuario = userEvent.setup()
    guardarSesion(administrador.correo)

    renderizarApp('/admin/categorias')

    await usuario.type(screen.getByLabelText('Nueva categoría'), 'Teclados')
    await usuario.click(screen.getByRole('button', { name: 'Agregar categoría' }))

    expect(screen.getByText('Teclados')).toBeInTheDocument()
    expect(leerCategorias()).toEqual([...categoriasBase, 'Teclados'])
  })
})
