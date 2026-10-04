import { Card, Col, Row } from 'react-bootstrap'
import { articulos } from '../data/articulos'

function BlogView() {
  return (
    <section>
      <h1 className="mb-1">Blog</h1>
      <p className="mb-4">Noticias, consejos y guías para mejorar tu experiencia de juego.</p>

      <Row className="g-3">
        {articulos.map((articulo) => (
          <Col key={articulo.id} xs={12} lg={4}>
            <Card className="card-gamer h-100">
              <Card.Body>
                <span className="etiqueta-categoria">{articulo.fecha}</span>
                <Card.Title className="mt-1">{articulo.titulo}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted-gamer">
                  {articulo.resumen}
                </Card.Subtitle>
                <Card.Text>{articulo.contenido}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  )
}

export default BlogView
