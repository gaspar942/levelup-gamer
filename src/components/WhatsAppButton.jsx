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
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 1050,
        background: '#39ff14',
        color: '#000000',
        fontWeight: 700,
        padding: '12px 18px',
        borderRadius: 999,
        textDecoration: 'none',
        boxShadow: '0 0 12px rgba(57, 255, 20, 0.6)',
      }}
    >
      Soporte WhatsApp
    </a>
  )
}

export default WhatsAppButton
