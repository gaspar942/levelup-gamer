import { Alert, Col, Row } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { esAdministrador } from '../../utils/administrador'

// Marco del panel: menú lateral y, al lado, la sección elegida (Outlet).
// Quien no es administrador solo ve un aviso.
function AdminLayout({ usuario = null, onCerrarSesion }) {
  if (!esAdministrador(usuario)) {
    return (
      <Alert variant="warning">
        Esta zona es solo para administradores. <Link to="/login">Inicia sesión</Link> con una
        cuenta de administrador.
      </Alert>
    )
  }

  return (
    <Row className="g-4" data-bs-theme="dark">
      <Col xs={12} md={3} lg={2}>
        <AdminSidebar onCerrarSesion={onCerrarSesion} />
      </Col>
      <Col xs={12} md={9} lg={10}>
        <Outlet />
      </Col>
    </Row>
  )
}

export default AdminLayout
