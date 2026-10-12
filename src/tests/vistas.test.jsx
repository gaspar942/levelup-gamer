import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import AppNavbar from '../components/AppNavbar'
import ReviewForm from '../components/ReviewForm'
import { articulos } from '../data/articulos'
import BlogView from '../views/BlogView'
import CartView from '../views/CartView'
import HomeView from '../views/HomeView'
import ProfileView from '../views/ProfileView'
import RegisterView from '../views/RegisterView'

function enRouter(elemento) {
  return render(<MemoryRouter>{elemento}</MemoryRouter>)
}

describe('RegisterView', () => {
  test('sugiere un correo Duoc cuando el registro no tiene descuento', () => {
    const onRegistrar = vi.fn(() => ({ usuario: { nombre: 'Beto', descuento: 0 } }))
    render(<RegisterView onRegistrar={onRegistrar} />)

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Beto' } })
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'beto@gmail.com' },
    })
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
      target: { value: '2000-01-01' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'secreta1' },
    })
    fireEvent.click(screen.getByRole('button', { name: /registrarme/i }))

    expect(screen.getByText(/Registra un correo Duoc/)).toBeInTheDocument()
  })
})

describe('ReviewForm', () => {
  test('muestra el error cuando la reseña está duplicada', () => {
    const onEnviar = vi.fn(() => ({ error: 'Ya dejaste una reseña para este producto.' }))
    render(<ReviewForm onEnviar={onEnviar} />)

    fireEvent.change(screen.getByLabelText(/calificación/i), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText(/comentario/i), {
      target: { value: 'Excelente producto' },
    })
    fireEvent.click(screen.getByRole('button', { name: /publicar reseña/i }))

    expect(screen.getByText(/Ya dejaste una reseña/)).toBeInTheDocument()
  })
})

describe('CartView', () => {
  const carrito = [
    { codigo: 'CO001', nombre: 'PlayStation 5', precio: 549990, cantidad: 1 },
  ]

  test('avisa cuando el carrito está vacío', () => {
    enRouter(
      <CartView carrito={[]} onQuitar={() => {}} onCambiarCantidad={() => {}} />
    )
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByText('Ver productos')).toBeInTheDocument()
  })

  test('el botón + aumenta la cantidad', () => {
    const onCambiarCantidad = vi.fn()
    enRouter(
      <CartView carrito={carrito} onQuitar={() => {}} onCambiarCantidad={onCambiarCantidad} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar PlayStation 5' }))
    expect(onCambiarCantidad).toHaveBeenCalledWith('CO001', 2)
  })

  test('el botón - baja la cantidad', () => {
    const onCambiarCantidad = vi.fn()
    enRouter(
      <CartView carrito={carrito} onQuitar={() => {}} onCambiarCantidad={onCambiarCantidad} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Disminuir PlayStation 5' }))
    expect(onCambiarCantidad).toHaveBeenCalledWith('CO001', 0)
  })

  test('el botón Eliminar quita el producto', () => {
    const onQuitar = vi.fn()
    enRouter(
      <CartView carrito={carrito} onQuitar={onQuitar} onCambiarCantidad={() => {}} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(onQuitar).toHaveBeenCalledWith('CO001')
  })
})

describe('ProfileView', () => {
  test('cerrar sesión llama a la función recibida', () => {
    const onCerrarSesion = vi.fn()
    const usuario = {
      nombre: 'Ana',
      correo: 'ana@duocuc.cl',
      descuento: 0.2,
      puntos: 0,
      codigoPropio: 'LVL0001',
    }
    enRouter(<ProfileView usuario={usuario} onCerrarSesion={onCerrarSesion} />)

    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }))

    expect(onCerrarSesion).toHaveBeenCalled()
  })
})

describe('HomeView y BlogView', () => {
  test('el inicio muestra el título y el impacto comunitario', () => {
    enRouter(<HomeView />)
    expect(screen.getByText(/Desafía tus límites/)).toBeInTheDocument()
    expect(screen.getByText('Impacto comunitario')).toBeInTheDocument()
  })

  test('el blog muestra todos los artículos', () => {
    enRouter(<BlogView />)
    articulos.forEach((articulo) => {
      expect(screen.getByText(articulo.titulo)).toBeInTheDocument()
    })
  })
})

describe('AppNavbar', () => {
  test('sin sesión muestra Ingresar y Registro', () => {
    enRouter(<AppNavbar />)
    expect(screen.getByText('Ingresar')).toBeInTheDocument()
    expect(screen.getByText('Registro')).toBeInTheDocument()
  })

  test('con sesión muestra el nombre y oculta Ingresar', () => {
    enRouter(<AppNavbar usuario={{ nombre: 'Ana' }} />)
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.queryByText('Ingresar')).not.toBeInTheDocument()
  })

  test('muestra la cantidad de productos del carrito', () => {
    enRouter(<AppNavbar cantidadCarrito={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
