import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ContactoView from '../views/ContactoView'

async function llenar(usuario, { nombre, correo, mensaje }) {
  if (nombre) await usuario.type(screen.getByLabelText('Nombre'), nombre)
  if (correo) await usuario.type(screen.getByLabelText('Correo'), correo)
  if (mensaje) await usuario.type(screen.getByLabelText('Mensaje'), mensaje)
}

describe('ContactoView', () => {
  it('con los datos válidos envía el mensaje, avisa y limpia el formulario', async () => {
    const usuario = userEvent.setup()
    const onEnviar = vi.fn()
    render(<ContactoView onEnviar={onEnviar} />)

    await llenar(usuario, {
      nombre: 'Ana',
      correo: 'ana@duocuc.cl',
      mensaje: 'Quiero saber si hay stock.',
    })
    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(onEnviar).toHaveBeenCalledWith({
      nombre: 'Ana',
      correo: 'ana@duocuc.cl',
      mensaje: 'Quiero saber si hay stock.',
    })
    expect(screen.getByRole('alert')).toHaveTextContent('Gracias por escribirnos')
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
  })

  it('con el formulario vacío muestra los errores y no envía nada', async () => {
    const usuario = userEvent.setup()
    const onEnviar = vi.fn()
    render(<ContactoView onEnviar={onEnviar} />)

    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument()
    expect(onEnviar).not.toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('funciona sin onEnviar', async () => {
    const usuario = userEvent.setup()
    render(<ContactoView />)

    await llenar(usuario, {
      nombre: 'Ana',
      correo: 'ana@duocuc.cl',
      mensaje: 'Mensaje de prueba largo.',
    })
    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
