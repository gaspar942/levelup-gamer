import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import CheckoutView from '../views/CheckoutView'

const carrito = [
  { codigo: 'MS001', nombre: 'Mouse Gamer', precio: 10000, cantidad: 2 },
  { codigo: 'TC002', nombre: 'Teclado', precio: 5000, cantidad: 1 },
]

function renderizar({ entrada = '/checkout', onPagar, ...props } = {}) {
  const pagar = onPagar || vi.fn(() => ({ estado: 'pagada', numero: '2026101901' }))

  render(
    <MemoryRouter initialEntries={[entrada]}>
      <Routes>
        <Route
          path="/checkout"
          element={<CheckoutView carrito={carrito} onPagar={pagar} {...props} />}
        />
        <Route path="/compra-exitosa/:numero" element={<p>pantalla de compra exitosa</p>} />
        <Route path="/pago-error/:numero" element={<p>pantalla de pago con error</p>} />
      </Routes>
    </MemoryRouter>
  )

  return { onPagar: pagar }
}

async function completarFormulario(usuario) {
  await usuario.type(screen.getByLabelText('Nombre'), 'Ana')
  await usuario.type(screen.getByLabelText('Apellidos'), 'Rojas')
  await usuario.type(screen.getByLabelText('Correo'), 'ana@duocuc.cl')
  await usuario.type(screen.getByLabelText('Calle'), 'Los Aromos 123')
  await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Cerrillos')
}

describe('CheckoutView', () => {
  it('muestra los productos y el total a pagar', () => {
    renderizar()

    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()
    expect(screen.getByText('Teclado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Pagar ahora \$25\.000/ })).toBeInTheDocument()
  })

  it('muestra el descuento Duoc cuando corresponde', () => {
    renderizar({ descuento: 0.2 })

    expect(screen.getByText(/Descuento Duoc \(20%\)/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Pagar ahora \$20\.000/ })).toBeInTheDocument()
  })

  it('avisa si el carrito está vacío y no muestra el formulario', () => {
    renderizar({ carrito: [] })

    expect(screen.getByText(/carrito está vacío/)).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('completa solos el nombre y el correo cuando hay sesión', () => {
    renderizar({ usuario: { nombre: 'Ana', correo: 'ana@duocuc.cl' } })

    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
    expect(screen.getByLabelText('Correo')).toHaveValue('ana@duocuc.cl')
  })

  it('no llama a onPagar y muestra errores si faltan datos', async () => {
    const usuario = userEvent.setup()
    const { onPagar } = renderizar()

    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(onPagar).not.toHaveBeenCalled()
    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa la calle y el número.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una comuna.')).toBeInTheDocument()
  })

  it('actualiza el estado del formulario mientras se escribe', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.type(screen.getByLabelText('Calle'), 'Los Aromos')

    expect(screen.getByLabelText('Calle')).toHaveValue('Los Aromos')
  })

  it('cambia las comunas disponibles al elegir otra región', async () => {
    const usuario = userEvent.setup()
    renderizar()

    expect(screen.getByRole('option', { name: 'Cerrillos' })).toBeInTheDocument()

    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región de Valparaíso')

    expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Cerrillos' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Comuna')).toHaveValue('')
  })

  it('envía los datos a onPagar y va a la compra exitosa', async () => {
    const usuario = userEvent.setup()
    const { onPagar } = renderizar()

    await completarFormulario(usuario)
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(onPagar).toHaveBeenCalledTimes(1)
    expect(onPagar).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Ana',
        apellidos: 'Rojas',
        correo: 'ana@duocuc.cl',
        calle: 'Los Aromos 123',
        comuna: 'Cerrillos',
      })
    )
    expect(screen.getByText('pantalla de compra exitosa')).toBeInTheDocument()
  })

  it('va a la pantalla de error cuando el pago es rechazado', async () => {
    const usuario = userEvent.setup()
    const onPagar = vi.fn(() => ({ estado: 'rechazada', numero: '2026101902' }))
    renderizar({ onPagar })

    await completarFormulario(usuario)
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(screen.getByText('pantalla de pago con error')).toBeInTheDocument()
  })

  it('recupera los datos escritos cuando se vuelve desde un pago con error', () => {
    renderizar({
      entrada: {
        pathname: '/checkout',
        state: {
          datos: {
            nombre: 'Ana',
            apellidos: 'Rojas',
            correo: 'ana@duocuc.cl',
            calle: 'Los Aromos 123',
            departamento: '603',
            region: 'Región Metropolitana de Santiago',
            comuna: 'Cerrillos',
            indicaciones: '',
          },
        },
      },
    })

    expect(screen.getByLabelText('Calle')).toHaveValue('Los Aromos 123')
    expect(screen.getByLabelText('Comuna')).toHaveValue('Cerrillos')
  })
})
