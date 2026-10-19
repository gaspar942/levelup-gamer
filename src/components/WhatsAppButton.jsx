import { FaWhatsapp } from 'react-icons/fa'

// Cambia este número por el de soporte técnico (formato internacional, sin +).
export const NUMERO_SOPORTE = '56912345678'

const MENSAJE = 'Hola, necesito ayuda del servicio técnico de Level-Up Gamer.'

function WhatsAppButton() {
  const enlace = `https://wa.me/${NUMERO_SOPORTE}?text=${encodeURIComponent(MENSAJE)}`

  return (
    <a
      href={enlace}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar soporte técnico por WhatsApp"
      title="Soporte WhatsApp"
      style={{
        position: 'fixed',
        right: 14,
        bottom: 14,
        zIndex: 1050,
        width: 52,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#25d366',
        color: '#ffffff',
        fontSize: 30,
        borderRadius: '50%',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <FaWhatsapp aria-hidden="true" />
    </a>
  )
}

export default WhatsAppButton