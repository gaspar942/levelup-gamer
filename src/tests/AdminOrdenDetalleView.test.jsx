import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AdminOrdenDetalleView from '../views/admin/AdminOrdenDetalleView'
import { ordenDemo } from './ordenesDemo'

function renderizar(ruta, ordenes) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route
          path="/admin/ordenes/:numero"
          element={<AdminOrdenDetalleView ordenes={ordenes} />}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminOrdenDetalleView', () => {
  afterEach(() => vi.restoreAllMocks())

  it('muestra la boleta con el cliente, la dirección y los productos', () => {
    renderizar('/admin/ordenes/2026102001', [ordenDemo()])

    expect(screen.getByRole('heading', { name: 'Boleta #2026102001' })).toBeInTheDocument()
    expect(screen.getByText('Pagada')).toBeInTheDocument()
    expect(screen.getByText(/ana@duocuc\.cl/)).toBeInTheDocument()
    expect(screen.getByText('Mouse G203')).toBeInTheDocument()
    expect(screen.getByText(/Los Aromos 123/)).toBeInTheDocument()
  })

  it('una orden rechazada muestra el motivo', () => {
    const orden = ordenDemo({ estado: 'rechazada', motivo: 'El banco rechazó la transacción.' })
    renderizar('/admin/ordenes/2026102001', [orden])

    expect(screen.getByText('Rechazada')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('El banco rechazó la transacción.')
  })

  it('avisa si la orden no existe', () => {
    renderizar('/admin/ordenes/999', [ordenDemo()])

    expect(screen.getByText(/No encontramos la orden 999/)).toBeInTheDocument()
  })

  it('el botón imprimir llama a window.print', async () => {
    const usuario = userEvent.setup()
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {})
    renderizar('/admin/ordenes/2026102001', [ordenDemo()])

    await usuario.click(screen.getByRole('button', { name: 'Imprimir boleta' }))

    expect(imprimir).toHaveBeenCalledTimes(1)
  })
})
