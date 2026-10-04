import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, test } from 'vitest'
import ProductDetailView from '../views/ProductDetailView'

function mostrar(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route
          path="/producto/:codigo"
          element={<ProductDetailView onAgregar={() => {}} />}
        />
      </Routes>
    </MemoryRouter>
  )
}

test('muestra el producto y su fabricante', () => {
  mostrar('/producto/CO001')
  expect(screen.getByText('PlayStation 5')).toBeInTheDocument()
  expect(screen.getByText(/Sony Interactive Entertainment/)).toBeInTheDocument()
})

test('avisa cuando el producto no existe', () => {
  mostrar('/producto/XXX')
  expect(screen.getByText(/No encontramos el producto XXX/)).toBeInTheDocument()
})
