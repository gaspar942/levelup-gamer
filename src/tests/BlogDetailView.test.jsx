import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { articulos } from '../data/articulos'
import BlogDetailView from '../views/BlogDetailView'
import BlogView from '../views/BlogView'

function renderizar(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/blog" element={<BlogView />} />
        <Route path="/blog/:id" element={<BlogDetailView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('BlogDetailView', () => {
  it('muestra el artículo completo', () => {
    const articulo = articulos[0]
    renderizar(`/blog/${articulo.id}`)

    expect(screen.getByRole('heading', { name: articulo.titulo })).toBeInTheDocument()
    expect(screen.getByText(articulo.contenido)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al blog' })).toHaveAttribute('href', '/blog')
  })

  it('avisa si el artículo no existe', () => {
    renderizar('/blog/999')

    expect(screen.getByText(/No encontramos ese artículo/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al blog' })).toBeInTheDocument()
  })

  it('el listado del blog enlaza a cada artículo', () => {
    renderizar('/blog')

    articulos.forEach((articulo) => {
      expect(
        screen.getByRole('link', { name: `Leer artículo: ${articulo.titulo}` })
      ).toHaveAttribute('href', `/blog/${articulo.id}`)
    })
  })
})
