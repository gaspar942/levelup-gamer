import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ProductCard({ producto, onAgregar }) {
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
            ${producto.precio.toLocaleString('es-CL')} CLP
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
