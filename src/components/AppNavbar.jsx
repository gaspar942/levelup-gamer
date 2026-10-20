import { useState } from 'react'
import { Badge, Button, Container, Form, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { esAdministrador } from '../utils/administrador'

function formatoPesos(valor) {
  return `$${valor.toLocaleString('es-CL')}`
}

function AppNavbar({ cantidadCarrito = 0, totalCarrito = 0, usuario = null }) {
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  // Lleva la búsqueda al catálogo: ProductsView la lee del parámetro q.
  function buscar(event) {
    event.preventDefault()

    const texto = busqueda.trim()

    navigate({ pathname: '/productos', search: texto ? `?q=${encodeURIComponent(texto)}` : '' })
  }

  return (
    <Navbar className="navbar-gamer" data-bs-theme="dark" expand="xl">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          LEVEL-UP GAMER
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Form className="d-flex gap-2 my-2 my-xl-0 me-xl-3" role="search" onSubmit={buscar}>
            <Form.Control
              type="search"
              size="sm"
              placeholder="Buscar productos"
              aria-label="Buscar en la tienda"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
            <Button type="submit" size="sm" variant="outline-success">
              Buscar
            </Button>
          </Form>

          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/categorias">Categorías</Nav.Link>
            <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/eventos">Eventos</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>

          <Nav>
            {esAdministrador(usuario) && (
              <Nav.Link as={NavLink} to="/admin">Administración</Nav.Link>
            )}
            {usuario ? (
              <Nav.Link as={NavLink} to="/perfil">{usuario.nombre}</Nav.Link>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Ingresar</Nav.Link>
                <Nav.Link as={NavLink} to="/registro">Registro</Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/carrito">
              Carrito{' '}
              <span className="monto-carrito">{formatoPesos(totalCarrito)}</span>{' '}
              <Badge bg="success" pill>{cantidadCarrito}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
