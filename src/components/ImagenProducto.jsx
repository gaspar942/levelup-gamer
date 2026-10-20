import { useState } from 'react'
import { rutaImagenProducto } from '../utils/imagenes'

// Foto del producto. Si el archivo no existe (por ejemplo un producto nuevo del panel
// de administrador) muestra un recuadro "Sin imagen". Sin nombre la imagen es decorativa.
function ImagenProducto({ codigo, nombre = '', className = '' }) {
  const [codigoFallido, setCodigoFallido] = useState(null)

  if (codigoFallido === codigo) {
    return (
      <div
        className={`sin-imagen ${className}`.trim()}
        role={nombre ? 'img' : undefined}
        aria-label={nombre ? `Sin imagen de ${nombre}` : undefined}
        aria-hidden={nombre ? undefined : true}
      >
        Sin imagen
      </div>
    )
  }

  return (
    <img
      className={className}
      src={rutaImagenProducto(codigo)}
      alt={nombre}
      loading="lazy"
      onError={() => setCodigoFallido(codigo)}
    />
  )
}

export default ImagenProducto
