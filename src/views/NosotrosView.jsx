import { Card, Col, Row } from 'react-bootstrap'

const valores = [
  {
    titulo: 'Nuestra misión',
    texto:
      'Acercar a la comunidad gamer productos de calidad, con precios claros y una compra simple de principio a fin.',
  },
  {
    titulo: 'Nuestra visión',
    texto:
      'Ser la tienda de referencia para quienes juegan en consola, PC o en la mesa con amigos y familia.',
  },
  {
    titulo: 'Comunidad',
    texto:
      'Con el programa de puntos LevelUp y los códigos de referido, cada compra y cada amigo invitado suman beneficios.',
  },
]

function NosotrosView() {
  return (
    <section>
      <h1 className="mb-1">Nosotros</h1>
      <p className="mb-4">
        Level-Up Gamer es una tienda online de productos gamer: juegos de mesa, accesorios,
        consolas, computadores y sillas, pensada para quienes disfrutan jugar.
      </p>

      <Row className="g-3">
        {valores.map((valor) => (
          <Col key={valor.titulo} xs={12} md={4}>
            <Card className="card-gamer h-100">
              <Card.Body>
                <Card.Title as="h2" className="h5">{valor.titulo}</Card.Title>
                <Card.Text>{valor.texto}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  )
}

export default NosotrosView
