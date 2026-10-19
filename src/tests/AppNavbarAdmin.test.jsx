import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AppNavbar from '../components/AppNavbar'
import { administrador } from '../data/administrador'

const usuarioComun = { nombre: 'Ana', correo: 'ana@duocuc.cl', rol: undefined }

function renderizar(usuario) {
  render(
    <MemoryRouter>
      <AppNavbar usuario={usuario} />
    </MemoryRouter>
  )
}

describe('AppNavbar y el panel de administración', () => {
  it('el administrador ve el enlace a la administración', () => {
    renderizar(administrador)

    expect(screen.getByText('Administración')).toHaveAttribute('href', '/admin')
  })

  it('un usuario común y una visita no lo ven', () => {
    renderizar(usuarioComun)
    expect(screen.queryByText('Administración')).not.toBeInTheDocument()
  })

  it('sin sesión tampoco aparece', () => {
    renderizar(null)
    expect(screen.queryByText('Administración')).not.toBeInTheDocument()
  })
})
