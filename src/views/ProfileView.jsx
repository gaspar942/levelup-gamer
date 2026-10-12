import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import { nivelPorPuntos } from '../utils/usuarios'

function ProfileView({ usuario, onCerrarSesion, onActualizarNombre = () => {} }) {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState(usuario ? usuario.nombre : '')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  function salir() {
    onCerrarSesion()
    navigate('/')
  }

  function guardar(event) {
    event.preventDefault()

    if (nombre.trim() === '') {
      setError('Ingresa un nombre.')
      setMensaje('')
      return
    }

    onActualizarNombre(nombre)
    setError('')
    setMensaje('Datos actualizados.')
  }

  return (
    <section data-bs-theme="dark">
      <h1 className="mb-3">Mi perfil</h1>

      <Card className="card-gamer" style={{ maxWidth: 480 }}>
        <Card.Body>
          <Card.Title>{usuario.nombre}</Card.Title>
          <Card.Text>{usuario.correo}</Card.Text>

          <p>Descuento: {Math.round(usuario.descuento * 100)}%</p>
          <p>Puntos LevelUp: <span className="precio">{usuario.puntos}</span></p>
          <p>Nivel: {nivelPorPuntos(usuario.puntos)}</p>
          <p>Tu código para referir amigos: <strong>{usuario.codigoPropio}</strong></p>

          <Form noValidate onSubmit={guardar} className="mb-3">
            {mensaje && <Alert variant="success">{mensaje}</Alert>}

            <Form.Group className="mb-2" controlId="perfilNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                isInvalid={!!error}
              />
              <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="btn-gamer">Guardar cambios</Button>
          </Form>

          <Button variant="outline-light" onClick={salir}>Cerrar sesión</Button>
        </Card.Body>
      </Card>
    </section>
  )
}

export default ProfileView
