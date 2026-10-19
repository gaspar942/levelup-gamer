import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function TarjetaResumen({ titulo, valor }) {
  return (
    <Card className="card-gamer h-100" role="group" aria-label={titulo}>
      <Card.Body>
        <Card.Subtitle className="mb-2">{titulo}</Card.Subtitle>
        <p className="precio fs-3 mb-0">{valor}</p>
      </Card.Body>
    </Card>
  )
}

function AdminDashboardView({ productos = [], usuarios = [], ordenes = [] }) {
  const compras = ordenes.filter((orden) => orden.estado === 'pagada').length

  return (
    <section>
      <h1 className="mb-1">Dashboard</h1>
      <p className="mb-4">Resumen de la tienda</p>

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <TarjetaResumen titulo="Compras" valor={compras} />
        </Col>
        <Col xs={12} md={4}>
          <TarjetaResumen titulo="Productos" valor={productos.length} />
        </Col>
        <Col xs={12} md={4}>
          <TarjetaResumen titulo="Usuarios" valor={usuarios.length} />
        </Col>
      </Row>

      <div className="d-flex flex-wrap gap-2">
        <Button as={Link} to="/admin/productos" variant="outline-light">
          Administrar productos
        </Button>
        <Button as={Link} to="/admin/categorias" variant="outline-light">
          Administrar categorías
        </Button>
      </div>
    </section>
  )
}

export default AdminDashboardView
