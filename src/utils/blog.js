// Búsqueda de artículos del blog. Es una función pura: recibe la lista por parámetro.
export function buscarArticulo(articulos, id) {
  return articulos.find((articulo) => String(articulo.id) === String(id)) || null
}
