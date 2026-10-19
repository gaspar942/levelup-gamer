import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import CategoriasView from '../views/CategoriasView'
import OfertasView from '../views/OfertasView'
import ProductDetailView from '../views/ProductDetailView'
import ProductsView from '../views/ProductsView'

// Catálogo propio, distinto al de src/data, para comprobar que las vistas leen lo que reciben.
const categorias = ['Nueva']
const productos = [
  {
    codigo: 'ZZ001',
    fabricante: 'Marca Z',
    categoria: 'Nueva',
    nombre: 'Producto Nuevo',
    precio: 1000,
    descripcion: 'Producto que solo existe en este test.',
  },
]

function renderizar(ruta, patron, vista) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path={patron} element={vista} />
      </Routes>
    </MemoryRouter>
  )
}

describe('vistas conectadas al catálogo recibido por props', () => {
  it('ProductsView muestra los productos y las categorías que recibe', () => {
    renderizar(
      '/productos',
      '/productos',
      <ProductsView productos={productos} categorias={categorias} onAgregar={vi.fn()} />
    )

    expect(screen.getByText('Producto Nuevo')).toBeInTheDocument()
    expect(screen.getByText('1 producto(s) encontrado(s)')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Nueva' })).toBeInTheDocument()
    expect(screen.queryByText('Catan')).not.toBeInTheDocument()
  })

  it('CategoriasView muestra los productos de la categoría que recibe', () => {
    renderizar(
      '/categorias/Nueva',
      '/categorias/:nombre?',
      <CategoriasView productos={productos} categorias={categorias} onAgregar={vi.fn()} />
    )

    expect(screen.getByRole('heading', { name: 'Nueva' })).toBeInTheDocument()
    expect(screen.getByText('Producto Nuevo')).toBeInTheDocument()
  })

  it('OfertasView usa los productos que recibe', () => {
    const enOferta = [{ ...productos[0], codigo: 'JM001', nombre: 'Solo Catan' }]

    renderizar('/ofertas', '/ofertas', <OfertasView productos={enOferta} onAgregar={vi.fn()} />)

    expect(screen.getByText('Solo Catan')).toBeInTheDocument()
    expect(screen.getByText('1 producto(s) en oferta')).toBeInTheDocument()
  })

  it('ProductDetailView busca el producto en el catálogo que recibe', () => {
    renderizar(
      '/producto/ZZ001',
      '/producto/:codigo',
      <ProductDetailView productos={productos} onAgregar={vi.fn()} />
    )

    expect(screen.getByRole('heading', { name: 'Producto Nuevo' })).toBeInTheDocument()
    expect(screen.getByText('Fabricante: Marca Z')).toBeInTheDocument()
  })
})
