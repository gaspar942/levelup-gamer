import { Badge, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function AppNavbar({ cantidadCarrito = 0, usuario = null }) {
  return (
    <Navbar className="navbar-gamer" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          LEVEL-UP GAMER
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/eventos">Eventos</Nav.Link>
          </Nav>

          <Nav>
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
              <Badge bg="success" pill>{cantidadCarrito}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
