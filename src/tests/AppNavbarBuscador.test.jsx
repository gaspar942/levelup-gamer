import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AppNavbar from '../components/AppNavbar'

function Ubicacion() {
  const { pathname, search } = useLocation()

  return <p data-testid="ubicacion">{`${pathname}${search}`}</p>
}

function renderizar(props = {}) {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <AppNavbar {...props} />
              <Ubicacion />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('AppNavbar - buscador y monto del carrito', () => {
  it('muestra el monto del carrito junto a la cantidad', () => {
    renderizar({ cantidadCarrito: 2, totalCarrito: 59980 })

    expect(screen.getByText(`$${(59980).toLocaleString('es-CL')}`)).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('con el carrito vacío el monto es $0', () => {
    renderizar()

    expect(screen.getByText('$0')).toBeInTheDocument()
  })

  it('buscar lleva al catálogo con el texto en el parámetro q', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.type(screen.getByLabelText('Buscar en la tienda'), 'mouse')
    await usuario.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByTestId('ubicacion')).toHaveTextContent('/productos?q=mouse')
  })

  it('buscar con Enter también funciona y recorta los espacios', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.type(screen.getByLabelText('Buscar en la tienda'), '  mouse  {Enter}')

    expect(screen.getByTestId('ubicacion')).toHaveTextContent('/productos?q=mouse')
  })

  it('buscar sin texto lleva al catálogo completo', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByTestId('ubicacion')).toHaveTextContent(/^\/productos$/)
  })
})
