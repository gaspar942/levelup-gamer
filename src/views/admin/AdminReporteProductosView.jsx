import { Badge, Table } from 'react-bootstrap'
import { UMBRAL_CRITICO } from '../../utils/inventario'
import { reporteProductos } from '../../utils/reportes'

function formatoPesos(valor) {
  return `$${valor.toLocaleString('es-CL')}`
}

function Stock({ valor }) {
  if (valor === null) {
    return 'Sin dato'
  }

  if (valor === 0) {
    return <Badge bg="danger">Sin stock</Badge>
  }

  if (valor <= UMBRAL_CRITICO) {
    return (
      <Badge bg="warning" text="dark">
        {valor}
      </Badge>
    )
  }

  return valor
}

function AdminReporteProductosView({ ordenes = [], productos = [] }) {
  const filas = reporteProductos(ordenes, productos)

  return (
    <section>
      <h1 className="mb-1">Reporte de productos</h1>
      <p className="mb-3">
        Stock actual y ventas por producto. Solo cuentan las órdenes pagadas.
      </p>

      <p>{filas.length} producto(s)</p>

      {filas.length === 0 ? (
        <p>No hay productos en el catálogo.</p>
      ) : (
        <Table responsive variant="dark" className="align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Unidades vendidas</th>
              <th>Monto vendido</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.codigo}>
                <td>{fila.codigo}</td>
                <td>{fila.nombre}</td>
                <td>{fila.categoria}</td>
                <td>
                  <Stock valor={fila.stock} />
                </td>
                <td>{fila.unidades}</td>
                <td>{formatoPesos(fila.ingresos)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  )
}

export default AdminReporteProductosView
