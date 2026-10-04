// Filtra el catálogo por categoría, texto de búsqueda y precio máximo.

export function filtrarProductos(productos, filtros = {}) {
  const { categoria = 'Todas', busqueda = '', precioMax = null } = filtros
  const texto = busqueda.trim().toLowerCase()

  return productos.filter((producto) => {
    const coincideCategoria =
      categoria === 'Todas' || producto.categoria === categoria

    const coincideTexto =
      texto === '' ||
      producto.nombre.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto)

    const coincidePrecio =
      precioMax === null || Number.isNaN(precioMax) || producto.precio <= precioMax

    return coincideCategoria && coincideTexto && coincidePrecio
  })
}
