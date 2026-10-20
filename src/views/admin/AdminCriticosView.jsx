import { Badge, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { productosCriticos, UMBRAL_CRITICO } from '../../utils/inventario'

function AdminCriticosView({ productos = [] }) {
  const lista = productosCriticos(productos)

  return (
    <section>
      <h1 className="mb-1">Productos críticos</h1>
      <p className="mb-3">Productos con {UMBRAL_CRITICO} unidades o menos en bodega.</p>

      <p>{lista.length} producto(s) con stock crítico</p>

      {lista.length === 0 ? (
        <p>No hay productos con stock crítico.</p>
      ) : (
        <Table responsive variant="dark" className="align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map((producto) => (
              <tr key={producto.codigo}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>
                  {producto.stock === 0 ? (
                    <Badge bg="danger">Sin stock</Badge>
                  ) : (
                    producto.stock
                  )}
                </td>
                <td className="text-end">
                  <Button
                    as={Link}
                    to={`/admin/productos/${producto.codigo}`}
                    size="sm"
                    variant="outline-light"
                    aria-label={`Editar ${producto.nombre}`}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  )
}

export default AdminCriticosView
