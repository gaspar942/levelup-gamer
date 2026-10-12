import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import ProductsView from '../views/ProductsView'

function mostrar() {
  render(
    <MemoryRouter initialEntries={['/productos']}>
      <ProductsView />
    </MemoryRouter>
  )
}

test('muestra los 10 productos al inicio', () => {
  mostrar()
  expect(screen.getByText('10 producto(s) encontrado(s)')).toBeInTheDocument()
})

test('filtra por texto', () => {
  mostrar()
  fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'playstation' } })
  expect(screen.getByText('1 producto(s) encontrado(s)')).toBeInTheDocument()
})

test('filtra por categoría', () => {
  mostrar()
  fireEvent.change(screen.getByLabelText(/categoría/i), { target: { value: 'Consolas' } })
  expect(screen.getByText('1 producto(s) encontrado(s)')).toBeInTheDocument()
})

test('filtra por precio máximo', () => {
  mostrar()
  fireEvent.change(screen.getByLabelText(/precio/i), { target: { value: '30000' } })
  expect(screen.getByText('4 producto(s) encontrado(s)')).toBeInTheDocument()
})

test('avisa si no hay resultados y limpia los filtros', () => {
  mostrar()
  fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'zzzz' } })
  expect(screen.getByText('No encontramos productos con esos filtros.')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: /limpiar filtros/i }))
  expect(screen.getByText('10 producto(s) encontrado(s)')).toBeInTheDocument()
})
