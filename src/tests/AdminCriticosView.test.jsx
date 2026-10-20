import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AdminCriticosView from '../views/admin/AdminCriticosView'

function renderizar(productos) {
  render(
    <MemoryRouter>
      <AdminCriticosView productos={productos} />
    </MemoryRouter>
  )
}

describe('AdminCriticosView', () => {
  it('lista solo los productos con stock crítico y marca los agotados', () => {
    renderizar([
      { codigo: 'T1', nombre: 'Mouse G203', stock: 3 },
      { codigo: 'T2', nombre: 'Auriculares Cloud', stock: 20 },
      { codigo: 'T3', nombre: 'Teclado K1', stock: 0 },
    ])

    expect(screen.getByText('2 producto(s) con stock crítico')).toBeInTheDocument()
    expect(screen.getByText('Mouse G203')).toBeInTheDocument()
    expect(screen.getByText('Teclado K1')).toBeInTheDocument()
    expect(screen.queryByText('Auriculares Cloud')).not.toBeInTheDocument()
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })

  it('cada producto tiene un acceso para editarlo', () => {
    renderizar([{ codigo: 'T1', nombre: 'Mouse G203', stock: 3 }])

    expect(screen.getByRole('button', { name: 'Editar Mouse G203' })).toHaveAttribute(
      'href',
      '/admin/productos/T1'
    )
  })

  it('avisa si no hay productos críticos', () => {
    renderizar([{ codigo: 'T2', nombre: 'Auriculares Cloud', stock: 20 }])

    expect(screen.getByText('No hay productos con stock crítico.')).toBeInTheDocument()
  })
})
