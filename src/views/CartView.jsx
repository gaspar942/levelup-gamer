import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { aplicarDescuento, calcularTotal } from '../utils/carrito'

function CartView({ carrito, descuento = 0, onQuitar, onCambiarCantidad }) {
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

  const subtotal = calcularTotal(carrito)
  const { monto, totalFinal } = aplicarDescuento(subtotal, descuento)

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

      <div className="text-end">
        <p className="mb-1">Subtotal: ${subtotal.toLocaleString('es-CL')} CLP</p>
        {monto > 0 && (
          <p className="mb-1">
            Descuento Duoc ({Math.round(descuento * 100)}%): -${monto.toLocaleString('es-CL')} CLP
          </p>
        )}
        <h4>
          Total: <span className="precio">${totalFinal.toLocaleString('es-CL')} CLP</span>
        </h4>
        <Button as={Link} to="/checkout" className="btn-gamer mt-2">
          Ir a pagar
        </Button>
      </div>
    </section>
  )
}

export default CartView
