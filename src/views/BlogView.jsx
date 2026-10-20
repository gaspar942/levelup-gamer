import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
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
                <Card.Text>{articulo.resumen}</Card.Text>
                <Link
                  to={`/blog/${articulo.id}`}
                  aria-label={`Leer artículo: ${articulo.titulo}`}
                >
                  Leer artículo
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  )
}

export default BlogView
