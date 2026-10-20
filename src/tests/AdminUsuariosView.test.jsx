import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AdminUsuariosView from '../views/admin/AdminUsuariosView'

const usuarios = [
  { nombre: 'Ana', correo: 'ana@duocuc.cl', puntos: 250 },
  { nombre: 'Beto', correo: 'beto@gmail.com', puntos: 0 },
]

function renderizar(onEliminar = vi.fn(() => ({ usuario: usuarios[0] })), lista = usuarios) {
  render(
    <MemoryRouter>
      <AdminUsuariosView usuarios={lista} onEliminar={onEliminar} />
    </MemoryRouter>
  )

  return onEliminar
}

describe('AdminUsuariosView', () => {
  afterEach(() => vi.restoreAllMocks())

  it('lista los usuarios con su correo, nivel y puntos', () => {
    renderizar()

    expect(screen.getByText('2 usuario(s)')).toBeInTheDocument()
    expect(screen.getByText('beto@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('Plata')).toBeInTheDocument()
    expect(screen.getByText('Bronce')).toBeInTheDocument()
  })

  it('tiene accesos para crear, editar y ver el historial', () => {
    renderizar()

    expect(screen.getByText('Nuevo usuario')).toHaveAttribute('href', '/admin/usuarios/nuevo')
    expect(screen.getByRole('button', { name: 'Editar Ana' })).toHaveAttribute(
      'href',
      '/admin/usuarios/ana@duocuc.cl'
    )
    expect(screen.getByRole('button', { name: 'Historial de Ana' })).toHaveAttribute(
      'href',
      '/admin/usuarios/ana@duocuc.cl/compras'
    )
  })

  it('elimina al usuario cuando se confirma', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const onEliminar = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Ana' }))

    expect(onEliminar).toHaveBeenCalledWith('ana@duocuc.cl')
    expect(screen.getByRole('alert')).toHaveTextContent('Usuario ana@duocuc.cl eliminado.')
  })

  it('no elimina nada si se cancela la confirmación', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const onEliminar = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Ana' }))

    expect(onEliminar).not.toHaveBeenCalled()
  })

  it('muestra el error si no se pudo eliminar', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderizar(vi.fn(() => ({ error: 'El usuario no existe.' })))

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Ana' }))

    expect(screen.getByRole('alert')).toHaveTextContent('El usuario no existe.')
  })

  it('avisa si no hay usuarios', () => {
    renderizar(vi.fn(), [])

    expect(screen.getByText('Aún no hay usuarios registrados.')).toBeInTheDocument()
  })
})
