import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ofertas } from '../data/ofertas'
import { productos } from '../data/productos'
import ProductDetailView from '../views/ProductDetailView'

const conOferta = productos.find((item) => item.codigo === 'JM001')
const sinOferta = productos.find((item) => !ofertas[item.codigo])

function renderizar(codigo, onAgregar = vi.fn()) {
  render(
    <MemoryRouter initialEntries={[`/producto/${codigo}`]}>
      <Routes>
        <Route
          path="/producto/:codigo"
          element={<ProductDetailView onAgregar={onAgregar} />}
        />
      </Routes>
    </MemoryRouter>
  )

  return onAgregar
}

describe('ProductDetailView con oferta', () => {
  it('muestra el precio original tachado, el porcentaje y el precio rebajado', () => {
    renderizar(conOferta.codigo)

    const porcentaje = ofertas[conOferta.codigo]
    const rebajado = Math.round((conOferta.precio * (100 - porcentaje)) / 100)

    expect(screen.getByText(`$${conOferta.precio.toLocaleString('es-CL')}`).tagName).toBe('S')
    expect(screen.getByText(`-${porcentaje}%`)).toBeInTheDocument()
    expect(screen.getByText(`$${rebajado.toLocaleString('es-CL')} CLP`)).toBeInTheDocument()
  })

  it('un producto sin oferta muestra solo su precio normal', () => {
    renderizar(sinOferta.codigo)

    expect(screen.getByText(`$${sinOferta.precio.toLocaleString('es-CL')} CLP`)).toBeInTheDocument()
    expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument()
  })

  it('al agregar entrega el producto original, sin precio rebajado', async () => {
    const usuario = userEvent.setup()
    const onAgregar = renderizar(conOferta.codigo)

    await usuario.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(onAgregar).toHaveBeenCalledWith(conOferta)
  })
})
