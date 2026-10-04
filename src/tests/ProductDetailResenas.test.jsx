import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, test } from 'vitest'
import ProductDetailView from '../views/ProductDetailView'

function mostrar(props) {
  render(
    <MemoryRouter initialEntries={['/producto/JM001']}>
      <Routes>
        <Route
          path="/producto/:codigo"
          element={<ProductDetailView onAgregar={() => {}} {...props} />}
        />
      </Routes>
    </MemoryRouter>
  )
}

test('sin sesión pide iniciar sesión para reseñar', () => {
  mostrar({})
  expect(screen.getByText(/aún no hay reseñas/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /inicia sesión/i })).toBeInTheDocument()
})

test('muestra el promedio y el formulario cuando hay sesión', () => {
  mostrar({
    usuario: { nombre: 'Ana', correo: 'ana@duocuc.cl' },
    resenas: [
      { codigo: 'JM001', correo: 'b@x.cl', autor: 'Beto', puntuacion: 4, comentario: 'Muy bueno', fecha: '2026-10-03' },
    ],
  })
  expect(screen.getByText('4 / 5')).toBeInTheDocument()
  expect(screen.getByText('Beto')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /publicar reseña/i })).toBeInTheDocument()
})
