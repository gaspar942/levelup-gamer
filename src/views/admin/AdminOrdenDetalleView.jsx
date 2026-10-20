import { Alert, Badge, Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import OrdenDetalle from '../../components/OrdenDetalle'
import { buscarOrden } from '../../utils/checkout'

// Boleta de una orden, pagada o rechazada (/admin/ordenes/:numero).
function AdminOrdenDetalleView({ ordenes = [] }) {
  const { numero } = useParams()
  const orden = buscarOrden(ordenes, numero)

  if (!orden) {
    return (
      <Alert variant="warning">
        No encontramos la orden {numero}. <Link to="/admin/ordenes">Volver al listado</Link>
      </Alert>
    )
  }

  const pagada = orden.estado === 'pagada'

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="mb-0">Boleta #{orden.numero}</h1>
        <Badge bg={pagada ? 'success' : 'danger'}>{pagada ? 'Pagada' : 'Rechazada'}</Badge>
      </div>

      <p className="mb-3">Fecha: {orden.fecha}</p>

      {!pagada && orden.motivo && <Alert variant="danger">{orden.motivo}</Alert>}

      <OrdenDetalle orden={orden} />

      <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
        <Button variant="outline-light" onClick={() => window.print()}>
          Imprimir boleta
        </Button>
        <Button as={Link} to="/admin/ordenes" className="btn-gamer">
          Volver a órdenes
        </Button>
      </div>
    </section>
  )
}

export default AdminOrdenDetalleView
