import { Alert } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { articulos } from '../data/articulos'
import { buscarArticulo } from '../utils/blog'

function BlogDetailView() {
  const { id } = useParams()
  const articulo = buscarArticulo(articulos, id)

  if (!articulo) {
    return (
      <Alert variant="warning">
        No encontramos ese artículo. <Link to="/blog">Volver al blog</Link>
      </Alert>
    )
  }

  return (
    <article style={{ maxWidth: 720 }}>
      <span className="etiqueta-categoria">{articulo.fecha}</span>
      <h1 className="mt-1 mb-2">{articulo.titulo}</h1>
      <p className="lead">{articulo.resumen}</p>
      <p>{articulo.contenido}</p>
      <Link to="/blog">Volver al blog</Link>
    </article>
  )
}

export default BlogDetailView
