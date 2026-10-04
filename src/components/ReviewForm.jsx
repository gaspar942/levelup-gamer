import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { validarResena } from '../utils/resenas'

function ReviewForm({ onEnviar }) {
  const [puntuacion, setPuntuacion] = useState('')
  const [comentario, setComentario] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  function enviar(event) {
    event.preventDefault()

    const datos = { puntuacion: Number(puntuacion), comentario }
    const nuevosErrores = validarResena(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    const resultado = onEnviar(datos)

    if (resultado && resultado.error) {
      setErrorGeneral(resultado.error)
      return
    }

    setErrorGeneral('')
    setPuntuacion('')
    setComentario('')
  }

  return (
    <Form noValidate onSubmit={enviar} data-bs-theme="dark" style={{ maxWidth: 480 }}>
      <h3 className="mt-4">Deja tu reseña</h3>

      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <Form.Group className="mb-3" controlId="puntuacion">
        <Form.Label>Calificación</Form.Label>
        <Form.Select
          value={puntuacion}
          onChange={(event) => setPuntuacion(event.target.value)}
          isInvalid={!!errores.puntuacion}
        >
          <option value="">Elige una opción</option>
          {[1, 2, 3, 4, 5].map((valor) => (
            <option key={valor} value={valor}>{valor}</option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errores.puntuacion}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="comentario">
        <Form.Label>Comentario</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comentario}
          onChange={(event) => setComentario(event.target.value)}
          isInvalid={!!errores.comentario}
        />
        <Form.Control.Feedback type="invalid">{errores.comentario}</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" className="btn-gamer">Publicar reseña</Button>
    </Form>
  )
}

export default ReviewForm
