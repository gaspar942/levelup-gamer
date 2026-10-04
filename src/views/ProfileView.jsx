import { Button, Card } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import { nivelPorPuntos } from '../utils/usuarios'

function ProfileView({ usuario, onCerrarSesion }) {
  const navigate = useNavigate()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  function salir() {
    onCerrarSesion()
    navigate('/')
  }

  return (
    <section>
      <h1 className="mb-3">Mi perfil</h1>

      <Card className="card-gamer" style={{ maxWidth: 480 }}>
        <Card.Body>
          <Card.Title>{usuario.nombre}</Card.Title>
          <Card.Text>{usuario.correo}</Card.Text>

          <p>Descuento: {Math.round(usuario.descuento * 100)}%</p>
          <p>Puntos LevelUp: <span className="precio">{usuario.puntos}</span></p>
          <p>Nivel: {nivelPorPuntos(usuario.puntos)}</p>
          <p>Tu código para referir amigos: <strong>{usuario.codigoPropio}</strong></p>

          <Button variant="outline-light" onClick={salir}>Cerrar sesión</Button>
        </Card.Body>
      </Card>
    </section>
  )
}

export default ProfileView
