import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AdminReportesView from '../views/admin/AdminReportesView'
import { ordenDemo } from './ordenesDemo'

const productos = [
  { codigo: 'MS001', categoria: 'Mouse' },
  { codigo: 'AC001', categoria: 'Accesorios' },
]

const ordenes = [
  ordenDemo(),
  ordenDemo({
    numero: '2026102002',
    items: [{ codigo: 'AC001', nombre: 'Auriculares Cloud', precio: 10000, cantidad: 1 }],
    total: 10000,
  }),
  ordenDemo({ numero: '2026102003', estado: 'rechazada', total: 99999 }),
]

describe('AdminReportesView', () => {
  it('muestra las ventas totales y el conteo de órdenes pagadas y rechazadas', () => {
    render(<AdminReportesView ordenes={ordenes} productos={productos} />)

    const total = screen.getByRole('group', { name: 'Ventas totales' })
    expect(within(total).getByText(`$${(50000).toLocaleString('es-CL')}`)).toBeInTheDocument()
    expect(
      within(screen.getByRole('group', { name: 'Órdenes pagadas' })).getByText('2')
    ).toBeInTheDocument()
    expect(
      within(screen.getByRole('group', { name: 'Órdenes rechazadas' })).getByText('1')
    ).toBeInTheDocument()
  })

  it('muestra los productos más vendidos y las ventas por categoría', () => {
    render(<AdminReportesView ordenes={ordenes} productos={productos} />)

    expect(screen.getByRole('heading', { name: 'Productos más vendidos' })).toBeInTheDocument()
    expect(screen.getByText('Mouse G203')).toBeInTheDocument()
    expect(screen.getByText('Auriculares Cloud')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ventas por categoría' })).toBeInTheDocument()
    expect(screen.getByText('Mouse')).toBeInTheDocument()
    expect(screen.getByText('Accesorios')).toBeInTheDocument()
  })

  it('sin ventas pagadas avisa y no muestra las tablas', () => {
    render(<AdminReportesView ordenes={[]} productos={productos} />)

    expect(screen.getByText('Todavía no hay ventas pagadas.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
