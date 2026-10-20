import { Table } from 'react-bootstrap'
import ImagenProducto from './ImagenProducto'

// Tabla de productos de una compra. Sirve para el checkout y para el resumen de la orden.
function OrdenItems({ items }) {
  return (
    <Table responsive variant="dark" className="align-middle">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.codigo}>
            <td>
              <div className="d-flex align-items-center gap-2">
                <ImagenProducto codigo={item.codigo} className="imagen-miniatura" />
                <span>{item.nombre}</span>
              </div>
            </td>
            <td>${item.precio.toLocaleString('es-CL')}</td>
            <td>{item.cantidad}</td>
            <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default OrdenItems
