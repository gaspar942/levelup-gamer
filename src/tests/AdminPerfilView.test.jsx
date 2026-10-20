import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { administrador } from '../data/administrador'
import AdminPerfilView from '../views/admin/AdminPerfilView'

describe('AdminPerfilView', () => {
  it('muestra el nombre, el correo y el rol del administrador', () => {
    render(<AdminPerfilView usuario={administrador} />)

    expect(screen.getByRole('heading', { name: 'Perfil' })).toBeInTheDocument()
    expect(screen.getByText('Administrador')).toBeInTheDocument()
    expect(screen.getByText('admin@levelup.cl')).toBeInTheDocument()
    expect(screen.getByText('Rol: Administrador del sistema')).toBeInTheDocument()
  })

  it('sin sesión muestra un aviso', () => {
    render(<AdminPerfilView />)

    expect(screen.getByText('No hay una sesión activa.')).toBeInTheDocument()
  })
})
