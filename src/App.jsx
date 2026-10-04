import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import WhatsAppButton from './components/WhatsAppButton'
import HomeView from './views/HomeView'
import ProductsView from './views/ProductsView'
import ProductDetailView from './views/ProductDetailView'
import CartView from './views/CartView'
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
  guardarResenas,
  guardarSesion,
  guardarUsuarios,
  leerResenas,
  leerSesion,
  leerUsuarios,
} from './utils/almacenamiento'
import { agregarResena } from './utils/resenas'
import { autenticar, crearUsuario } from './utils/usuarios'

function App() {
  const [carrito, setCarrito] = useState([])
  const [usuarios, setUsuarios] = useState(leerUsuarios)
  const [correoSesion, setCorreoSesion] = useState(leerSesion)
  const [resenas, setResenas] = useState(leerResenas)

  const usuario = usuarios.find((item) => item.correo === correoSesion) || null

  function agregar(producto) {
    setCarrito(agregarAlCarrito(carrito, producto))
  }

  function quitar(codigo) {
    setCarrito(quitarDelCarrito(carrito, codigo))
  }

  function modificarCantidad(codigo, cantidad) {
    setCarrito(cambiarCantidad(carrito, codigo, cantidad))
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
            element={<ProfileView usuario={usuario} onCerrarSesion={cerrarSesion} />}
          />
          <Route
            path="/carrito"
            element={
              <CartView
                carrito={carrito}
                onQuitar={quitar}
                onCambiarCantidad={modificarCantidad}
              />
            }
          />
        </Routes>
      </Container>

      <WhatsAppButton />
    </div>
  )
}

export default App
