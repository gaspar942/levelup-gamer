import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import ProfileView from '../views/ProfileView'

const usuario = {
  nombre: 'Ana',
  correo: 'ana@duocuc.cl',
  descuento: 0.2,
  puntos: 0,
  codigoPropio: 'LVL0001',
}

function mostrar(onActualizarNombre) {
  render(
    <MemoryRouter>
      <ProfileView
        usuario={usuario}
        onCerrarSesion={() => {}}
        onActualizarNombre={onActualizarNombre}
      />
    </MemoryRouter>
  )
}

test('guarda el nombre nuevo y confirma el cambio', () => {
  const onActualizarNombre = vi.fn()
  mostrar(onActualizarNombre)

  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana María' } })
  fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }))

  expect(onActualizarNombre).toHaveBeenCalledWith('Ana María')
  expect(screen.getByText(/datos actualizados/i)).toBeInTheDocument()
})

test('no guarda un nombre vacío y muestra el error', () => {
  const onActualizarNombre = vi.fn()
  mostrar(onActualizarNombre)

  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: '   ' } })
  fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }))

  expect(onActualizarNombre).not.toHaveBeenCalled()
  expect(screen.getByText(/ingresa un nombre/i)).toBeInTheDocument()
})
