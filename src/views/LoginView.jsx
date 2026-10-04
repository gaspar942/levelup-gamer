import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function LoginView({ onIniciarSesion }) {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')

  function enviar(event) {
    event.preventDefault()

    if (onIniciarSesion(correo, contrasena)) {
      navigate('/perfil')
    } else {
      setError('Correo o contraseña incorrectos.')
    }
  }

  return (
    <section data-bs-theme="dark" style={{ maxWidth: 480 }}>
      <h1 className="mb-3">Iniciar sesión</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate onSubmit={enviar}>
        <Form.Group className="mb-3" controlId="loginCorreo">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginContrasena">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={contrasena}
            onChange={(event) => setContrasena(event.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="btn-gamer">Ingresar</Button>
      </Form>
    </section>
  )
}

export default LoginView
