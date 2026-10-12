import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, test } from 'vitest'
import App from '../App'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

function mostrar(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  )
}

test('la ruta /productos muestra el catálogo', () => {
  mostrar('/productos')
  expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument()
})

test('la ruta /blog muestra el blog', () => {
  mostrar('/blog')
  expect(screen.getByRole('heading', { name: 'Blog' })).toBeInTheDocument()
})

test('la ruta /carrito parte vacía', () => {
  mostrar('/carrito')
  expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
})

test('/perfil sin sesión redirige al login', () => {
  mostrar('/perfil')
  expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
})

test('agregar un producto actualiza el contador y guarda el carrito', () => {
  mostrar('/productos')

  fireEvent.click(screen.getAllByRole('button', { name: /agregar al carrito/i })[0])

  expect(screen.getByText('1')).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem('levelup_carrito'))).toHaveLength(1)
})

test('flujo completo: registrarse, iniciar sesión y cerrar sesión', () => {
  mostrar('/registro')

  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } })
  fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'ana@duocuc.cl' } })
  fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
    target: { value: '2000-01-01' },
  })
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'secreta1' } })
  fireEvent.click(screen.getByRole('button', { name: /registrarme/i }))

  expect(screen.getByText(/Cuenta creada para Ana/)).toBeInTheDocument()

  fireEvent.click(screen.getByText('Ingresar'))
  fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'ana@duocuc.cl' } })
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'secreta1' } })
  fireEvent.click(document.querySelector('button[type="submit"]'))

  expect(screen.getByRole('heading', { name: 'Mi perfil' })).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }))

  expect(screen.getByText(/Desafía tus límites/)).toBeInTheDocument()
})
