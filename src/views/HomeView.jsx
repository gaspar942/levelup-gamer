import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function HomeView() {
  return (
    <>
      <section className="hero">
        <h1>Desafía tus límites con Level-Up Gamer</h1>
        <p className="my-3">
          Conviértete en el héroe de tu propia historia y únete a nuestra comunidad de jugadores.
        </p>
        <Button as={Link} to="/productos" className="btn-gamer">
          Explorar productos
        </Button>
      </section>

      <section className="mb-4">
        <h2 className="mb-3">Impacto comunitario</h2>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Card className="card-gamer h-100">
              <Card.Body>
                <Card.Title>Tus compras apoyan a la comunidad</Card.Title>
                <Card.Text>
                  Parte de lo que compras ayuda a organizar eventos y torneos gamer en distintas regiones del país.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="card-gamer h-100">
              <Card.Body>
                <Card.Title>Gana puntos LevelUp</Card.Title>
                <Card.Text>
                  Asiste a los eventos y suma puntos para canjearlos por productos y descuentos.
                </Card.Text>
                <Button as={Link} to="/eventos" variant="outline-light">
                  Ver eventos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  )
}

export default HomeView
