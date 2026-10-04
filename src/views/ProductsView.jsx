import { Button, Col, Form, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categorias } from '../data/categorias'
import { productos } from '../data/productos'
import { filtrarProductos } from '../utils/filtros'

const opcionesPrecio = [
  { valor: '30000', texto: 'Hasta $30.000' },
  { valor: '100000', texto: 'Hasta $100.000' },
  { valor: '500000', texto: 'Hasta $500.000' },
  { valor: '1500000', texto: 'Hasta $1.500.000' },
]

function ProductsView({ onAgregar }) {
  const [params, setParams] = useSearchParams()

  const categoria = params.get('categoria') || 'Todas'
  const busqueda = params.get('q') || ''
  const max = params.get('max') || ''

  function actualizar(clave, valor) {
    const nuevos = new URLSearchParams(params)

    if (valor) {
      nuevos.set(clave, valor)
    } else {
      nuevos.delete(clave)
    }

    setParams(nuevos)
  }

  const productosFiltrados = filtrarProductos(productos, {
    categoria,
    busqueda,
    precioMax: max ? Number(max) : null,
  })

  return (
    <section data-bs-theme="dark">
      <h1 className="mb-3">Productos</h1>

      <Row className="g-3 mb-4 align-items-end">
        <Col xs={12} md={4}>
          <Form.Label htmlFor="busqueda">Buscar</Form.Label>
          <Form.Control
            id="busqueda"
            placeholder="Nombre o descripción"
            value={busqueda}
            onChange={(event) => actualizar('q', event.target.value)}
          />
        </Col>

        <Col xs={12} md={3}>
          <Form.Label htmlFor="categoria">Categoría</Form.Label>
          <Form.Select
            id="categoria"
            value={categoria}
            onChange={(event) =>
              actualizar('categoria', event.target.value === 'Todas' ? '' : event.target.value)
            }
          >
            <option value="Todas">Todas</option>
            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={12} md={3}>
          <Form.Label htmlFor="precio">Precio</Form.Label>
          <Form.Select
            id="precio"
            value={max}
            onChange={(event) => actualizar('max', event.target.value)}
          >
            <option value="">Sin límite</option>
            {opcionesPrecio.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={12} md={2}>
          <Button variant="outline-light" onClick={() => setParams({})}>
            Limpiar filtros
          </Button>
        </Col>
      </Row>

      <p>{productosFiltrados.length} producto(s) encontrado(s)</p>

      <Row className="g-3">
        {productosFiltrados.map((producto) => (
          <Col key={producto.codigo} xs={12} md={6} lg={4}>
            <ProductCard producto={producto} onAgregar={onAgregar} />
          </Col>
        ))}
      </Row>

      {productosFiltrados.length === 0 && (
        <p>No encontramos productos con esos filtros.</p>
      )}
    </section>
  )
}

export default ProductsView
