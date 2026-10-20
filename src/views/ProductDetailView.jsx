import { Alert, Button, Col, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import ImagenProducto from '../components/ImagenProducto'
import PrecioProducto from '../components/PrecioProducto'
import ReviewForm from '../components/ReviewForm'
import ShareButtons from '../components/ShareButtons'
import { productos as productosBase } from '../data/productos'
import { promedioPuntuacion, resenasDeProducto } from '../utils/resenas'

function estrellas(puntuacion) {
  return '★'.repeat(puntuacion) + '☆'.repeat(5 - puntuacion)
}

function ProductDetailView({
  productos = productosBase,
  onAgregar,
  usuario = null,
  resenas = [],
  onAgregarResena = () => ({}),
}) {
  const { codigo } = useParams()
  const producto = productos.find((item) => item.codigo === codigo)

  if (!producto) {
    return (
      <Alert variant="warning">
        No encontramos el producto {codigo}.{' '}
        <Link to="/productos">Volver al catálogo</Link>
      </Alert>
    )
  }

  const lista = resenasDeProducto(resenas, producto.codigo)

  return (
    <section>
      <Link to="/productos">← Volver al catálogo</Link>

      <Row className="g-4 mt-1">
        <Col xs={12} md={5}>
          <ImagenProducto
            codigo={producto.codigo}
            nombre={producto.nombre}
            className="imagen-detalle"
          />
        </Col>

        <Col xs={12} md={7}>
          <span className="etiqueta-categoria d-block mt-3">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>
          <p>Código: {producto.codigo}</p>
          {producto.fabricante && <p>Fabricante: {producto.fabricante}</p>}
          <p>{producto.descripcion}</p>
          <p className="precio fs-4">
            <PrecioProducto producto={producto} />
          </p>

          <Button className="btn-gamer" onClick={() => onAgregar(producto)}>
            Agregar al carrito
          </Button>

          <ShareButtons producto={producto} />
        </Col>
      </Row>

      <h2 className="mt-5">Reseñas</h2>

      {lista.length === 0 ? (
        <p>Aún no hay reseñas para este producto.</p>
      ) : (
        <>
          <p>
            Calificación promedio: <span className="precio">{promedioPuntuacion(lista)} / 5</span>{' '}
            ({lista.length} reseña(s))
          </p>
          {lista.map((resena) => (
            <div key={resena.correo} className="mb-3">
              <strong>{resena.autor}</strong>{' '}
              <span className="precio">{estrellas(resena.puntuacion)}</span>{' '}
              <small>{resena.fecha}</small>
              <p className="mb-0">{resena.comentario}</p>
            </div>
          ))}
        </>
      )}

      {usuario ? (
        <ReviewForm onEnviar={(datos) => onAgregarResena(producto.codigo, datos)} />
      ) : (
        <p className="mt-3">
          <Link to="/login">Inicia sesión</Link> para dejar una reseña.
        </p>
      )}
    </section>
  )
}

export default ProductDetailView
