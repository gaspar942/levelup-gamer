import { useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { validarRegistro } from '../../utils/validaciones'

const datosVacios = { nombre: '', correo: '', fechaNacimiento: '', contrasena: '' }

// Sirve para crear (/admin/usuarios/nuevo) y para editar (/admin/usuarios/:correo).
// Al editar solo se puede cambiar el nombre: el correo identifica al usuario.
function AdminUsuarioFormView({ usuarios = [], onCrear, onEditar }) {
  const { correo } = useParams()
  const navigate = useNavigate()
  const existente = correo ? usuarios.find((usuario) => usuario.correo === correo) : null

  const [datos, setDatos] = useState(() =>
    existente ? { ...datosVacios, nombre: existente.nombre, correo: existente.correo } : datosVacios
  )
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')

  if (correo && !existente) {
    return (
      <Alert variant="warning">
        No encontramos al usuario {correo}. <Link to="/admin/usuarios">Volver al listado</Link>
      </Alert>
    )
  }

  function cambiar(campo) {
    return (event) => {
      const valor = event.target.value
      setDatos((previo) => ({ ...previo, [campo]: valor }))
    }
  }

  function guardar(event) {
    event.preventDefault()

    if (correo) {
      const resultado = onEditar(correo, { nombre: datos.nombre })

      if (resultado.error) {
        setError(resultado.error)
        return
      }

      navigate('/admin/usuarios')
      return
    }

    const nuevosErrores = validarRegistro(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    const resultado = onCrear({ ...datos, codigoReferido: '' })

    if (resultado.error) {
      setError(resultado.error)
      return
    }

    navigate('/admin/usuarios')
  }

  return (
    <section>
      <h1 className="mb-3">{correo ? 'Editar usuario' : 'Nuevo usuario'}</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate onSubmit={guardar}>
        <Row className="g-3 mb-3">
          <Col xs={12} md={6}>
            <Form.Label htmlFor="usuario-nombre">Nombre</Form.Label>
            <Form.Control
              id="usuario-nombre"
              value={datos.nombre}
              onChange={cambiar('nombre')}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Col>
          <Col xs={12} md={6}>
            <Form.Label htmlFor="usuario-correo">Correo</Form.Label>
            <Form.Control
              id="usuario-correo"
              type="email"
              value={datos.correo}
              disabled={Boolean(correo)}
              onChange={cambiar('correo')}
              isInvalid={!!errores.correo}
            />
            <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
          </Col>

          {!correo && (
            <>
              <Col xs={12} md={6}>
                <Form.Label htmlFor="usuario-fecha">Fecha de nacimiento</Form.Label>
                <Form.Control
                  id="usuario-fecha"
                  type="date"
                  value={datos.fechaNacimiento}
                  onChange={cambiar('fechaNacimiento')}
                  isInvalid={!!errores.fechaNacimiento}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.fechaNacimiento}
                </Form.Control.Feedback>
              </Col>
              <Col xs={12} md={6}>
                <Form.Label htmlFor="usuario-contrasena">Contraseña</Form.Label>
                <Form.Control
                  id="usuario-contrasena"
                  type="password"
                  value={datos.contrasena}
                  onChange={cambiar('contrasena')}
                  isInvalid={!!errores.contrasena}
                />
                <Form.Control.Feedback type="invalid">{errores.contrasena}</Form.Control.Feedback>
              </Col>
            </>
          )}
        </Row>

        <div className="d-flex gap-2">
          <Button type="submit" className="btn-gamer">
            {correo ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
          <Button as={Link} to="/admin/usuarios" variant="outline-light">
            Cancelar
          </Button>
        </div>
      </Form>
    </section>
  )
}

export default AdminUsuarioFormView
