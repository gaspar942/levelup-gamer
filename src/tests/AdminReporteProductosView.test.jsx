import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AdminReporteProductosView from '../views/admin/AdminReporteProductosView'
import { ordenDemo } from './ordenesDemo'

const productos = [
  { codigo: 'MS001', nombre: 'Mouse G203', categoria: 'Mouse', stock: 8 },
  { codigo: 'AC001', nombre: 'Auriculares Cloud', categoria: 'Accesorios', stock: 0 },
  { codigo: 'TC001', nombre: 'Teclado Pro', categoria: 'Teclados', stock: 3 },
  { codigo: 'XX001', nombre: 'Producto sin dato', categoria: 'Otros' },
]

const ordenes = [
  ordenDemo(),
  ordenDemo({ numero: '2026102002', estado: 'rechazada', total: 99999 }),
]

function fila(nombre) {
  return screen.getByText(nombre).closest('tr')
}

describe('AdminReporteProductosView', () => {
  it('muestra el título y la cantidad de productos', () => {
    render(<AdminReporteProductosView ordenes={ordenes} productos={productos} />)

    expect(screen.getByRole('heading', { name: 'Reporte de productos' })).toBeInTheDocument()
    expect(screen.getByText('4 producto(s)')).toBeInTheDocument()
  })

  it('muestra las unidades y el monto vendido de cada producto', () => {
    render(<AdminReporteProductosView ordenes={ordenes} productos={productos} />)

    const mouse = within(fila('Mouse G203'))

    expect(mouse.getByText('2')).toBeInTheDocument()
    expect(mouse.getByText(`$${(40000).toLocaleString('es-CL')}`)).toBeInTheDocument()
    expect(within(fila('Teclado Pro')).getByText('$0')).toBeInTheDocument()
  })

  it('marca el stock: normal, crítico, agotado y sin dato', () => {
    render(<AdminReporteProductosView ordenes={ordenes} productos={productos} />)

    expect(within(fila('Mouse G203')).getByText('8')).toBeInTheDocument()
    expect(within(fila('Teclado Pro')).getByText('3')).toHaveClass('bg-warning')
    expect(within(fila('Auriculares Cloud')).getByText('Sin stock')).toHaveClass('bg-danger')
    expect(within(fila('Producto sin dato')).getByText('Sin dato')).toBeInTheDocument()
  })

  it('sin productos avisa y no muestra la tabla', () => {
    render(<AdminReporteProductosView ordenes={ordenes} productos={[]} />)

    expect(screen.getByText('No hay productos en el catálogo.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
