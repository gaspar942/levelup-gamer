import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { categorias } from '../data/categorias'
import { productos } from '../data/productos'
import CategoriasView from '../views/CategoriasView'

function renderizar(ruta, onAgregar = vi.fn()) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/categorias/:nombre?" element={<CategoriasView onAgregar={onAgregar} />} />
      </Routes>
    </MemoryRouter>
  )

  return onAgregar
}

describe('CategoriasView', () => {
  it('sin categoría elegida muestra todas y pide elegir una', () => {
    renderizar('/categorias')

    // Sin categoría elegida solo hay un botón por categoría, no hay tarjetas de producto.
    expect(screen.getAllByRole('button')).toHaveLength(categorias.length)
    expect(screen.getByText('Juegos de Mesa', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Elige una categoría para ver sus productos.')).toBeInTheDocument()
  })

  it('con una categoría elegida muestra solo sus productos', () => {
    renderizar(`/categorias/${encodeURIComponent('Juegos de Mesa')}`)

    const deLaCategoria = productos.filter((p) => p.categoria === 'Juegos de Mesa')
    const deOtra = productos.find((p) => p.categoria !== 'Juegos de Mesa')

    expect(screen.getByRole('heading', { name: 'Juegos de Mesa' })).toBeInTheDocument()
    deLaCategoria.forEach((producto) => {
      expect(screen.getByText(producto.nombre)).toBeInTheDocument()
    })
    expect(screen.queryByText(deOtra.nombre)).not.toBeInTheDocument()
  })

  it('avisa cuando la categoría no existe', () => {
    renderizar('/categorias/Inexistente')

    expect(screen.getByText('La categoría que buscas no existe.')).toBeInTheDocument()
  })

  it('pasa el producto elegido a onAgregar', async () => {
    const usuario = userEvent.setup()
    const onAgregar = renderizar(`/categorias/${encodeURIComponent('Juegos de Mesa')}`)

    await usuario.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])

    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar.mock.calls[0][0].categoria).toBe('Juegos de Mesa')
  })
})
