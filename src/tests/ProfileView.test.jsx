import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, test } from 'vitest'
import ProfileView from '../views/ProfileView'

const usuario = {
  nombre: 'Ana',
  correo: 'ana@duocuc.cl',
  descuento: 0.2,
  puntos: 250,
  codigoPropio: 'LVL0001',
}

function mostrar(usuarioActual) {
  render(
    <MemoryRouter initialEntries={['/perfil']}>
      <Routes>
        <Route
          path="/perfil"
          element={<ProfileView usuario={usuarioActual} onCerrarSesion={() => {}} />}
        />
        <Route path="/login" element={<p>Pantalla de login</p>} />
      </Routes>
    </MemoryRouter>
  )
}

test('muestra puntos, nivel y código del usuario', () => {
  mostrar(usuario)
  expect(screen.getByText('250')).toBeInTheDocument()
  expect(screen.getByText(/Nivel: Plata/)).toBeInTheDocument()
  expect(screen.getByText('LVL0001')).toBeInTheDocument()
})

test('redirige al login si no hay sesión', () => {
  mostrar(null)
  expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
})
