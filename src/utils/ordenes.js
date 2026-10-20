// Consultas sobre la lista de órdenes para el panel de administrador. Son funciones puras.

// Más recientes primero. El número de orden es AAAAMMDD + correlativo, así que ordena bien.
function masRecientesPrimero(ordenes) {
  return [...ordenes].sort((a, b) => b.numero.localeCompare(a.numero, 'es', { numeric: true }))
}

export function filtrarOrdenes(ordenes, estado = '') {
  const lista = estado ? ordenes.filter((orden) => orden.estado === estado) : ordenes

  return masRecientesPrimero(lista)
}

export function ordenesDeCliente(ordenes, correo) {
  const texto = String(correo ?? '').trim().toLowerCase()

  return masRecientesPrimero(ordenes.filter((orden) => orden.cliente.correo === texto))
}
