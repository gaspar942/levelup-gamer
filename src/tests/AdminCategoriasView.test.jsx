import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AdminCategoriasView from '../views/admin/AdminCategoriasView'

const categorias = ['Mouse', 'Accesorios']
const productos = [
  { codigo: 'MS001', categoria: 'Mouse' },
  { codigo: 'MS002', categoria: 'Mouse' },
  { codigo: 'AC001', categoria: 'Accesorios' },
]

function renderizar({ onCrear, onRenombrar, onEliminar } = {}) {
  const funciones = {
    onCrear: onCrear || vi.fn(() => ({ categorias: [] })),
    onRenombrar: onRenombrar || vi.fn(() => ({ categorias: [] })),
    onEliminar: onEliminar || vi.fn(() => ({ categorias: [] })),
  }

  render(
    <MemoryRouter>
      <AdminCategoriasView categorias={categorias} productos={productos} {...funciones} />
    </MemoryRouter>
  )

  return funciones
}

describe('AdminCategoriasView', () => {
  afterEach(() => vi.restoreAllMocks())

  it('lista las categorías con la cantidad de productos de cada una', () => {
    renderizar()

    const filaMouse = screen.getByText('Mouse').closest('tr')
    const filaAccesorios = screen.getByText('Accesorios').closest('tr')

    expect(within(filaMouse).getByText('2')).toBeInTheDocument()
    expect(within(filaAccesorios).getByText('1')).toBeInTheDocument()
  })

  it('crea una categoría, avisa y limpia el campo', async () => {
    const usuario = userEvent.setup()
    const { onCrear } = renderizar()

    await usuario.type(screen.getByLabelText('Nueva categoría'), 'Teclados')
    await usuario.click(screen.getByRole('button', { name: 'Agregar categoría' }))

    expect(onCrear).toHaveBeenCalledWith('Teclados')
    expect(screen.getByRole('alert')).toHaveTextContent('Categoría "Teclados" creada.')
    expect(screen.getByLabelText('Nueva categoría')).toHaveValue('')
  })

  it('muestra el error al crear y conserva lo escrito', async () => {
    const usuario = userEvent.setup()
    renderizar({ onCrear: vi.fn(() => ({ error: 'Esa categoría ya existe.' })) })

    await usuario.type(screen.getByLabelText('Nueva categoría'), 'mouse')
    await usuario.click(screen.getByRole('button', { name: 'Agregar categoría' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Esa categoría ya existe.')
    expect(screen.getByLabelText('Nueva categoría')).toHaveValue('mouse')
  })

  it('renombra una categoría desde la fila', async () => {
    const usuario = userEvent.setup()
    const { onRenombrar } = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Renombrar Mouse' }))

    const campo = screen.getByLabelText('Nuevo nombre de Mouse')
    expect(campo).toHaveValue('Mouse')

    await usuario.clear(campo)
    await usuario.type(campo, 'Ratones')
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(onRenombrar).toHaveBeenCalledWith('Mouse', 'Ratones')
    expect(screen.getByRole('alert')).toHaveTextContent('Categoría renombrada a "Ratones".')
    expect(screen.queryByLabelText('Nuevo nombre de Mouse')).not.toBeInTheDocument()
  })

  it('cancelar la edición vuelve a mostrar la fila sin llamar a onRenombrar', async () => {
    const usuario = userEvent.setup()
    const { onRenombrar } = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Renombrar Mouse' }))
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onRenombrar).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Renombrar Mouse' })).toBeInTheDocument()
  })

  it('elimina una categoría cuando se confirma', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { onEliminar } = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Accesorios' }))

    expect(onEliminar).toHaveBeenCalledWith('Accesorios')
    expect(screen.getByRole('alert')).toHaveTextContent('Categoría "Accesorios" eliminada.')
  })

  it('muestra el error si la categoría no se puede eliminar', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderizar({
      onEliminar: vi.fn(() => ({ error: 'No puedes eliminar una categoría que tiene productos.' })),
    })

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Mouse' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No puedes eliminar una categoría que tiene productos.'
    )
  })
})
