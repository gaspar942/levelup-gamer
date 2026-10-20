# Level-Up Gamer

Tienda online de productos gamer, desarrollada como frontend con **React** y **Bootstrap**.
Proyecto de la Evaluación Parcial 2 de **Desarrollo Fullstack II (DSY1104)**, Duoc UC, sección ES007V.

**Integrantes:** Gaspar Ríos y Gonzalo Hernández.
**Docente:** Fabián Marcelo Navarro Abarca.

No hay backend: los datos salen de archivos JavaScript (`src/data`) y se guardan en el navegador
(`localStorage` y `sessionStorage`).

## Funciones

**Tienda (pública)**
- Inicio con carrusel, catálogo con filtros y buscador, detalle de producto, categorías y ofertas.
- Carrito de compras con descuento, checkout con validación de datos y resultado de pago
  (compra exitosa o pago con error, con opción de reintentar).
- Registro (solo mayores de 18 años), inicio de sesión y perfil con puntos y nivel (Bronce, Plata, Oro).
- Descuento de 20 % para correos Duoc y código de referido que suma puntos.
- Reseñas de productos, blog con detalle, eventos, nosotros y contacto.

**Panel de administración (`/admin`)**
- Dashboard, órdenes con boleta, CRUD de productos, productos críticos (stock de 5 o menos) y reporte de productos.
- CRUD de categorías y de usuarios, con historial de compras por usuario.
- Reportes de ventas y perfil del administrador.

## Tecnologías

| Uso | Herramienta |
|---|---|
| Interfaz | React 19 |
| Construcción | Vite 7 |
| Navegación | react-router-dom 7 |
| Diseño responsivo | Bootstrap 5 y react-bootstrap |
| Pruebas | Vitest, Testing Library y jsdom |
| Cobertura | @vitest/coverage-v8 |

## Cómo ejecutarlo

Requiere Node.js.

```bash
npm install
npm run dev
```

Abrir http://localhost:5173.

## Cuenta de demostración del administrador

- Correo: `admin@levelup.cl`
- Contraseña: `admin123`

Está escrita en el código solo porque es una demostración sin backend. En un sistema real la
autenticación se hace en el servidor.

## Pruebas y cobertura

```bash
npm test            # pruebas en modo vigilancia
npm run test:run    # todas las pruebas una vez
npm run coverage    # pruebas con reporte de cobertura (carpeta coverage)
```

Estado actual: 71 archivos de prueba y 337 pruebas, todas aprobadas.
Cobertura global: 97,97 % de sentencias, 97,13 % de ramas, 94,05 % de funciones y 97,97 % de líneas.

Se usa Vitest en lugar de Jasmine y Karma por indicación del docente.

## Estructura

```
src/
  App.jsx          Estado centralizado de la aplicación y rutas
  views/           Una vista por página; views/admin para el panel
  components/      Componentes reutilizables (tarjeta de producto, navbar, formularios)
  data/            Fuente de datos simulada (productos, categorías, ofertas, blog, eventos)
  utils/           Lógica de negocio en funciones puras; almacenamiento.js es el único
                   archivo que toca localStorage y sessionStorage
  tests/           Pruebas con Vitest y Testing Library
public/img/        Fotos de los productos (nombre = código del producto)
```

## Convenciones

- Nombres en español y componentes de una sola responsabilidad.
- La lógica de negocio vive en `utils` como funciones puras, para poder probarla sin la interfaz.
- Estilos propios con las clases `btn-gamer`, `card-gamer` y `precio`.
