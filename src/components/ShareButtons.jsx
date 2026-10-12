import { construirEnlacesCompartir } from '../utils/compartir'

function ShareButtons({ producto }) {
  const url = `${window.location.origin}/producto/${producto.codigo}`
  const enlaces = construirEnlacesCompartir(producto, url)

  return (
    <div className="mt-3">
      <p className="mb-2">Compartir este producto:</p>

      <div className="d-flex gap-2 flex-wrap">
        <a
          className="btn btn-outline-light"
          href={enlaces.whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          Compartir en WhatsApp
        </a>
        <a
          className="btn btn-outline-light"
          href={enlaces.x}
          target="_blank"
          rel="noreferrer"
        >
          Compartir en X
        </a>
        <a
          className="btn btn-outline-light"
          href={enlaces.facebook}
          target="_blank"
          rel="noreferrer"
        >
          Compartir en Facebook
        </a>
      </div>
    </div>
  )
}

export default ShareButtons
