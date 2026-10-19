import { Button, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const secciones = [
  { ruta: '/admin', texto: 'Dashboard', exacta: true },
  { ruta: '/admin/productos', texto: 'Productos' },
  { ruta: '/admin/categorias', texto: 'Categorías' },
]

function AdminSidebar({ onCerrarSesion }) {
  return (
    <Nav className="flex-column gap-1" aria-label="Menú de administración">
      {secciones.map((seccion) => (
        <Nav.Link key={seccion.ruta} as={NavLink} to={seccion.ruta} end={seccion.exacta}>
          {seccion.texto}
        </Nav.Link>
      ))}

      <hr />

      <Nav.Link as={NavLink} to="/">Tienda</Nav.Link>
      <Button variant="outline-danger" size="sm" onClick={onCerrarSesion}>
        Cerrar sesión
      </Button>
    </Nav>
  )
}

export default AdminSidebar
