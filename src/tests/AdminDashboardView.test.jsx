import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AdminDashboardView from '../views/admin/AdminDashboardView'

const productos = [{ codigo: 'A1' }, { codigo: 'A2' }, { codigo: 'A3' }]
const usuarios = [{ correo: 'ana@duocuc.cl' }]
const ordenes = [{ estado: 'pagada' }, { estado: 'pagada' }, { estado: 'rechazada' }]

function renderizar(props) {
  render(
    <MemoryRouter>
      <AdminDashboardView {...props} />
    </MemoryRouter>
  )
}

describe('AdminDashboardView', () => {
  it('cuenta las compras pagadas, los productos y los usuarios', () => {
    renderizar({ productos, usuarios, ordenes })

    expect(within(screen.getByRole('group', { name: 'Compras' })).getByText('2')).toBeInTheDocument()
    expect(within(screen.getByRole('group', { name: 'Productos' })).getByText('3')).toBeInTheDocument()
    expect(within(screen.getByRole('group', { name: 'Usuarios' })).getByText('1')).toBeInTheDocument()
  })

  it('sin datos muestra todo en cero', () => {
    renderizar({})

    expect(within(screen.getByRole('group', { name: 'Compras' })).getByText('0')).toBeInTheDocument()
    expect(within(screen.getByRole('group', { name: 'Productos' })).getByText('0')).toBeInTheDocument()
  })

  it('tiene accesos a la administración de productos y categorías', () => {
    renderizar({ productos, usuarios, ordenes })

    expect(screen.getByText('Administrar productos')).toHaveAttribute('href', '/admin/productos')
    expect(screen.getByText('Administrar categorías')).toHaveAttribute('href', '/admin/categorias')
  })
})
