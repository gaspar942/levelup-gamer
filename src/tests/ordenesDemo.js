// Órdenes de ejemplo para las pruebas del panel de administrador (no es una prueba en sí).
export function ordenDemo(cambios = {}) {
  return {
    numero: '2026102001',
    estado: 'pagada',
    motivo: '',
    fecha: '2026-10-20',
    cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@duocuc.cl' },
    direccion: {
      calle: 'Los Aromos 123',
      departamento: '',
      region: 'Región Metropolitana de Santiago',
      comuna: 'Maipú',
      indicaciones: '',
    },
    items: [{ codigo: 'MS001', nombre: 'Mouse G203', precio: 20000, cantidad: 2 }],
    subtotal: 40000,
    descuento: 0,
    total: 40000,
    ...cambios,
  }
}
