import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { banners } from '../data/banners'
import HomeView from '../views/HomeView'

function renderizar() {
  render(
    <MemoryRouter>
      <HomeView />
    </MemoryRouter>
  )
}

describe('HomeView - carrusel', () => {
  it('muestra una diapositiva por cada banner', () => {
    renderizar()

    expect(document.querySelectorAll('.carousel-item')).toHaveLength(banners.length)
    banners.forEach((banner) => {
      expect(screen.getByText(banner.titulo)).toBeInTheDocument()
      expect(screen.getByText(banner.texto)).toBeInTheDocument()
    })
  })

  it('cada botón lleva a la ruta de su banner', () => {
    renderizar()

    banners.forEach((banner) => {
      expect(screen.getByText(banner.boton).closest('a')).toHaveAttribute('href', banner.ruta)
    })
  })

  it('el título del inicio sigue visible bajo el carrusel', () => {
    renderizar()

    expect(screen.getByText(/Desafía tus límites/)).toBeInTheDocument()
  })
})
