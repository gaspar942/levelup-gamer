import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AdminUsuarioFormView from '../views/admin/AdminUsuarioFormView'

const usuarios = [{ nombre: 'Ana', correo: 'ana@duocuc.cl', puntos: 0 }]

function renderizar(ruta, { onCrear = vi.fn(() => ({})), onEditar = vi.fn(() => ({})) } = {}) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
        <Route
          path="/admin/usuarios/nuevo"
          element={<AdminUsuarioFormView usuarios={usuarios} onCrear={onCrear} />}
        />
        <Route
          path="/admin/usuarios/:correo"
          element={<AdminUsuarioFormView usuarios={usuarios} onEditar={onEditar} />}
        />
      </Routes>
    </MemoryRouter>
  )

  return { onCrear, onEditar }
}

function llenarNuevo({ nombre, correo, fecha, contrasena }) {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: nombre } })
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), { target: { value: fecha } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: contrasena } })
}

describe('AdminUsuarioFormView - nuevo usuario', () => {
  it('crea el usuario con datos válidos y vuelve al listado', async () => {
    const usuario = userEvent.setup()
    const { onCrear } = renderizar('/admin/usuarios/nuevo')

    llenarNuevo({
      nombre: 'Beto',
      correo: 'beto@gmail.com',
      fecha: '2000-01-01',
      contrasena: 'secreta1',
    })
    await usuario.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(onCrear).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Beto', correo: 'beto@gmail.com', contrasena: 'secreta1' })
    )
    expect(screen.getByText('Listado de usuarios')).toBeInTheDocument()
  })

  it('con el formulario vacío muestra los errores y no crea nada', async () => {
    const usuario = userEvent.setup()
    const { onCrear } = renderizar('/admin/usuarios/nuevo')

    await usuario.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(onCrear).not.toHaveBeenCalled()
  })

  it('muestra el error que devuelve la creación', async () => {
    const usuario = userEvent.setup()
    renderizar('/admin/usuarios/nuevo', {
      onCrear: vi.fn(() => ({ error: 'Ese correo ya está registrado.' })),
    })

    llenarNuevo({
      nombre: 'Ana',
      correo: 'ana@duocuc.cl',
      fecha: '2000-01-01',
      contrasena: 'secreta1',
    })
    await usuario.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ese correo ya está registrado.')
  })
})

describe('AdminUsuarioFormView - editar usuario', () => {
  it('carga los datos, deja el correo bloqueado y guarda el nombre nuevo', async () => {
    const usuario = userEvent.setup()
    const { onEditar } = renderizar('/admin/usuarios/ana@duocuc.cl')

    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
    expect(screen.getByLabelText('Correo')).toBeDisabled()

    await usuario.clear(screen.getByLabelText('Nombre'))
    await usuario.type(screen.getByLabelText('Nombre'), 'Ana María')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(onEditar).toHaveBeenCalledWith('ana@duocuc.cl', { nombre: 'Ana María' })
    expect(screen.getByText('Listado de usuarios')).toBeInTheDocument()
  })

  it('muestra el error si no se pudo editar', async () => {
    const usuario = userEvent.setup()
    renderizar('/admin/usuarios/ana@duocuc.cl', {
      onEditar: vi.fn(() => ({ error: 'El nombre es obligatorio.' })),
    })

    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('alert')).toHaveTextContent('El nombre es obligatorio.')
  })

  it('avisa si el usuario no existe', () => {
    renderizar('/admin/usuarios/nadie@correo.cl')

    expect(screen.getByText(/No encontramos al usuario nadie@correo.cl/)).toBeInTheDocument()
  })
})
