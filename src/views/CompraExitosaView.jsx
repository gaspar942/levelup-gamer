import { Alert, Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import OrdenDetalle from '../components/OrdenDetalle'
import { buscarOrden } from '../utils/checkout'

function CompraExitosaView({ ordenes }) {
  const { numero } = useParams()
  const orden = buscarOrden(ordenes, numero)

  if (!orden || orden.estado !== 'pagada') {
    return (
      <section>
        <h1>Compra</h1>
        <p>No encontramos una compra pagada con ese número.</p>
        <Button as={Link} to="/productos" className="btn-gamer">
          Ver productos
        </Button>
      </section>
    )
  }

  const asunto = encodeURIComponent(`Boleta de tu compra #${orden.numero}`)

  return (
    <section>
      <Alert variant="success">
        <h1 className="h4 mb-0">Se ha realizado la compra. nro #{orden.numero}</h1>
      </Alert>

      <OrdenDetalle orden={orden} />

      <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
        <Button variant="outline-light" onClick={() => window.print()}>
          Imprimir boleta en PDF
        </Button>
        <Button
          as="a"
          variant="outline-success"
          href={`mailto:${orden.cliente.correo}?subject=${asunto}`}
        >
          Enviar boleta por email
        </Button>
        <Button as={Link} to="/productos" className="btn-gamer">
          Seguir comprando
        </Button>
      </div>
    </section>
  )
}

export default CompraExitosaView
