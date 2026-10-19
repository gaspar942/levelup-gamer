import { Col, Row } from 'react-bootstrap'
import ProductCard from '../components/ProductCard'
import { productos as productosBase } from '../data/productos'
import { productosConOferta } from '../utils/ofertas'

function OfertasView({ productos = productosBase, onAgregar }) {
  const enOferta = productosConOferta(productos)

  return (
    <section data-bs-theme="dark">
      <h1 className="mb-3">Ofertas</h1>

      <p>{enOferta.length} producto(s) en oferta</p>

      <Row className="g-3">
        {enOferta.map((producto) => (
          <Col key={producto.codigo} xs={12} md={6} lg={4}>
            <ProductCard producto={producto} onAgregar={onAgregar} />
          </Col>
        ))}
      </Row>

      {enOferta.length === 0 && <p>Por ahora no hay productos en oferta.</p>}
    </section>
  )
}

export default OfertasView
