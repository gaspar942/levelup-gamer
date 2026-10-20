import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AdminOrdenesView from '../views/admin/AdminOrdenesView'
import { ordenDemo } from './ordenesDemo'

const ordenes = [
  ordenDemo({ numero: '2026102001' }),
  ordenDemo({
    numero: '2026102002',
    estado: 'rechazada',
    total: 15000,
    cliente: { nombre: 'Luis', apellidos: 'Soto', correo: 'luis@gmail.com' },
  }),
]

function renderizar(lista = ordenes) {
  render(
    <MemoryRouter>
      <AdminOrdenesView ordenes={lista} />
    </MemoryRouter>
  )
}

describe('AdminOrdenesView', () => {
  it('lista las órdenes con su cliente, estado y total', () => {
    renderizar()

    expect(screen.getByText('2 orden(es)')).toBeInTheDocument()
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
    expect(screen.getByText('Luis Soto')).toBeInTheDocument()
    expect(screen.getByText('Pagada')).toBeInTheDocument()
    expect(screen.getByText('Rechazada')).toBeInTheDocument()
    expect(screen.getByText(`$${(15000).toLocaleString('es-CL')}`)).toBeInTheDocument()
  })

  it('cada orden tiene un acceso a su boleta', () => {
    renderizar()

    expect(screen.getByRole('button', { name: 'Ver boleta 2026102002' })).toHaveAttribute(
      'href',
      '/admin/ordenes/2026102002'
    )
  })

  it('filtra por estado', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.selectOptions(screen.getByLabelText('Filtrar por estado'), 'rechazada')

    expect(screen.getByText('1 orden(es)')).toBeInTheDocument()
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument()
    expect(screen.getByText('Luis Soto')).toBeInTheDocument()
  })

  it('avisa si no hay órdenes', () => {
    renderizar([])

    expect(screen.getByText('No hay órdenes para mostrar.')).toBeInTheDocument()
  })
})
