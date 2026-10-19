import { useState } from 'react'
import { Alert, Badge, Button, Form, Table } from 'react-bootstrap'

function AdminCategoriasView({
  categorias = [],
  productos = [],
  onCrear,
  onRenombrar,
  onEliminar,
}) {
  const [nueva, setNueva] = useState('')
  const [editando, setEditando] = useState(null)
  const [nombreEditado, setNombreEditado] = useState('')
  const [aviso, setAviso] = useState(null)

  // Muestra el aviso según el resultado y devuelve true si la operación salió bien.
  function avisar(resultado, textoExito) {
    setAviso(
      resultado.error
        ? { tipo: 'danger', texto: resultado.error }
        : { tipo: 'success', texto: textoExito }
    )

    return !resultado.error
  }

  function crear(event) {
    event.preventDefault()

    if (avisar(onCrear(nueva), `Categoría "${nueva.trim()}" creada.`)) {
      setNueva('')
    }
  }

  function empezarEdicion(categoria) {
    setEditando(categoria)
    setNombreEditado(categoria)
  }

  function guardarEdicion(event) {
    event.preventDefault()

    if (avisar(onRenombrar(editando, nombreEditado), `Categoría renombrada a "${nombreEditado.trim()}".`)) {
      setEditando(null)
    }
  }

  function eliminar(categoria) {
    if (!window.confirm(`¿Eliminar la categoría "${categoria}"?`)) {
      return
    }

    avisar(onEliminar(categoria), `Categoría "${categoria}" eliminada.`)
  }

  return (
    <section>
      <h1 className="mb-3">Categorías</h1>

      {aviso && <Alert variant={aviso.tipo}>{aviso.texto}</Alert>}

      <Form onSubmit={crear} className="mb-4">
        <Form.Label htmlFor="nueva-categoria">Nueva categoría</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            id="nueva-categoria"
            value={nueva}
            onChange={(event) => setNueva(event.target.value)}
          />
          <Button type="submit" className="btn-gamer">
            Agregar categoría
          </Button>
        </div>
      </Form>

      <Table responsive variant="dark" className="align-middle">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Productos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) =>
            editando === categoria ? (
              <tr key={categoria}>
                <td colSpan={3}>
                  <Form onSubmit={guardarEdicion} className="d-flex gap-2">
                    <Form.Control
                      aria-label={`Nuevo nombre de ${categoria}`}
                      value={nombreEditado}
                      onChange={(event) => setNombreEditado(event.target.value)}
                    />
                    <Button type="submit" className="btn-gamer">
                      Guardar
                    </Button>
                    <Button
                      type="button"
                      variant="outline-light"
                      onClick={() => setEditando(null)}
                    >
                      Cancelar
                    </Button>
                  </Form>
                </td>
              </tr>
            ) : (
              <tr key={categoria}>
                <td>{categoria}</td>
                <td>
                  <Badge bg="secondary">
                    {productos.filter((producto) => producto.categoria === categoria).length}
                  </Badge>
                </td>
                <td className="text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      size="sm"
                      variant="outline-light"
                      aria-label={`Renombrar ${categoria}`}
                      onClick={() => empezarEdicion(categoria)}
                    >
                      Renombrar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      aria-label={`Eliminar ${categoria}`}
                      onClick={() => eliminar(categoria)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </section>
  )
}

export default AdminCategoriasView
