import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { administrador } from '../data/administrador'
import { guardarCarrito, guardarOrdenes, guardarSesion } from '../utils/almacenamiento'
import { ordenDemo } from './ordenesDemo'

function renderizarApp(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  )
}

describe('App - reporte de productos, buscador y carrito', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('/admin/productos/reportes carga el reporte de productos', () => {
    guardarSesion(administrador.correo)

    renderizarApp('/admin/productos/reportes')

    expect(screen.getByRole('heading', { name: 'Reporte de productos' })).toBeInTheDocument()
  })

  it('el reporte cuenta las ventas pagadas de las órdenes guardadas', () => {
    guardarSesion(administrador.correo)
    guardarOrdenes([ordenDemo({ items: [{ codigo: 'MS001', nombre: 'Mouse G203', precio: 20000, cantidad: 2 }] })])

    renderizarApp('/admin/productos/reportes')

    expect(screen.getByText(`$${(40000).toLocaleString('es-CL')}`)).toBeInTheDocument()
  })

  it('desde el menú lateral se llega al reporte de productos', async () => {
    const usuario = userEvent.setup()
    guardarSesion(administrador.correo)

    renderizarApp('/admin')

    await usuario.click(screen.getByRole('link', { name: 'Reporte de productos' }))

    expect(screen.getByRole('heading', { name: 'Reporte de productos' })).toBeInTheDocument()
  })

  it('el buscador de la barra deja el texto en el filtro del catálogo', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/')

    await usuario.type(screen.getByLabelText('Buscar en la tienda'), 'Catan')
    await usuario.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar')).toHaveValue('Catan')
  })

  it('el monto de la barra sale del carrito guardado', () => {
    guardarCarrito([{ codigo: 'ZZ001', nombre: 'Demo', precio: 1500, cantidad: 2 }])

    renderizarApp('/')

    expect(screen.getByText(`$${(3000).toLocaleString('es-CL')}`)).toBeInTheDocument()
  })
})
