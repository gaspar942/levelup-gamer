import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import ShareButtons from '../components/ShareButtons'
import { construirEnlacesCompartir } from '../utils/compartir'

const producto = {
  codigo: 'JM001',
  nombre: 'Catan',
  precio: 29990,
}

describe('construirEnlacesCompartir', () => {
  const url = 'http://tienda.cl/producto/JM001'
  const enlaces = construirEnlacesCompartir(producto, url)

  test('el enlace de WhatsApp lleva el nombre y la dirección del producto', () => {
    expect(enlaces.whatsapp.startsWith('https://wa.me/?text=')).toBe(true)
    expect(enlaces.whatsapp).toContain('Catan')
    expect(enlaces.whatsapp).toContain(encodeURIComponent(url))
  })

  test('el enlace de X lleva el texto y la dirección', () => {
    expect(enlaces.x).toContain('twitter.com/intent/tweet')
    expect(enlaces.x).toContain(`url=${encodeURIComponent(url)}`)
  })

  test('el enlace de Facebook lleva la dirección codificada', () => {
    expect(enlaces.facebook).toBe(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    )
  })
})

describe('ShareButtons', () => {
  test('muestra los tres enlaces para compartir', () => {
    render(<ShareButtons producto={producto} />)
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /en x/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument()
  })

  test('los enlaces se abren en una pestaña nueva y apuntan a la ruta del producto', () => {
    render(<ShareButtons producto={producto} />)
    const enlace = screen.getByRole('link', { name: /facebook/i })
    expect(enlace).toHaveAttribute('target', '_blank')
    expect(enlace.getAttribute('href')).toContain(encodeURIComponent('/producto/JM001'))
  })
})
