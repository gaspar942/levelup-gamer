// Lógica de ofertas. Son funciones puras: reciben las ofertas por parámetro
// (con la tabla del proyecto como valor por defecto) para poder probarlas con otros datos.
import { ofertas as ofertasBase } from '../data/ofertas'

// Devuelve el producto con el precio rebajado si tiene oferta, y guarda el precio original.
export function aplicarOferta(producto, ofertas = ofertasBase) {
  const porcentaje = ofertas[producto.codigo]

  // Si ya trae precio original, la oferta ya fue aplicada y no se descuenta dos veces.
  if (!porcentaje || producto.precioOriginal !== undefined) {
    return producto
  }

  return {
    ...producto,
    precio: Math.round((producto.precio * (100 - porcentaje)) / 100),
    precioOriginal: producto.precio,
    porcentajeOferta: porcentaje,
  }
}

export function productosConOferta(productos, ofertas = ofertasBase) {
  return productos
    .filter((producto) => Boolean(ofertas[producto.codigo]))
    .map((producto) => aplicarOferta(producto, ofertas))
}
