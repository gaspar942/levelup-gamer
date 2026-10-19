import { useState } from 'react'
import { Alert, Button, Form, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { filtrarProductos } from '../../utils/filtros'

function AdminProductosView({ productos = [], onEliminar }) {
  const [busqueda, setBusqueda] = useState('')
  const [aviso, setAviso] = useState(null)

  const lista = filtrarProductos(productos, { busqueda })

  function eliminar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) {
      return
    }

    const resultado = onEliminar(producto.codigo)

    setAviso(
      resultado.error
        ? { tipo: 'danger', texto: resultado.error }
        : { tipo: 'success', texto: `Producto ${producto.codigo} eliminado.` }
    )
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Productos</h1>
        <Button as={Link} to="/admin/productos/nuevo" className="btn-gamer">
          Nuevo producto
        </Button>
      </div>

      {aviso && <Alert variant={aviso.tipo}>{aviso.texto}</Alert>}

      <Form.Label htmlFor="buscar-producto">Buscar producto</Form.Label>
      <Form.Control
        id="buscar-producto"
        className="mb-3"
        placeholder="Nombre o descripción"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      <p>{lista.length} producto(s)</p>

      <Table responsive variant="dark" className="align-middle">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lista.map((producto) => (
            <tr key={producto.codigo}>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>${producto.precio.toLocaleString('es-CL')}</td>
              <td className="text-end">
                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    as={Link}
                    to={`/admin/productos/${producto.codigo}`}
                    size="sm"
                    variant="outline-light"
                    aria-label={`Editar ${producto.nombre}`}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    aria-label={`Eliminar ${producto.nombre}`}
                    onClick={() => eliminar(producto)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {lista.length === 0 && <p>No hay productos que coincidan con la búsqueda.</p>}
    </section>
  )
}

export default AdminProductosView
