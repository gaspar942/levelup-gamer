// Lógica de stock. Son funciones puras: el inventario se recibe por parámetro
// (con la tabla de src/data como valor por defecto) para poder probarlas con otros datos.
import { inventario as inventarioBase } from '../data/inventario'

export const UMBRAL_CRITICO = 5

// El stock del propio producto manda; si no lo trae, se busca en el inventario.
// Si no hay dato en ninguno de los dos devuelve null (stock desconocido).
export function stockDe(producto, inventario = inventarioBase) {
  if (Number.isInteger(producto.stock)) {
    return producto.stock
  }

  return Number.isInteger(inventario[producto.codigo]) ? inventario[producto.codigo] : null
}

export function productosCriticos(productos, umbral = UMBRAL_CRITICO, inventario = inventarioBase) {
  return productos
    .map((producto) => ({ ...producto, stock: stockDe(producto, inventario) }))
    .filter((producto) => producto.stock !== null && producto.stock <= umbral)
    .sort((a, b) => a.stock - b.stock)
}
