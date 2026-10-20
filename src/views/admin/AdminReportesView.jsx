import { Card, Col, Row, Table } from 'react-bootstrap'
import {
  resumenOrdenes,
  totalVentas,
  ventasPorCategoria,
  ventasPorProducto,
} from '../../utils/reportes'

const PRODUCTOS_EN_RANKING = 5

function formatoPesos(valor) {
  return `$${valor.toLocaleString('es-CL')}`
}

function Tarjeta({ titulo, valor }) {
  return (
    <Card className="card-gamer h-100" role="group" aria-label={titulo}>
      <Card.Body>
        <Card.Subtitle className="mb-2">{titulo}</Card.Subtitle>
        <p className="precio fs-3 mb-0">{valor}</p>
      </Card.Body>
    </Card>
  )
}

function AdminReportesView({ ordenes = [], productos = [] }) {
  const resumen = resumenOrdenes(ordenes)
  const masVendidos = ventasPorProducto(ordenes).slice(0, PRODUCTOS_EN_RANKING)
  const porCategoria = ventasPorCategoria(ordenes, productos)

  return (
    <section>
      <h1 className="mb-1">Reportes</h1>
      <p className="mb-4">Ventas de la tienda. Solo cuentan las órdenes pagadas.</p>

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Tarjeta titulo="Ventas totales" valor={formatoPesos(totalVentas(ordenes))} />
        </Col>
        <Col xs={12} md={4}>
          <Tarjeta titulo="Órdenes pagadas" valor={resumen.pagadas} />
        </Col>
        <Col xs={12} md={4}>
          <Tarjeta titulo="Órdenes rechazadas" valor={resumen.rechazadas} />
        </Col>
      </Row>

      {masVendidos.length === 0 ? (
        <p>Todavía no hay ventas pagadas.</p>
      ) : (
        <>
          <h2 className="h4">Productos más vendidos</h2>
          <Table responsive variant="dark" className="align-middle mb-4">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Monto vendido</th>
              </tr>
            </thead>
            <tbody>
              {masVendidos.map((venta) => (
                <tr key={venta.codigo}>
                  <td>{venta.nombre}</td>
                  <td>{venta.unidades}</td>
                  <td>{formatoPesos(venta.ingresos)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h2 className="h4">Ventas por categoría</h2>
          <Table responsive variant="dark" className="align-middle">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Unidades</th>
                <th>Monto vendido</th>
              </tr>
            </thead>
            <tbody>
              {porCategoria.map((venta) => (
                <tr key={venta.categoria}>
                  <td>{venta.categoria}</td>
                  <td>{venta.unidades}</td>
                  <td>{formatoPesos(venta.ingresos)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </section>
  )
}

export default AdminReportesView
