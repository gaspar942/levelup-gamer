// Arma los enlaces para compartir un producto en redes sociales.

export function construirEnlacesCompartir(producto, url) {
  const texto = `Mira ${producto.nombre} en Level-Up Gamer por $${producto.precio.toLocaleString('es-CL')} CLP`
  const textoCodificado = encodeURIComponent(texto)
  const urlCodificada = encodeURIComponent(url)

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`,
    x: `https://twitter.com/intent/tweet?text=${textoCodificado}&url=${urlCodificada}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${urlCodificada}`,
  }
}
