import { Alert, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import OrdenDetalle from '../components/OrdenDetalle'
import { buscarOrden, datosDesdeOrden } from '../utils/checkout'

function PagoErrorView({ ordenes }) {
  const { numero } = useParams()
  const navigate = useNavigate()
  const orden = buscarOrden(ordenes, numero)

  if (!orden || orden.estado !== 'rechazada') {
    return (
      <section>
        <h1>Pago</h1>
        <p>No encontramos un pago rechazado con ese número.</p>
        <Button as={Link} to="/carrito" className="btn-gamer">
          Ir al carrito
        </Button>
      </section>
    )
  }

  // El carrito sigue intacto, así que solo hay que volver al checkout con los datos ya escritos.
  function reintentar() {
    navigate('/checkout', { state: { datos: datosDesdeOrden(orden) } })
  }

  return (
    <section>
      <Alert variant="danger">
        <h1 className="h4 mb-1">No se pudo realizar el pago. nro #{orden.numero}</h1>
        <p className="mb-0">{orden.motivo}</p>
      </Alert>

      <div className="text-center mb-4">
        <Button className="btn-gamer" onClick={reintentar}>
          Volver a realizar el pago
        </Button>
      </div>

      <OrdenDetalle orden={orden} />
    </section>
  )
}

export default PagoErrorView
