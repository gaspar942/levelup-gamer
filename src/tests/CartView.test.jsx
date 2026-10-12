import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import CartView from '../views/CartView'

const carrito = [
  { codigo: 'CO001', nombre: 'PlayStation 5', precio: 100000, cantidad: 1 },
]

function mostrar(descuento) {
  render(
    <MemoryRouter>
      <CartView
        carrito={carrito}
        descuento={descuento}
        onQuitar={() => {}}
        onCambiarCantidad={() => {}}
      />
    </MemoryRouter>
  )
}

test('muestra la línea de descuento Duoc cuando el usuario lo tiene', () => {
  mostrar(0.2)
  expect(screen.getByText(/Descuento Duoc \(20%\)/)).toBeInTheDocument()
})

test('no muestra descuento si el usuario no lo tiene', () => {
  mostrar(0)
  expect(screen.queryByText(/Descuento Duoc/)).not.toBeInTheDocument()
})
