import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NosotrosView from '../views/NosotrosView'

describe('NosotrosView', () => {
  it('muestra el título y la misión, visión y comunidad', () => {
    render(<NosotrosView />)

    expect(screen.getByRole('heading', { name: 'Nosotros' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nuestra misión' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nuestra visión' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Comunidad' })).toBeInTheDocument()
  })
})
