import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import CartView from '../views/CartView'

const carrito = [{ codigo: 'MS001', nombre: 'Mouse Gamer', precio: 10000, cantidad: 1 }]

describe('CartView - botón de pago', () => {
  it('lleva al checkout cuando hay productos', () => {
    render(
      <MemoryRouter>
        <CartView carrito={carrito} onQuitar={vi.fn()} onCambiarCantidad={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText('Ir a pagar')).toHaveAttribute('href', '/checkout')
  })

  it('no muestra el botón de pago con el carrito vacío', () => {
    render(
      <MemoryRouter>
        <CartView carrito={[]} onQuitar={vi.fn()} onCambiarCantidad={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.queryByText('Ir a pagar')).not.toBeInTheDocument()
  })
})
