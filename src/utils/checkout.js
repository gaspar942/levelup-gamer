// Lógica del checkout y de las órdenes. Son funciones puras, sin storage.
import { aplicarDescuento, calcularTotal } from './carrito'

export const PROBABILIDAD_RECHAZO = 0.2

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarCheckout(datos) {
  const errores = {}

  if (!datos.nombre.trim()) errores.nombre = 'Ingresa tu nombre.'
  if (!datos.apellidos.trim()) errores.apellidos = 'Ingresa tus apellidos.'

  if (!datos.correo.trim()) {
    errores.correo = 'Ingresa tu correo.'
  } else if (!FORMATO_CORREO.test(datos.correo.trim())) {
    errores.correo = 'El correo no tiene un formato válido.'
  }

  if (!datos.calle.trim()) errores.calle = 'Ingresa la calle y el número.'
  if (!datos.region) errores.region = 'Selecciona una región.'
  if (!datos.comuna) errores.comuna = 'Selecciona una comuna.'

  return errores
}

// El número de orden es la fecha (AAAAMMDD) más un correlativo del día.
export function generarNumeroOrden(ordenes, fecha = new Date()) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  const prefijo = `${fecha.getFullYear()}${mes}${dia}`
  const delDia = ordenes.filter((orden) => orden.numero.startsWith(prefijo)).length

  return `${prefijo}${String(delDia + 1).padStart(2, '0')}`
}

// Simula la pasarela de pago. El generador de azar se puede inyectar
// para que los tests no dependan de Math.random.
export function procesarPago(azar = Math.random) {
  if (azar() < PROBABILIDAD_RECHAZO) {
    return { ok: false, motivo: 'El banco rechazó la transacción.' }
  }

  return { ok: true }
}

export function crearOrden({
  carrito,
  datos,
  descuento = 0,
  ordenes = [],
  resultadoPago,
  fecha = new Date(),
}) {
  const subtotal = calcularTotal(carrito)
  const { monto, totalFinal } = aplicarDescuento(subtotal, descuento)

  return {
    numero: generarNumeroOrden(ordenes, fecha),
    estado: resultadoPago.ok ? 'pagada' : 'rechazada',
    motivo: resultadoPago.ok ? '' : resultadoPago.motivo,
    fecha: fecha.toISOString().slice(0, 10),
    cliente: {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim().toLowerCase(),
    },
    direccion: {
      calle: datos.calle.trim(),
      departamento: datos.departamento.trim(),
      region: datos.region,
      comuna: datos.comuna,
      indicaciones: datos.indicaciones.trim(),
    },
    items: carrito.map(({ codigo, nombre, precio, cantidad }) => ({
      codigo,
      nombre,
      precio,
      cantidad,
    })),
    subtotal,
    descuento: monto,
    total: totalFinal,
  }
}

export function buscarOrden(ordenes, numero) {
  return ordenes.find((orden) => orden.numero === numero) || null
}

// Junta cliente y dirección en el formato que usa el formulario.
export function datosDesdeOrden(orden) {
  return { ...orden.cliente, ...orden.direccion }
}
