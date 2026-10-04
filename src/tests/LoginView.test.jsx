import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import LoginView from '../views/LoginView'

function mostrar(onIniciarSesion) {
  render(
    <MemoryRouter>
      <LoginView onIniciarSesion={onIniciarSesion} />
    </MemoryRouter>
  )
  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: 'ana@duocuc.cl' },
  })
  fireEvent.change(screen.getByLabelText(/contraseña/i), {
    target: { value: 'secreta1' },
  })
  fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))
}

test('muestra un error si las credenciales no coinciden', () => {
  mostrar(vi.fn(() => false))
  expect(screen.getByText(/incorrectos/i)).toBeInTheDocument()
})

test('envía el correo y la contraseña escritos', () => {
  const onIniciarSesion = vi.fn(() => true)
  mostrar(onIniciarSesion)
  expect(onIniciarSesion).toHaveBeenCalledWith('ana@duocuc.cl', 'secreta1')
})
