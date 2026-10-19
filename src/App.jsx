import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import WhatsAppButton from './components/WhatsAppButton'
import HomeView from './views/HomeView'
import ProductsView from './views/ProductsView'
import ProductDetailView from './views/ProductDetailView'
import CartView from './views/CartView'
import CheckoutView from './views/CheckoutView'
import CompraExitosaView from './views/CompraExitosaView'
import PagoErrorView from './views/PagoErrorView'
import BlogView from './views/BlogView'
import EventsView from './views/EventsView'
import RegisterView from './views/RegisterView'
import LoginView from './views/LoginView'
import ProfileView from './views/ProfileView'
import {
  agregarAlCarrito,
  cambiarCantidad,
  contarItems,
  quitarDelCarrito,
} from './utils/carrito'
import {
  guardarCarrito,
  guardarOrdenes,
  guardarResenas,
  guardarSesion,
  guardarUsuarios,
  leerCarrito,
  leerOrdenes,
  leerResenas,
  leerSesion,
  leerUsuarios,
} from './utils/almacenamiento'
import { crearOrden, procesarPago } from './utils/checkout'
import { agregarResena } from './utils/resenas'
import { actualizarNombre, autenticar, crearUsuario } from './utils/usuarios'

function App() {
  const [carrito, setCarrito] = useState(leerCarrito)
  const [usuarios, setUsuarios] = useState(leerUsuarios)
  const [correoSesion, setCorreoSesion] = useState(leerSesion)
  const [resenas, setResenas] = useState(leerResenas)
  const [ordenes, setOrdenes] = useState(leerOrdenes)

  const usuario = usuarios.find((item) => item.correo === correoSesion) || null
  const descuento = usuario ? usuario.descuento : 0

  function actualizarCarrito(nuevoCarrito) {
    setCarrito(nuevoCarrito)
    guardarCarrito(nuevoCarrito)
  }

  function agregar(producto) {
    actualizarCarrito(agregarAlCarrito(carrito, producto))
  }

  function quitar(codigo) {
    actualizarCarrito(quitarDelCarrito(carrito, codigo))
  }

  function modificarCantidad(codigo, cantidad) {
    actualizarCarrito(cambiarCantidad(carrito, codigo, cantidad))
  }

  // Registra la orden (pagada o rechazada). El carrito solo se vacía si el pago salió bien.
  function pagar(datos) {
    const orden = crearOrden({
      carrito,
      datos,
      descuento,
      ordenes,
      resultadoPago: procesarPago(),
    })
    const lista = [...ordenes, orden]

    setOrdenes(lista)
    guardarOrdenes(lista)

    if (orden.estado === 'pagada') {
      actualizarCarrito([])
    }

    return orden
  }

  function registrar(datos) {
    const resultado = crearUsuario(usuarios, datos)

    if (!resultado.error) {
      setUsuarios(resultado.usuarios)
      guardarUsuarios(resultado.usuarios)
    }

    return resultado
  }

  function iniciarSesion(correo, contrasena) {
    const encontrado = autenticar(usuarios, correo, contrasena)

    if (!encontrado) {
      return false
    }

    setCorreoSesion(encontrado.correo)
    guardarSesion(encontrado.correo)
    return true
  }

  function dejarResena(codigo, datos) {
    if (!usuario) {
      return { error: 'Inicia sesión para dejar una reseña.' }
    }

    const nueva = {
      codigo,
      correo: usuario.correo,
      autor: usuario.nombre,
      puntuacion: datos.puntuacion,
      comentario: datos.comentario.trim(),
      fecha: new Date().toISOString().slice(0, 10),
    }
    const resultado = agregarResena(resenas, nueva)

    if (!resultado.error) {
      setResenas(resultado.resenas)
      guardarResenas(resultado.resenas)
    }

    return resultado
  }

  function actualizarPerfil(nombre) {
    const lista = actualizarNombre(usuarios, usuario.correo, nombre)
    setUsuarios(lista)
    guardarUsuarios(lista)
  }

  function cerrarSesion() {
    setCorreoSesion(null)
    guardarSesion(null)
  }

  return (
    <div className="app-shell">
      <AppNavbar cantidadCarrito={contarItems(carrito)} usuario={usuario} />

      <Container className="py-4">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/productos" element={<ProductsView onAgregar={agregar} />} />
          <Route
            path="/producto/:codigo"
            element={
              <ProductDetailView
                onAgregar={agregar}
                usuario={usuario}
                resenas={resenas}
                onAgregarResena={dejarResena}
              />
            }
          />
          <Route path="/blog" element={<BlogView />} />
          <Route path="/eventos" element={<EventsView />} />
          <Route path="/registro" element={<RegisterView onRegistrar={registrar} />} />
          <Route path="/login" element={<LoginView onIniciarSesion={iniciarSesion} />} />
          <Route
            path="/perfil"
            element={
              <ProfileView
                usuario={usuario}
                onCerrarSesion={cerrarSesion}
                onActualizarNombre={actualizarPerfil}
              />
            }
          />
          <Route
            path="/carrito"
            element={
              <CartView
                carrito={carrito}
                descuento={descuento}
                onQuitar={quitar}
                onCambiarCantidad={modificarCantidad}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutView
                carrito={carrito}
                descuento={descuento}
                usuario={usuario}
                onPagar={pagar}
              />
            }
          />
          <Route
            path="/compra-exitosa/:numero"
            element={<CompraExitosaView ordenes={ordenes} />}
          />
          <Route path="/pago-error/:numero" element={<PagoErrorView ordenes={ordenes} />} />
        </Routes>
      </Container>

      <WhatsAppButton />
    </div>
  )
}

export default App
