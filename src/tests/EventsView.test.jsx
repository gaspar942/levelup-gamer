import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import EventsView from '../views/EventsView'

test('muestra todos los eventos y filtra por región', () => {
  render(<EventsView />)

  expect(screen.getByText('Torneo Level-Up Santiago')).toBeInTheDocument()
  expect(screen.getByText('Feria Gamer Valparaíso')).toBeInTheDocument()

  fireEvent.change(screen.getByLabelText(/región/i), {
    target: { value: 'Valparaíso' },
  })

  expect(screen.getByText('Feria Gamer Valparaíso')).toBeInTheDocument()
  expect(screen.queryByText('Torneo Level-Up Santiago')).not.toBeInTheDocument()
})
