import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import AppNavbar from '../components/AppNavbar'
import { administrador } from '../data/administrador'
import { articulos } from '../data/articulos'
import { guardarOrdenes, guardarSesion, guardarUsuarios, leerUsuarios } from '../utils/almacenamiento'
import { ordenDemo } from './ordenesDemo'

function renderizarApp(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  )
}

describe('App - vistas públicas nuevas', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('el menú tiene los enlaces a Nosotros y Contacto', () => {
    render(
      <MemoryRouter>
        <AppNavbar />
      </MemoryRouter>
    )

    expect(screen.getByText('Nosotros')).toHaveAttribute('href', '/nosotros')
    expect(screen.getByText('Contacto')).toHaveAttribute('href', '/contacto')
  })

  it('/nosotros muestra la vista Nosotros', () => {
    renderizarApp('/nosotros')

    expect(screen.getByRole('heading', { name: 'Nosotros' })).toBeInTheDocument()
  })

  it('/contacto muestra el formulario de contacto', () => {
    renderizarApp('/contacto')

    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeInTheDocument()
  })

  it('/blog/:id muestra el detalle del artículo', () => {
    renderizarApp(`/blog/${articulos[1].id}`)

    expect(screen.getByRole('heading', { name: articulos[1].titulo })).toBeInTheDocument()
  })
})

describe('App - paneles nuevos del administrador', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    guardarSesion(administrador.correo)
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('/admin/ordenes lista las órdenes guardadas', () => {
    guardarOrdenes([ordenDemo()])

    renderizarApp('/admin/ordenes')

    expect(screen.getByRole('heading', { name: 'Órdenes' })).toBeInTheDocument()
    expect(screen.getByText('1 orden(es)')).toBeInTheDocument()
  })

  it('/admin/ordenes/:numero muestra la boleta', () => {
    guardarOrdenes([ordenDemo()])

    renderizarApp('/admin/ordenes/2026102001')

    expect(screen.getByRole('heading', { name: 'Boleta #2026102001' })).toBeInTheDocument()
  })

  it('/admin/productos/criticos muestra los productos con poco stock', () => {
    renderizarApp('/admin/productos/criticos')

    expect(screen.getByRole('heading', { name: 'Productos críticos' })).toBeInTheDocument()
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })

  it('/admin/reportes carga la vista de reportes', () => {
    renderizarApp('/admin/reportes')
    expect(screen.getByRole('heading', { name: 'Reportes' })).toBeInTheDocument()
  })

  it('/admin/perfil muestra los datos del administrador', () => {
    renderizarApp('/admin/perfil')

    expect(screen.getByRole('heading', { name: 'Perfil' })).toBeInTheDocument()
    expect(screen.getByText('admin@levelup.cl')).toBeInTheDocument()
  })

  it('crea un usuario desde el panel y queda guardado', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/admin/usuarios/nuevo')

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Beto' } })
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'beto@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), {
      target: { value: '2000-01-01' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreta1' } })
    await usuario.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByRole('heading', { name: 'Usuarios' })).toBeInTheDocument()
    expect(screen.getByText('beto@gmail.com')).toBeInTheDocument()
    expect(leerUsuarios()).toHaveLength(1)
  })

  it('edita el nombre de un usuario desde el panel y queda guardado', async () => {
    const usuario = userEvent.setup()
    guardarUsuarios([{ nombre: 'Ana', correo: 'ana@duocuc.cl', contrasena: 'abc123', puntos: 0 }])

    renderizarApp('/admin/usuarios/ana@duocuc.cl')

    await usuario.clear(screen.getByLabelText('Nombre'))
    await usuario.type(screen.getByLabelText('Nombre'), 'Ana María')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('Ana María')).toBeInTheDocument()
    expect(leerUsuarios()[0].nombre).toBe('Ana María')
  })

  it('el historial de compras de un usuario sale de las órdenes guardadas', () => {
    guardarUsuarios([{ nombre: 'Ana', correo: 'ana@duocuc.cl', contrasena: 'abc123', puntos: 0 }])
    guardarOrdenes([ordenDemo()])

    renderizarApp('/admin/usuarios/ana@duocuc.cl/compras')

    expect(screen.getByText('1 compra(s)')).toBeInTheDocument()
  })
})
