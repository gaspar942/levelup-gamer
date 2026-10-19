import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from '../components/ProductCard'

const conOferta = {
  codigo: 'JM001',
  categoria: 'Juegos de Mesa',
  nombre: 'Catan',
  descripcion: 'Juego de estrategia.',
  precio: 29990,
}

const sinOferta = {
  codigo: 'ZZ999',
  categoria: 'Accesorios',
  nombre: 'Producto sin oferta',
  descripcion: 'Sin descuento.',
  precio: 10000,
}

function renderizar(producto, onAgregar = vi.fn()) {
  render(
    <MemoryRouter>
      <ProductCard producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>
  )

  return onAgregar
}

describe('ProductCard con oferta', () => {
  it('muestra el precio original tachado, el porcentaje y el precio rebajado', () => {
    renderizar(conOferta)

    const rebajado = Math.round((29990 * 85) / 100)

    expect(screen.getByText('$29.990').tagName).toBe('S')
    expect(screen.getByText('-15%')).toBeInTheDocument()
    expect(screen.getByText(`$${rebajado.toLocaleString('es-CL')} CLP`)).toBeInTheDocument()
  })

  it('al agregar entrega el producto original, sin precio rebajado', async () => {
    const usuario = userEvent.setup()
    const onAgregar = renderizar(conOferta)

    await usuario.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(onAgregar).toHaveBeenCalledWith(conOferta)
  })

  it('un producto sin oferta muestra solo su precio normal', () => {
    renderizar(sinOferta)

    expect(screen.getByText('$10.000 CLP')).toBeInTheDocument()
    expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument()
  })
})
