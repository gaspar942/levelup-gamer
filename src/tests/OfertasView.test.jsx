import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ofertas } from '../data/ofertas'
import { productos } from '../data/productos'
import OfertasView from '../views/OfertasView'

const enOferta = productos.filter((producto) => ofertas[producto.codigo])
const sinOferta = productos.filter((producto) => !ofertas[producto.codigo])

function renderizar(onAgregar = vi.fn()) {
  render(
    <MemoryRouter>
      <OfertasView onAgregar={onAgregar} />
    </MemoryRouter>
  )

  return onAgregar
}

describe('OfertasView', () => {
  it('muestra cuántos productos están en oferta', () => {
    renderizar()

    expect(screen.getByText(`${enOferta.length} producto(s) en oferta`)).toBeInTheDocument()
  })

  it('muestra los productos en oferta y oculta el resto', () => {
    renderizar()

    enOferta.forEach((producto) => {
      expect(screen.getByText(producto.nombre)).toBeInTheDocument()
    })

    expect(screen.queryByText(sinOferta[0].nombre)).not.toBeInTheDocument()
  })

  it('cada producto muestra su porcentaje de descuento', () => {
    renderizar()

    expect(screen.getAllByText(/^-\d+%$/)).toHaveLength(enOferta.length)
  })

  it('pasa el producto elegido a onAgregar', async () => {
    const usuario = userEvent.setup()
    const onAgregar = renderizar()

    await usuario.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])

    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar.mock.calls[0][0].codigo).toBe(enOferta[0].codigo)
  })
})
