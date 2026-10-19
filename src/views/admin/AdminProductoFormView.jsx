import { useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { buscarProducto } from '../../utils/catalogo'

function datosVacios(categorias) {
  return {
    codigo: '',
    nombre: '',
    categoria: categorias[0] || '',
    precio: '',
    fabricante: '',
    descripcion: '',
  }
}

// Sirve para crear (/admin/productos/nuevo) y para editar (/admin/productos/:codigo).
function AdminProductoFormView({ productos = [], categorias = [], onCrear, onEditar }) {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const existente = codigo ? buscarProducto(productos, codigo) : null

  const [datos, setDatos] = useState(() =>
    existente ? { ...existente, precio: String(existente.precio) } : datosVacios(categorias)
  )
  const [error, setError] = useState('')

  if (codigo && !existente) {
    return (
      <Alert variant="warning">
        No encontramos el producto {codigo}. <Link to="/admin/productos">Volver al listado</Link>
      </Alert>
    )
  }

  function cambiar(campo) {
    return (event) => {
      const valor = event.target.value
      setDatos((previo) => ({ ...previo, [campo]: valor }))
    }
  }

  function guardar(event) {
    event.preventDefault()

    const resultado = codigo ? onEditar(codigo, datos) : onCrear(datos)

    if (resultado.error) {
      setError(resultado.error)
      return
    }

    navigate('/admin/productos')
  }

  return (
    <section>
      <h1 className="mb-3">{codigo ? 'Editar producto' : 'Nuevo producto'}</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate onSubmit={guardar}>
        <Row className="g-3 mb-3">
          <Col xs={12} md={4}>
            <Form.Label htmlFor="codigo">Código</Form.Label>
            <Form.Control
              id="codigo"
              value={datos.codigo}
              disabled={Boolean(codigo)}
              onChange={cambiar('codigo')}
            />
          </Col>
          <Col xs={12} md={8}>
            <Form.Label htmlFor="nombre">Nombre</Form.Label>
            <Form.Control id="nombre" value={datos.nombre} onChange={cambiar('nombre')} />
          </Col>
          <Col xs={12} md={4}>
            <Form.Label htmlFor="categoria">Categoría</Form.Label>
            <Form.Select id="categoria" value={datos.categoria} onChange={cambiar('categoria')}>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={4}>
            <Form.Label htmlFor="precio">Precio (CLP)</Form.Label>
            <Form.Control
              id="precio"
              type="number"
              value={datos.precio}
              onChange={cambiar('precio')}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Label htmlFor="fabricante">Fabricante</Form.Label>
            <Form.Control
              id="fabricante"
              value={datos.fabricante}
              onChange={cambiar('fabricante')}
            />
          </Col>
          <Col xs={12}>
            <Form.Label htmlFor="descripcion">Descripción</Form.Label>
            <Form.Control
              id="descripcion"
              as="textarea"
              rows={3}
              value={datos.descripcion}
              onChange={cambiar('descripcion')}
            />
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button type="submit" className="btn-gamer">
            {codigo ? 'Guardar cambios' : 'Crear producto'}
          </Button>
          <Button as={Link} to="/admin/productos" variant="outline-light">
            Cancelar
          </Button>
        </div>
      </Form>
    </section>
  )
}

export default AdminProductoFormView
