import { Button, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const secciones = [
  { ruta: '/admin', texto: 'Dashboard', exacta: true },
  { ruta: '/admin/ordenes', texto: 'Órdenes' },
  { ruta: '/admin/productos', texto: 'Productos', exacta: true },
  { ruta: '/admin/productos/criticos', texto: 'Productos críticos' },
  { ruta: '/admin/productos/reportes', texto: 'Reporte de productos' },
  { ruta: '/admin/categorias', texto: 'Categorías' },
  { ruta: '/admin/usuarios', texto: 'Usuarios' },
  { ruta: '/admin/reportes', texto: 'Reportes' },
  { ruta: '/admin/perfil', texto: 'Perfil' },
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
