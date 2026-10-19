import { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import OrdenItems from '../components/OrdenItems'
import { regiones } from '../data/regiones'
import { aplicarDescuento, calcularTotal } from '../utils/carrito'
import { validarCheckout } from '../utils/checkout'

// Si hay sesión iniciada, el nombre y el correo se completan solos.
function datosIniciales(usuario, datosPrevios) {
  if (datosPrevios) {
    return { ...datosPrevios }
  }

  return {
    nombre: usuario ? usuario.nombre : '',
    apellidos: '',
    correo: usuario ? usuario.correo : '',
    calle: '',
    departamento: '',
    region: regiones[0].nombre,
    comuna: '',
    indicaciones: '',
  }
}

function CheckoutView({ carrito, descuento = 0, usuario = null, onPagar }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [datos, setDatos] = useState(() =>
    datosIniciales(usuario, location.state && location.state.datos)
  )
  const [errores, setErrores] = useState({})

  if (carrito.length === 0) {
    return (
      <section>
        <h1>Checkout</h1>
        <p>Tu carrito está vacío, agrega productos para poder pagar.</p>
        <Button as={Link} to="/productos" className="btn-gamer">
          Ver productos
        </Button>
      </section>
    )
  }

  const subtotal = calcularTotal(carrito)
  const { monto, totalFinal } = aplicarDescuento(subtotal, descuento)
  const comunas = (regiones.find((region) => region.nombre === datos.region) || regiones[0])
    .comunas

  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos((anterior) => ({ ...anterior, [name]: value }))
  }

  function cambiarRegion(evento) {
    // Al cambiar de región la comuna anterior deja de ser válida.
    setDatos((anterior) => ({ ...anterior, region: evento.target.value, comuna: '' }))
  }

  function enviar(evento) {
    evento.preventDefault()
    const encontrados = validarCheckout(datos)
    setErrores(encontrados)

    if (Object.keys(encontrados).length > 0) {
      return
    }

    const orden = onPagar(datos)
    const ruta = orden.estado === 'pagada' ? 'compra-exitosa' : 'pago-error'
    navigate(`/${ruta}/${orden.numero}`)
  }

  return (
    <section>
      <h1 className="mb-3">Checkout</h1>

      <OrdenItems items={carrito} />

      <div className="text-end mb-4">
        {monto > 0 && (
          <p className="mb-1">
            Descuento Duoc ({Math.round(descuento * 100)}%): -${monto.toLocaleString('es-CL')} CLP
          </p>
        )}
        <h4>
          Total a pagar: <span className="precio">${totalFinal.toLocaleString('es-CL')} CLP</span>
        </h4>
      </div>

      <Form noValidate onSubmit={enviar} aria-label="Formulario de compra">
        <h2 className="h5">Información del cliente</h2>
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Group controlId="checkout-nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={datos.nombre}
                onChange={cambiar}
                isInvalid={Boolean(errores.nombre)}
              />
              <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="checkout-apellidos">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                name="apellidos"
                value={datos.apellidos}
                onChange={cambiar}
                isInvalid={Boolean(errores.apellidos)}
              />
              <Form.Control.Feedback type="invalid">{errores.apellidos}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group controlId="checkout-correo">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={datos.correo}
                onChange={cambiar}
                isInvalid={Boolean(errores.correo)}
              />
              <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <h2 className="h5">Dirección de entrega de los productos</h2>
        <Row className="g-3 mb-4">
          <Col md={8}>
            <Form.Group controlId="checkout-calle">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                name="calle"
                value={datos.calle}
                onChange={cambiar}
                isInvalid={Boolean(errores.calle)}
              />
              <Form.Control.Feedback type="invalid">{errores.calle}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="checkout-departamento">
              <Form.Label>Departamento (opcional)</Form.Label>
              <Form.Control
                name="departamento"
                placeholder="Ej: 603"
                value={datos.departamento}
                onChange={cambiar}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="checkout-region">
              <Form.Label>Región</Form.Label>
              <Form.Select
                name="region"
                value={datos.region}
                onChange={cambiarRegion}
                isInvalid={Boolean(errores.region)}
              >
                {regiones.map((region) => (
                  <option key={region.nombre} value={region.nombre}>
                    {region.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="checkout-comuna">
              <Form.Label>Comuna</Form.Label>
              <Form.Select
                name="comuna"
                value={datos.comuna}
                onChange={cambiar}
                isInvalid={Boolean(errores.comuna)}
              >
                <option value="">Selecciona una comuna</option>
                {comunas.map((comuna) => (
                  <option key={comuna} value={comuna}>
                    {comuna}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group controlId="checkout-indicaciones">
              <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="indicaciones"
                placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
                value={datos.indicaciones}
                onChange={cambiar}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-end">
          <Button type="submit" className="btn-gamer">
            Pagar ahora ${totalFinal.toLocaleString('es-CL')}
          </Button>
        </div>
      </Form>
    </section>
  )
}

export default CheckoutView
