// Cifras para el panel de reportes. Solo cuentan las órdenes pagadas.
// Son funciones puras: reciben las órdenes y los productos por parámetro.
import { stockDe } from './inventario'

export function ordenesPagadas(ordenes) {
  return ordenes.filter((orden) => orden.estado === 'pagada')
}

export function resumenOrdenes(ordenes) {
  const pagadas = ordenesPagadas(ordenes).length

  return { pagadas, rechazadas: ordenes.length - pagadas, total: ordenes.length }
}

export function totalVentas(ordenes) {
  return ordenesPagadas(ordenes).reduce((suma, orden) => suma + orden.total, 0)
}

// Unidades e ingresos por producto, de más a menos vendido.
export function ventasPorProducto(ordenes) {
  const mapa = new Map()

  ordenesPagadas(ordenes).forEach((orden) => {
    orden.items.forEach((item) => {
      const actual = mapa.get(item.codigo) || {
        codigo: item.codigo,
        nombre: item.nombre,
        unidades: 0,
        ingresos: 0,
      }

      actual.unidades += item.cantidad
      actual.ingresos += item.precio * item.cantidad
      mapa.set(item.codigo, actual)
    })
  })

  return [...mapa.values()].sort((a, b) => b.unidades - a.unidades || b.ingresos - a.ingresos)
}

// Agrupa las ventas por la categoría que tiene hoy el producto en el catálogo.
export function ventasPorCategoria(ordenes, productos) {
  const categoriaDe = new Map(productos.map((producto) => [producto.codigo, producto.categoria]))
  const mapa = new Map()

  ventasPorProducto(ordenes).forEach((venta) => {
    const categoria = categoriaDe.get(venta.codigo) || 'Sin categoría'
    const actual = mapa.get(categoria) || { categoria, unidades: 0, ingresos: 0 }

    actual.unidades += venta.unidades
    actual.ingresos += venta.ingresos
    mapa.set(categoria, actual)
  })

  return [...mapa.values()].sort((a, b) => b.ingresos - a.ingresos)
}

// Una fila por producto del catálogo con su stock y lo vendido (solo órdenes pagadas).
// Los productos sin ventas quedan al final, ordenados por nombre.
export function reporteProductos(ordenes, productos) {
  const vendidos = new Map(ventasPorProducto(ordenes).map((venta) => [venta.codigo, venta]))

  return productos
    .map((producto) => {
      const venta = vendidos.get(producto.codigo)

      return {
        codigo: producto.codigo,
        nombre: producto.nombre,
        categoria: producto.categoria,
        stock: stockDe(producto),
        unidades: venta ? venta.unidades : 0,
        ingresos: venta ? venta.ingresos : 0,
      }
    })
    .sort((a, b) => b.unidades - a.unidades || a.nombre.localeCompare(b.nombre))
}
