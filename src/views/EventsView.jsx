import { useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { eventos } from '../data/eventos'

const regiones = [...new Set(eventos.map((evento) => evento.region))]

function EventsView() {
  const [region, setRegion] = useState('Todas')

  const eventosFiltrados =
    region === 'Todas'
      ? eventos
      : eventos.filter((evento) => evento.region === region)

  return (
    <section data-bs-theme="dark">
      <h1 className="mb-1">Eventos gamer</h1>
      <p className="mb-4">
        Asiste a los eventos y gana puntos LevelUp. Datos de ejemplo.
      </p>

      <Form.Group className="mb-4" style={{ maxWidth: 320 }} controlId="region">
        <Form.Label>Región</Form.Label>
        <Form.Select value={region} onChange={(event) => setRegion(event.target.value)}>
          <option value="Todas">Todas</option>
          {regiones.map((nombre) => (
            <option key={nombre} value={nombre}>{nombre}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row className="g-3">
        {eventosFiltrados.map((evento) => (
          <Col key={evento.id} xs={12} md={6}>
            <Card className="card-gamer h-100">
              <Card.Body>
                <span className="etiqueta-categoria">{evento.region}</span>
                <Card.Title className="mt-1">{evento.nombre}</Card.Title>
                <Card.Text>
                  {evento.ciudad} · {evento.fecha}
                  <br />
                  {evento.lugar}
                </Card.Text>
                <p className="precio mb-0">+{evento.puntos} puntos LevelUp</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  )
}

export default EventsView
