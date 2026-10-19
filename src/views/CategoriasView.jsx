import { Badge, Button, Col, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categorias as categoriasBase } from '../data/categorias'
import { productos as productosBase } from '../data/productos'
import { filtrarProductos } from '../utils/filtros'

function CategoriasView({ productos = productosBase, categorias = categoriasBase, onAgregar }) {
  const { nombre } = useParams()
  const existe = categorias.includes(nombre)
  const productosCategoria = existe ? filtrarProductos(productos, { categoria: nombre }) : []

  return (
    <section data-bs-theme="dark">
      <h1 className="mb-3">Categorías</h1>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {categorias.map((categoria) => {
          const cantidad = filtrarProductos(productos, { categoria }).length

          return (
            <Button
              key={categoria}
              as={Link}
              to={`/categorias/${encodeURIComponent(categoria)}`}
              variant={categoria === nombre ? 'success' : 'outline-light'}
            >
              {categoria} <Badge bg="secondary">{cantidad}</Badge>
            </Button>
          )
        })}
      </div>

      {!nombre && <p>Elige una categoría para ver sus productos.</p>}

      {nombre && !existe && <p>La categoría que buscas no existe.</p>}

      {existe && (
        <>
          <h2 className="h4 mb-3">{nombre}</h2>

          <Row className="g-3">
            {productosCategoria.map((producto) => (
              <Col key={producto.codigo} xs={12} md={6} lg={4}>
                <ProductCard producto={producto} onAgregar={onAgregar} />
              </Col>
            ))}
          </Row>

          {productosCategoria.length === 0 && <p>Esta categoría aún no tiene productos.</p>}
        </>
      )}
    </section>
  )
}

export default CategoriasView
