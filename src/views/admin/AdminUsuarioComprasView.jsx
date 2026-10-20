import { Alert, Badge, Button, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { ordenesDeCliente } from '../../utils/ordenes'

// Historial de compras de un usuario (/admin/usuarios/:correo/compras).
function AdminUsuarioComprasView({ usuarios = [], ordenes = [] }) {
  const { correo } = useParams()
  const usuario = usuarios.find((item) => item.correo === correo)

  if (!usuario) {
    return (
      <Alert variant="warning">
        No encontramos al usuario {correo}. <Link to="/admin/usuarios">Volver al listado</Link>
      </Alert>
    )
  }

  const compras = ordenesDeCliente(ordenes, usuario.correo)

  return (
    <section>
      <h1 className="mb-1">Historial de compras</h1>
      <p className="mb-3">{usuario.nombre} ({usuario.correo})</p>

      <p>{compras.length} compra(s)</p>

      {compras.length === 0 ? (
        <p>Este usuario aún no tiene compras.</p>
      ) : (
        <Table responsive variant="dark" className="align-middle">
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {compras.map((orden) => (
              <tr key={orden.numero}>
                <td>{orden.numero}</td>
                <td>{orden.fecha}</td>
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
      )}

      <Button as={Link} to="/admin/usuarios" variant="outline-light">
        Volver a usuarios
      </Button>
    </section>
  )
}

export default AdminUsuarioComprasView
