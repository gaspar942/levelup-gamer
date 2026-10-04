import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { validarRegistro } from '../utils/validaciones'

const datosIniciales = {
  nombre: '',
  correo: '',
  fechaNacimiento: '',
  contrasena: '',
  codigoReferido: '',
}

function RegisterView({ onRegistrar }) {
  const [datos, setDatos] = useState(datosIniciales)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [registrado, setRegistrado] = useState(null)

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function enviar(event) {
    event.preventDefault()
    const nuevosErrores = validarRegistro(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    const resultado = onRegistrar(datos)

    if (resultado.error) {
      setErrorGeneral(resultado.error)
      setRegistrado(null)
      return
    }

    setErrorGeneral('')
    setRegistrado(resultado.usuario)
    setDatos(datosIniciales)
  }

  return (
    <section data-bs-theme="dark" style={{ maxWidth: 480 }}>
      <h1 className="mb-3">Registro</h1>

      {registrado && (
        <Alert variant="success">
          Cuenta creada para {registrado.nombre}.{' '}
          {registrado.descuento > 0
            ? 'Tienes un 20% de descuento de por vida por tu correo Duoc.'
            : 'Registra un correo Duoc para obtener un 20% de descuento.'}{' '}
          Ahora puedes iniciar sesión.
        </Alert>
      )}

      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <Form noValidate onSubmit={enviar}>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={datos.nombre}
            onChange={cambiar}
            isInvalid={!!errores.nombre}
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="correo">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            name="correo"
            value={datos.correo}
            onChange={cambiar}
            isInvalid={!!errores.correo}
          />
          <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="fechaNacimiento">
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control
            type="date"
            name="fechaNacimiento"
            value={datos.fechaNacimiento}
            onChange={cambiar}
            isInvalid={!!errores.fechaNacimiento}
          />
          <Form.Control.Feedback type="invalid">
            {errores.fechaNacimiento}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contrasena">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="contrasena"
            value={datos.contrasena}
            onChange={cambiar}
            isInvalid={!!errores.contrasena}
          />
          <Form.Control.Feedback type="invalid">{errores.contrasena}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="codigoReferido">
          <Form.Label>Código de referido (opcional)</Form.Label>
          <Form.Control
            name="codigoReferido"
            value={datos.codigoReferido}
            onChange={cambiar}
          />
        </Form.Group>

        <Button type="submit" className="btn-gamer">Registrarme</Button>
      </Form>
    </section>
  )
}

export default RegisterView
