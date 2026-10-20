import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AdminUsuarioComprasView from '../views/admin/AdminUsuarioComprasView'
import { ordenDemo } from './ordenesDemo'

const usuarios = [
  { nombre: 'Ana', correo: 'ana@duocuc.cl', puntos: 0 },
  { nombre: 'Beto', correo: 'beto@gmail.com', puntos: 0 },
]

const ordenes = [
  ordenDemo({ numero: '2026102001' }),
  ordenDemo({ numero: '2026102002', estado: 'rechazada' }),
  ordenDemo({
    numero: '2026102003',
    cliente: { nombre: 'Otro', apellidos: 'Cliente', correo: 'otro@correo.cl' },
  }),
]

function renderizar(correo) {
  render(
    <MemoryRouter initialEntries={[`/admin/usuarios/${correo}/compras`]}>
      <Routes>
        <Route
          path="/admin/usuarios/:correo/compras"
          element={<AdminUsuarioComprasView usuarios={usuarios} ordenes={ordenes} />}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminUsuarioComprasView', () => {
  it('muestra solo las compras del usuario, con acceso a cada boleta', () => {
    renderizar('ana@duocuc.cl')

    expect(screen.getByRole('heading', { name: 'Historial de compras' })).toBeInTheDocument()
    expect(screen.getByText('2 compra(s)')).toBeInTheDocument()
    expect(screen.getByText('Pagada')).toBeInTheDocument()
    expect(screen.getByText('Rechazada')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver boleta 2026102001' })).toHaveAttribute(
      'href',
      '/admin/ordenes/2026102001'
    )
    expect(screen.queryByRole('button', { name: 'Ver boleta 2026102003' })).not.toBeInTheDocument()
  })

  it('avisa si el usuario no tiene compras', () => {
    renderizar('beto@gmail.com')

    expect(screen.getByText('Este usuario aún no tiene compras.')).toBeInTheDocument()
  })

  it('avisa si el usuario no existe', () => {
    renderizar('nadie@correo.cl')

    expect(screen.getByText(/No encontramos al usuario nadie@correo.cl/)).toBeInTheDocument()
  })
})
