import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import OrdenItems from '../components/OrdenItems'
import ProductCard from '../components/ProductCard'
import CartView from '../views/CartView'
import ProductDetailView from '../views/ProductDetailView'

const producto = {
  codigo: 'MS001',
  categoria: 'Mouse',
  nombre: 'Mouse G203',
  precio: 20000,
  descripcion: 'Mouse de prueba.',
}

describe('fotos de los productos en las vistas', () => {
  it('la tarjeta del producto muestra su foto', () => {
    render(
      <MemoryRouter>
        <ProductCard producto={producto} />
      </MemoryRouter>
    )

    expect(screen.getByAltText('Mouse G203')).toHaveAttribute('src', '/img/MS001.jpg')
  })

  it('el detalle del producto muestra su foto', () => {
    render(
      <MemoryRouter initialEntries={['/producto/MS001']}>
        <Routes>
          <Route
            path="/producto/:codigo"
            element={<ProductDetailView productos={[producto]} onAgregar={vi.fn()} />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByAltText('Mouse G203')).toHaveAttribute('src', '/img/MS001.jpg')
    expect(screen.getByRole('heading', { name: 'Mouse G203' })).toBeInTheDocument()
  })

  it('el carrito muestra la miniatura junto al nombre', () => {
    const carrito = [{ ...producto, cantidad: 2 }]

    const { container } = render(
      <MemoryRouter>
        <CartView carrito={carrito} onQuitar={vi.fn()} onCambiarCantidad={vi.fn()} />
      </MemoryRouter>
    )

    expect(container.querySelector('img[src="/img/MS001.jpg"]')).toBeInTheDocument()
    expect(screen.getByText('Mouse G203')).toBeInTheDocument()
  })

  it('el resumen de una compra muestra la miniatura de cada producto', () => {
    const items = [
      { codigo: 'MS001', nombre: 'Mouse G203', precio: 20000, cantidad: 2 },
      { codigo: 'AC001', nombre: 'Control Xbox', precio: 59990, cantidad: 1 },
    ]

    const { container } = render(<OrdenItems items={items} />)

    expect(container.querySelectorAll('img')).toHaveLength(2)
    expect(container.querySelector('img[src="/img/AC001.jpg"]')).toBeInTheDocument()
    expect(screen.getByText('Control Xbox')).toBeInTheDocument()
  })
})
