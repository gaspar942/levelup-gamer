import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import RegisterView from '../views/RegisterView'

test('muestra el error de edad si el usuario es menor de 18 años', () => {
  const onRegistrar = vi.fn()
  render(<RegisterView onRegistrar={onRegistrar} />)

  fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
    target: { value: '2015-01-01' },
  })
  fireEvent.click(screen.getByRole('button', { name: /registrarme/i }))

  expect(screen.getByText(/mayor de 18 años/i)).toBeInTheDocument()
  expect(onRegistrar).not.toHaveBeenCalled()
})

test('confirma el descuento con un correo Duoc válido', () => {
  const onRegistrar = vi.fn(() => ({ usuario: { nombre: 'Ana', descuento: 0.2 } }))
  render(<RegisterView onRegistrar={onRegistrar} />)

  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } })
  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: 'ana@duocuc.cl' },
  })
  fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
    target: { value: '2000-01-01' },
  })
  fireEvent.change(screen.getByLabelText(/contraseña/i), {
    target: { value: 'secreta1' },
  })
  fireEvent.click(screen.getByRole('button', { name: /registrarme/i }))

  expect(onRegistrar).toHaveBeenCalled()
  expect(screen.getByText(/20% de descuento de por vida/i)).toBeInTheDocument()
})

test('muestra el error que devuelve el registro', () => {
  const onRegistrar = vi.fn(() => ({ error: 'Ese correo ya está registrado.' }))
  render(<RegisterView onRegistrar={onRegistrar} />)

  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } })
  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: 'ana@duocuc.cl' },
  })
  fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
    target: { value: '2000-01-01' },
  })
  fireEvent.change(screen.getByLabelText(/contraseña/i), {
    target: { value: 'secreta1' },
  })
  fireEvent.click(screen.getByRole('button', { name: /registrarme/i }))

  expect(screen.getByText(/ya está registrado/i)).toBeInTheDocument()
})
