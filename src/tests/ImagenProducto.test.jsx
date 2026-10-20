import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ImagenProducto from '../components/ImagenProducto'

describe('ImagenProducto', () => {
  it('muestra la foto del producto con su ruta, texto alternativo y clase', () => {
    render(<ImagenProducto codigo="JM001" nombre="Catan" className="imagen-producto" />)

    const imagen = screen.getByAltText('Catan')

    expect(imagen).toHaveAttribute('src', '/img/JM001.jpg')
    expect(imagen).toHaveClass('imagen-producto')
  })

  it('si la foto no carga muestra el recuadro Sin imagen', () => {
    render(<ImagenProducto codigo="JM001" nombre="Catan" />)

    fireEvent.error(screen.getByAltText('Catan'))

    expect(screen.queryByAltText('Catan')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Sin imagen de Catan' })).toBeInTheDocument()
  })

  it('al cambiar de producto vuelve a intentar con la foto nueva', () => {
    const { rerender } = render(<ImagenProducto codigo="JM001" nombre="Catan" />)

    fireEvent.error(screen.getByAltText('Catan'))
    rerender(<ImagenProducto codigo="JM002" nombre="Carcassonne" />)

    expect(screen.getByAltText('Carcassonne')).toHaveAttribute('src', '/img/JM002.jpg')
  })

  it('sin nombre la imagen es decorativa y el recuadro de respaldo se oculta', () => {
    const { container } = render(<ImagenProducto codigo="JM001" />)

    expect(container.querySelector('img')).toHaveAttribute('alt', '')

    fireEvent.error(container.querySelector('img'))

    expect(container.querySelector('.sin-imagen')).toHaveAttribute('aria-hidden', 'true')
  })
})
