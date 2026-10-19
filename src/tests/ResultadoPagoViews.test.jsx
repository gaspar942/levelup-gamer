import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CompraExitosaView from '../views/CompraExitosaView'
import PagoErrorView from '../views/PagoErrorView'
import { crearOrden } from '../utils/checkout'

const carrito = [
  { codigo: 'MS001', nombre: 'Mouse Gamer', precio: 10000, cantidad: 2 },
  { codigo: 'TC002', nombre: 'Teclado', precio: 5000, cantidad: 1 },
]

const datos = {
  nombre: 'Ana',
  apellidos: 'Rojas',
  correo: 'ana@duocuc.cl',
  calle: 'Los Aromos 123',
  departamento: '603',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Cerrillos',
  indicaciones: 'Dejar con el conserje',
}

const fecha = new Date(2026, 9, 19)

const ordenPagada = crearOrden({
  carrito,
  datos,
  descuento: 0.2,
  resultadoPago: { ok: true },
  fecha,
})

const ordenRechazada = crearOrden({
  carrito,
  datos,
  ordenes: [ordenPagada],
  resultadoPago: { ok: false, motivo: 'El banco rechazó la transacción.' },
  fecha,
})

afterEach(() => {
  vi.restoreAllMocks()
})

function DestinoCheckout() {
  const { state } = useLocation()
  return <p>checkout con calle {state.datos.calle}</p>
}

function renderizarExitosa(ordenes, numero) {
  render(
    <MemoryRouter initialEntries={[`/compra-exitosa/${numero}`]}>
      <Routes>
        <Route path="/compra-exitosa/:numero" element={<CompraExitosaView ordenes={ordenes} />} />
      </Routes>
    </MemoryRouter>
  )
}

function renderizarError(ordenes, numero) {
  render(
    <MemoryRouter initialEntries={[`/pago-error/${numero}`]}>
      <Routes>
        <Route path="/pago-error/:numero" element={<PagoErrorView ordenes={ordenes} />} />
        <Route path="/checkout" element={<DestinoCheckout />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CompraExitosaView', () => {
  it('muestra el número de orden, el cliente, la dirección y el total', () => {
    renderizarExitosa([ordenPagada], ordenPagada.numero)

    expect(
      screen.getByRole('heading', { name: `Se ha realizado la compra. nro #${ordenPagada.numero}` })
    ).toBeInTheDocument()
    expect(screen.getByText(/Ana Rojas/)).toBeInTheDocument()
    expect(screen.getByText(/Los Aromos 123, depto 603/)).toBeInTheDocument()
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()
    expect(screen.getByText(/Descuento Duoc: -\$5\.000/)).toBeInTheDocument()
    expect(screen.getByText('$20.000 CLP')).toBeInTheDocument()
  })

  it('el botón de email arma un mailto con el correo del cliente', () => {
    renderizarExitosa([ordenPagada], ordenPagada.numero)

    const enlace = screen.getByText('Enviar boleta por email')

    expect(enlace.getAttribute('href')).toContain('mailto:ana@duocuc.cl')
  })

  it('el botón de imprimir abre el diálogo de impresión', async () => {
    const usuario = userEvent.setup()
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {})
    renderizarExitosa([ordenPagada], ordenPagada.numero)

    await usuario.click(screen.getByRole('button', { name: 'Imprimir boleta en PDF' }))

    expect(imprimir).toHaveBeenCalledTimes(1)
  })

  it('avisa si la orden no existe', () => {
    renderizarExitosa([ordenPagada], '999')

    expect(screen.getByText(/No encontramos una compra pagada/)).toBeInTheDocument()
  })

  it('no muestra como exitosa una orden rechazada', () => {
    renderizarExitosa([ordenRechazada], ordenRechazada.numero)

    expect(screen.getByText(/No encontramos una compra pagada/)).toBeInTheDocument()
  })
})

describe('PagoErrorView', () => {
  it('muestra el número de orden y el motivo del rechazo', () => {
    renderizarError([ordenRechazada], ordenRechazada.numero)

    expect(
      screen.getByRole('heading', {
        name: `No se pudo realizar el pago. nro #${ordenRechazada.numero}`,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('El banco rechazó la transacción.')).toBeInTheDocument()
    expect(screen.getByText('Teclado')).toBeInTheDocument()
  })

  it('vuelve al checkout conservando los datos escritos', async () => {
    const usuario = userEvent.setup()
    renderizarError([ordenRechazada], ordenRechazada.numero)

    await usuario.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }))

    expect(screen.getByText('checkout con calle Los Aromos 123')).toBeInTheDocument()
  })

  it('avisa si la orden no existe o si ya fue pagada', () => {
    renderizarError([ordenPagada], ordenPagada.numero)

    expect(screen.getByText(/No encontramos un pago rechazado/)).toBeInTheDocument()
  })
})
