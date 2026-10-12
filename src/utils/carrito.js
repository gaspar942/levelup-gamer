// Funciones puras para manejar el carrito. Cada item es un producto con su cantidad.

export function agregarAlCarrito(carrito, producto) {
  const existente = carrito.find((item) => item.codigo === producto.codigo)

  if (existente) {
    return carrito.map((item) =>
      item.codigo === producto.codigo
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    )
  }

  return [...carrito, { ...producto, cantidad: 1 }]
}

export function quitarDelCarrito(carrito, codigo) {
  return carrito.filter((item) => item.codigo !== codigo)
}

export function cambiarCantidad(carrito, codigo, cantidad) {
  if (cantidad < 1) {
    return quitarDelCarrito(carrito, codigo)
  }

  return carrito.map((item) =>
    item.codigo === codigo ? { ...item, cantidad } : item
  )
}

export function contarItems(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0)
}

export function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
}

export function aplicarDescuento(total, porcentaje) {
  const monto = Math.round(total * porcentaje)
  return { monto, totalFinal: total - monto }
}
