// Ruta de la foto de un producto: public/img/CODIGO.jpg (por ejemplo public/img/JM001.jpg).
export function rutaImagenProducto(codigo) {
  return `${import.meta.env.BASE_URL}img/${encodeURIComponent(codigo)}.jpg`
}
