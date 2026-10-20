import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { validarContacto } from '../utils/contacto'

const datosVacios = { nombre: '', correo: '', mensaje: '' }

// Formulario de contacto. Valida los campos y avisa que el mensaje se envió.
// Como no hay backend, quien use la vista puede recibir el mensaje con onEnviar.
function ContactoView({ onEnviar = () => {} }) {
  const [datos, setDatos] = useState(datosVacios)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function cambiar(campo) {
    return (event) => {
      const valor = event.target.value
      setDatos((previo) => ({ ...previo, [campo]: valor }))
    }
  }

  function enviar(event) {
    event.preventDefault()

    const nuevosErrores = validarContacto(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setEnviado(false)
      return
    }

    onEnviar({
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      mensaje: datos.mensaje.trim(),
    })
    setDatos(datosVacios)
    setEnviado(true)
  }

  return (
    <section style={{ maxWidth: 640 }}>
      <h1 className="mb-1">Contacto</h1>
      <p className="mb-4">¿Tienes dudas sobre un producto o tu compra? Escríbenos.</p>

      {enviado && (
        <Alert variant="success">Gracias por escribirnos. Te responderemos a la brevedad.</Alert>
      )}

      <Form noValidate onSubmit={enviar}>
        <Form.Group className="mb-3" controlId="contactoNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            value={datos.nombre}
            onChange={cambiar('nombre')}
            isInvalid={!!errores.nombre}
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contactoCorreo">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            value={datos.correo}
            onChange={cambiar('correo')}
            isInvalid={!!errores.correo}
          />
          <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contactoMensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={datos.mensaje}
            onChange={cambiar('mensaje')}
            isInvalid={!!errores.mensaje}
          />
          <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" className="btn-gamer">Enviar mensaje</Button>
      </Form>
    </section>
  )
}

export default ContactoView
