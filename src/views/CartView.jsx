import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { calcularTotal } from '../utils/carrito'

function CartView({ carrito, onQuitar, onCambiarCantidad }) {
  if (carrito.length === 0) {
    return (
      <section>
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Button as={Link} to="/productos" className="btn-gamer">
          Ver productos
        </Button>
      </section>
    )
  }

  return (
    <section>
      <h1 className="mb-3">Carrito</h1>

      <Table responsive variant="dark" className="align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item) => (
            <tr key={item.codigo}>
              <td>{item.nombre}</td>
              <td>${item.precio.toLocaleString('es-CL')}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline-light"
                    aria-label={`Disminuir ${item.nombre}`}
                    onClick={() => onCambiarCantidad(item.codigo, item.cantidad - 1)}
                  >
                    -
                  </Button>
                  <span>{item.cantidad}</span>
                  <Button
                    size="sm"
                    variant="outline-light"
                    aria-label={`Aumentar ${item.nombre}`}
                    onClick={() => onCambiarCantidad(item.codigo, item.cantidad + 1)}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onQuitar(item.codigo)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="text-end">
        Total: <span className="precio">${calcularTotal(carrito).toLocaleString('es-CL')} CLP</span>
      </h4>
    </section>
  )
}

export default CartView
