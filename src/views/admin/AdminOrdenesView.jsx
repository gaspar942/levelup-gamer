import { useState } from 'react'
import { Badge, Button, Form, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { filtrarOrdenes } from '../../utils/ordenes'

function AdminOrdenesView({ ordenes = [] }) {
  const [estado, setEstado] = useState('')
  const lista = filtrarOrdenes(ordenes, estado)

  return (
    <section>
      <h1 className="mb-3">Órdenes</h1>

      <Form.Label htmlFor="filtro-estado">Filtrar por estado</Form.Label>
      <Form.Select
        id="filtro-estado"
        className="mb-3"
        value={estado}
        onChange={(event) => setEstado(event.target.value)}
      >
        <option value="">Todas</option>
        <option value="pagada">Pagadas</option>
        <option value="rechazada">Rechazadas</option>
      </Form.Select>

      <p>{lista.length} orden(es)</p>

      <Table responsive variant="dark" className="align-middle">
        <thead>
          <tr>
            <th>N°</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lista.map((orden) => (
            <tr key={orden.numero}>
              <td>{orden.numero}</td>
              <td>{orden.fecha}</td>
              <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
              <td>
                <Badge bg={orden.estado === 'pagada' ? 'success' : 'danger'}>
                  {orden.estado === 'pagada' ? 'Pagada' : 'Rechazada'}
                </Badge>
              </td>
              <td>${orden.total.toLocaleString('es-CL')}</td>
              <td className="text-end">
                <Button
                  as={Link}
                  to={`/admin/ordenes/${orden.numero}`}
                  size="sm"
                  variant="outline-light"
                  aria-label={`Ver boleta ${orden.numero}`}
                >
                  Ver boleta
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {lista.length === 0 && <p>No hay órdenes para mostrar.</p>}
    </section>
  )
}

export default AdminOrdenesView
