import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import ProductCard from '../components/ProductCard'

const producto = {
  codigo: 'JM001',
  categoria: 'Juegos de Mesa',
  nombre: 'Catan',
  precio: 29990,
  descripcion: 'Juego de estrategia.',
}

function mostrar(onAgregar) {
  render(
    <MemoryRouter>
      <ProductCard producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>
  )
}

test('muestra el nombre y la categoría del producto', () => {
  mostrar()
  expect(screen.getByText('Catan')).toBeInTheDocument()
  expect(screen.getByText('Juegos de Mesa')).toBeInTheDocument()
})

test('el enlace de detalle apunta a la ruta del producto', () => {
  mostrar()
  expect(screen.getByRole('button', { name: /ver detalle/i })).toHaveAttribute(
    'href',
    '/producto/JM001'
  )
})

test('llama a onAgregar con el producto al presionar el botón', async () => {
  const user = userEvent.setup()
  const onAgregar = vi.fn()
  mostrar(onAgregar)

  await user.click(screen.getByRole('button', { name: /agregar al carrito/i }))

  expect(onAgregar).toHaveBeenCalledWith(producto)
})
