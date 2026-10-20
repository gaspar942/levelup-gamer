import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import WhatsAppButton from './components/WhatsAppButton'
import HomeView from './views/HomeView'
import ProductsView from './views/ProductsView'
import ProductDetailView from './views/ProductDetailView'
import CartView from './views/CartView'
import CategoriasView from './views/CategoriasView'
import OfertasView from './views/OfertasView'
import CheckoutView from './views/CheckoutView'
import CompraExitosaView from './views/CompraExitosaView'
import PagoErrorView from './views/PagoErrorView'
import BlogView from './views/BlogView'
import BlogDetailView from './views/BlogDetailView'
import NosotrosView from './views/NosotrosView'
import ContactoView from './views/ContactoView'
import EventsView from './views/EventsView'
import RegisterView from './views/RegisterView'
import LoginView from './views/LoginView'
import ProfileView from './views/ProfileView'
import AdminLayout from './views/admin/AdminLayout'
import AdminDashboardView from './views/admin/AdminDashboardView'
import AdminProductosView from './views/admin/AdminProductosView'
import AdminProductoFormView from './views/admin/AdminProductoFormView'
import AdminCategoriasView from './views/admin/AdminCategoriasView'
import AdminOrdenesView from './views/admin/AdminOrdenesView'
import AdminOrdenDetalleView from './views/admin/AdminOrdenDetalleView'
import AdminUsuariosView from './views/admin/AdminUsuariosView'
import AdminUsuarioFormView from './views/admin/AdminUsuarioFormView'
import AdminUsuarioComprasView from './views/admin/AdminUsuarioComprasView'
import AdminCriticosView from './views/admin/AdminCriticosView'
import AdminReportesView from './views/admin/AdminReportesView'
import AdminReporteProductosView from './views/admin/AdminReporteProductosView'
import AdminPerfilView from './views/admin/AdminPerfilView'
import {
  agregarAlCarrito,
  aplicarDescuento,
  calcularTotal,
  cambiarCantidad,
  contarItems,
  quitarDelCarrito,
} from './utils/carrito'
import { categorias as categoriasBase } from './data/categorias'
import { productos as productosBase } from './data/productos'
import {
  guardarCarrito,
  guardarCategorias,
  guardarOrdenes,
  guardarProductos,
  guardarResenas,
  guardarSesion,
  guardarUsuarios,
  leerCarrito,
  leerCategorias,
  leerOrdenes,
  leerProductos,
  leerResenas,
  leerSesion,
  leerUsuarios,
} from './utils/almacenamiento'
import { buscarUsuarioSesion, autenticarAdministrador, correoReservado } from './utils/administrador'
import {
  actualizarProducto,
  crearCategoria,
  crearProducto,
  eliminarCategoria,
  eliminarProducto,
  renombrarCategoria,
} from './utils/catalogo'
import { crearOrden, procesarPago } from './utils/checkout'
import { aplicarOferta } from './utils/ofertas'
import { agregarResena } from './utils/resenas'
import { actualizarNombre, autenticar, crearUsuario } from './utils/usuarios'
import { editarUsuario, eliminarUsuario } from './utils/gestionUsuarios'

function App() {
  const [carrito, setCarrito] = useState(leerCarrito)
  const [usuarios, setUsuarios] = useState(leerUsuarios)
  const [correoSesion, setCorreoSesion] = useState(leerSesion)
  const [resenas, setResenas] = useState(leerResenas)
  const [ordenes, setOrdenes] = useState(leerOrdenes)
  // El catálogo sale de lo guardado y, si no hay nada, de los datos base de src/data.
  const [productos, setProductos] = useState(() => leerProductos() || productosBase)
  const [categorias, setCategorias] = useState(() => leerCategorias() || categoriasBase)

  const usuario = buscarUsuarioSesion(usuarios, correoSesion)
  const descuento = usuario ? usuario.descuento : 0
  const totalCarrito = aplicarDescuento(calcularTotal(carrito), descuento || 0).totalFinal

  function actualizarCarrito(nuevoCarrito) {
    setCarrito(nuevoCarrito)
    guardarCarrito(nuevoCarrito)
  }

  // Si el producto tiene oferta, entra al carrito con el precio rebajado, se agregue desde donde se agregue.
  function agregar(producto) {
    actualizarCarrito(agregarAlCarrito(carrito, aplicarOferta(producto)))
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

  // Guarda los cambios del catálogo en el estado y en el almacenamiento.
  function actualizarCatalogo(nuevosProductos, nuevasCategorias) {
    if (nuevosProductos) {
      setProductos(nuevosProductos)
      guardarProductos(nuevosProductos)
    }

    if (nuevasCategorias) {
      setCategorias(nuevasCategorias)
      guardarCategorias(nuevasCategorias)
    }
  }

  function altaProducto(datos) {
    const resultado = crearProducto(productos, categorias, datos)

    if (!resultado.error) {
      actualizarCatalogo(resultado.productos)
    }

    return resultado
  }

  function modificarProducto(codigo, cambios) {
    const resultado = actualizarProducto(productos, categorias, codigo, cambios)

    if (!resultado.error) {
      actualizarCatalogo(resultado.productos)
    }

    return resultado
  }

  function bajaProducto(codigo) {
    const resultado = eliminarProducto(productos, codigo)

    if (!resultado.error) {
      actualizarCatalogo(resultado.productos)
    }

    return resultado
  }

  function altaCategoria(nombre) {
    const resultado = crearCategoria(categorias, nombre)

    if (!resultado.error) {
      actualizarCatalogo(null, resultado.categorias)
    }

    return resultado
  }

  function cambiarNombreCategoria(actual, nuevo) {
    const resultado = renombrarCategoria(categorias, productos, actual, nuevo)

    if (!resultado.error) {
      actualizarCatalogo(resultado.productos, resultado.categorias)
    }

    return resultado
  }

  function bajaCategoria(nombre) {
    const resultado = eliminarCategoria(categorias, productos, nombre)

    if (!resultado.error) {
      actualizarCatalogo(null, resultado.categorias)
    }

    return resultado
  }

  function registrar(datos) {
    if (correoReservado(datos.correo)) {
      return { error: 'Ese correo ya está registrado.' }
    }

    const resultado = crearUsuario(usuarios, datos)

    if (!resultado.error) {
      setUsuarios(resultado.usuarios)
      guardarUsuarios(resultado.usuarios)
    }

    return resultado
  }

  // Edición y baja de usuarios desde el panel de administrador.
  function modificarUsuario(correo, cambios) {
    const resultado = editarUsuario(usuarios, correo, cambios)

    if (!resultado.error) {
      setUsuarios(resultado.usuarios)
      guardarUsuarios(resultado.usuarios)
    }

    return resultado
  }

  function bajaUsuario(correo) {
    const resultado = eliminarUsuario(usuarios, correo)

    if (!resultado.error) {
      setUsuarios(resultado.usuarios)
      guardarUsuarios(resultado.usuarios)
    }

    return resultado
  }

  function iniciarSesion(correo, contrasena) {
    const encontrado =
      autenticarAdministrador(correo, contrasena) || autenticar(usuarios, correo, contrasena)

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
      <AppNavbar
        cantidadCarrito={contarItems(carrito)}
        totalCarrito={totalCarrito}
        usuario={usuario}
      />

      <Container className="py-4">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route
            path="/productos"
            element={
              <ProductsView productos={productos} categorias={categorias} onAgregar={agregar} />
            }
          />
          <Route
            path="/producto/:codigo"
            element={
              <ProductDetailView
                productos={productos}
                onAgregar={agregar}
                usuario={usuario}
                resenas={resenas}
                onAgregarResena={dejarResena}
              />
            }
          />
          <Route
            path="/categorias/:nombre?"
            element={
              <CategoriasView productos={productos} categorias={categorias} onAgregar={agregar} />
            }
          />
          <Route path="/ofertas" element={<OfertasView productos={productos} onAgregar={agregar} />} />
          <Route path="/blog" element={<BlogView />} />
          <Route path="/blog/:id" element={<BlogDetailView />} />
          <Route path="/nosotros" element={<NosotrosView />} />
          <Route path="/contacto" element={<ContactoView />} />
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
          <Route
            path="/admin"
            element={<AdminLayout usuario={usuario} onCerrarSesion={cerrarSesion} />}
          >
            <Route
              index
              element={
                <AdminDashboardView productos={productos} usuarios={usuarios} ordenes={ordenes} />
              }
            />
            <Route
              path="productos"
              element={<AdminProductosView productos={productos} onEliminar={bajaProducto} />}
            />
            <Route
              path="productos/nuevo"
              element={
                <AdminProductoFormView
                  productos={productos}
                  categorias={categorias}
                  onCrear={altaProducto}
                />
              }
            />
            <Route
              path="productos/:codigo"
              element={
                <AdminProductoFormView
                  productos={productos}
                  categorias={categorias}
                  onEditar={modificarProducto}
                />
              }
            />
            <Route
              path="categorias"
              element={
                <AdminCategoriasView
                  categorias={categorias}
                  productos={productos}
                  onCrear={altaCategoria}
                  onRenombrar={cambiarNombreCategoria}
                  onEliminar={bajaCategoria}
                />
              }
            />
            <Route path="ordenes" element={<AdminOrdenesView ordenes={ordenes} />} />
            <Route path="ordenes/:numero" element={<AdminOrdenDetalleView ordenes={ordenes} />} />
            <Route path="productos/criticos" element={<AdminCriticosView productos={productos} />} />
            <Route
              path="usuarios"
              element={<AdminUsuariosView usuarios={usuarios} onEliminar={bajaUsuario} />}
            />
            <Route
              path="usuarios/nuevo"
              element={<AdminUsuarioFormView usuarios={usuarios} onCrear={registrar} />}
            />
            <Route
              path="usuarios/:correo"
              element={<AdminUsuarioFormView usuarios={usuarios} onEditar={modificarUsuario} />}
            />
            <Route
              path="usuarios/:correo/compras"
              element={<AdminUsuarioComprasView usuarios={usuarios} ordenes={ordenes} />}
            />
            <Route
              path="productos/reportes"
              element={<AdminReporteProductosView ordenes={ordenes} productos={productos} />}
            />
            <Route
              path="reportes"
              element={<AdminReportesView ordenes={ordenes} productos={productos} />}
            />
            <Route path="perfil" element={<AdminPerfilView usuario={usuario} />} />
          </Route>
        </Routes>
      </Container>

      <WhatsAppButton />
    </div>
  )
}

export default App
