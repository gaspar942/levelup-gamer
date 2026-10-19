import { Badge } from 'react-bootstrap'
import { aplicarOferta } from '../utils/ofertas'

// Muestra el precio de un producto: si tiene oferta, el precio original tachado,
// el porcentaje de descuento y el precio rebajado. Quien lo usa pone el contenedor.
function PrecioProducto({ producto }) {
  const conOferta = aplicarOferta(producto)

  return (
    <>
      {conOferta.precioOriginal !== undefined && (
        <>
          <s className="text-secondary me-2">
            {`$${conOferta.precioOriginal.toLocaleString('es-CL')}`}
          </s>
          <Badge bg="danger" className="me-2">
            {`-${conOferta.porcentajeOferta}%`}
          </Badge>
        </>
      )}
      ${conOferta.precio.toLocaleString('es-CL')} CLP
    </>
  )
}

export default PrecioProducto
