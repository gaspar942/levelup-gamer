import OrdenItems from './OrdenItems'

// Muestra los datos del cliente, la dirección y los productos de una orden ya creada.
function OrdenDetalle({ orden }) {
  const { cliente, direccion } = orden

  return (
    <div>
      <h2 className="h5">Cliente</h2>
      <p className="mb-3">
        {cliente.nombre} {cliente.apellidos}
        <br />
        {cliente.correo}
      </p>

      <h2 className="h5">Dirección de entrega</h2>
      <p className="mb-3">
        {direccion.calle}
        {direccion.departamento && `, depto ${direccion.departamento}`}
        <br />
        {direccion.comuna}, {direccion.region}
        {direccion.indicaciones && (
          <>
            <br />
            Indicaciones: {direccion.indicaciones}
          </>
        )}
      </p>

      <OrdenItems items={orden.items} />

      <div className="text-end">
        <p className="mb-1">Subtotal: ${orden.subtotal.toLocaleString('es-CL')} CLP</p>
        {orden.descuento > 0 && (
          <p className="mb-1">
            Descuento Duoc: -${orden.descuento.toLocaleString('es-CL')} CLP
          </p>
        )}
        <h4>
          Total: <span className="precio">${orden.total.toLocaleString('es-CL')} CLP</span>
        </h4>
      </div>
    </div>
  )
}

export default OrdenDetalle
