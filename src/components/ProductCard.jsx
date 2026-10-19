import { Badge, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { aplicarOferta } from '../utils/ofertas'

function ProductCard({ producto, onAgregar }) {
  const conOferta = aplicarOferta(producto)

  function agregar() {
    if (onAgregar) {
      onAgregar(producto)
    }
  }

  return (
    <Card className="card-gamer h-100">
      <Card.Body className="d-flex flex-column">
        <span className="etiqueta-categoria">{producto.categoria}</span>
        <Card.Title className="mt-1">{producto.nombre}</Card.Title>
        <Card.Text>{producto.descripcion}</Card.Text>

        <div className="mt-auto">
          <p className="precio mb-2">
            {conOferta.precioOriginal !== undefined && (
              <>
                <s className="text-secondary me-2">
                  {`$${conOferta.precioOriginal.toLocaleString('es-CL')}`}
                </s>
                <Badge bg="danger" className="me-2">
                  {`-${conOferta.porcentajeOferta}%`}
                </Badge>
              </>
            )}
            ${conOferta.precio.toLocaleString('es-CL')} CLP
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <Button className="btn-gamer" onClick={agregar}>
              Agregar al carrito
            </Button>
            <Button
              as={Link}
              to={`/producto/${producto.codigo}`}
              variant="outline-light"
            >
              Ver detalle
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProductCard
