import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import ReviewForm from '../components/ReviewForm'

test('muestra errores si faltan la calificación y el comentario', () => {
  const onEnviar = vi.fn()
  render(<ReviewForm onEnviar={onEnviar} />)

  fireEvent.click(screen.getByRole('button', { name: /publicar reseña/i }))

  expect(screen.getByText(/calificación de 1 a 5/i)).toBeInTheDocument()
  expect(onEnviar).not.toHaveBeenCalled()
})

test('envía la calificación como número y el comentario', () => {
  const onEnviar = vi.fn(() => ({}))
  render(<ReviewForm onEnviar={onEnviar} />)

  fireEvent.change(screen.getByLabelText(/calificación/i), { target: { value: '4' } })
  fireEvent.change(screen.getByLabelText(/comentario/i), {
    target: { value: 'Excelente producto' },
  })
  fireEvent.click(screen.getByRole('button', { name: /publicar reseña/i }))

  expect(onEnviar).toHaveBeenCalledWith({
    puntuacion: 4,
    comentario: 'Excelente producto',
  })
})
