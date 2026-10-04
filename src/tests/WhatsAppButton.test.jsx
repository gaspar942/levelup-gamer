import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import WhatsAppButton, { NUMERO_SOPORTE } from '../components/WhatsAppButton'

test('el botón abre WhatsApp con el número de soporte', () => {
  render(<WhatsAppButton />)

  const enlace = screen.getByRole('link', { name: /whatsapp/i })

  expect(enlace.getAttribute('href')).toContain(`https://wa.me/${NUMERO_SOPORTE}`)
})
