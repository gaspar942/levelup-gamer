import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { administrador } from '../data/administrador'
import AdminLayout from '../views/admin/AdminLayout'

function renderizar(usuario, onCerrarSesion = vi.fn()) {
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={<AdminLayout usuario={usuario} onCerrarSesion={onCerrarSesion} />}
        >
          <Route index element={<p>Contenido interno</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

  return onCerrarSesion
}

describe('AdminLayout', () => {
  it('sin ser administrador solo muestra el aviso y el enlace al login', () => {
    renderizar({ nombre: 'Ana', correo: 'ana@duocuc.cl' })

    expect(screen.getByText(/solo para administradores/)).toBeInTheDocument()
    expect(screen.getByText('Inicia sesión')).toHaveAttribute('href', '/login')
    expect(screen.queryByText('Contenido interno')).not.toBeInTheDocument()
  })

  it('sin sesión también muestra el aviso', () => {
    renderizar(null)

    expect(screen.getByText(/solo para administradores/)).toBeInTheDocument()
  })

  it('el administrador ve el menú lateral y la sección elegida', () => {
    renderizar(administrador)

    expect(screen.getByText('Contenido interno')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute(
      'href',
      '/admin/productos'
    )
    expect(screen.getByRole('link', { name: 'Categorías' })).toHaveAttribute(
      'href',
      '/admin/categorias'
    )
    expect(screen.getByRole('link', { name: 'Tienda' })).toHaveAttribute('href', '/')
  })

  it('el botón de cerrar sesión llama a onCerrarSesion', async () => {
    const usuario = userEvent.setup()
    const onCerrarSesion = renderizar(administrador)

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(onCerrarSesion).toHaveBeenCalledTimes(1)
  })
})
