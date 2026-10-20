import { Alert, Card } from 'react-bootstrap'

function AdminPerfilView({ usuario = null }) {
  if (!usuario) {
    return <Alert variant="warning">No hay una sesión activa.</Alert>
  }

  return (
    <section>
      <h1 className="mb-3">Perfil</h1>

      <Card className="card-gamer" style={{ maxWidth: 480 }}>
        <Card.Body>
          <Card.Title>{usuario.nombre}</Card.Title>
          <Card.Text>{usuario.correo}</Card.Text>
          <p className="mb-0">Rol: Administrador del sistema</p>
        </Card.Body>
      </Card>
    </section>
  )
}

export default AdminPerfilView
