// CRUD del catálogo (productos y categorías). Son funciones puras: reciben la lista
// actual y devuelven la lista nueva, o un { error } si la operación no es válida.
// Nunca modifican los datos que reciben.

const ERROR_PRECIO = 'El precio debe ser un número entero mayor a 0.'

// Limpia y valida los campos editables de un producto.
function validarDatos(datos, categorias) {
  const nombre = String(datos.nombre ?? '').trim()
  const categoria = String(datos.categoria ?? '').trim()
  const precio = Number(datos.precio)

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  if (!categorias.includes(categoria)) {
    return { error: 'Elige una categoría válida.' }
  }

  if (!Number.isInteger(precio) || precio <= 0) {
    return { error: ERROR_PRECIO }
  }

  return {
    valores: {
      fabricante: String(datos.fabricante ?? '').trim(),
      categoria,
      nombre,
      precio,
      descripcion: String(datos.descripcion ?? '').trim(),
    },
  }
}

// ---------- Productos ----------

export function crearProducto(productos, categorias, datos) {
  const codigo = String(datos.codigo ?? '').trim().toUpperCase()

  if (!codigo) {
    return { error: 'El código es obligatorio.' }
  }

  if (productos.some((producto) => producto.codigo === codigo)) {
    return { error: 'Ya existe un producto con ese código.' }
  }

  const validado = validarDatos(datos, categorias)

  if (validado.error) {
    return { error: validado.error }
  }

  const producto = { codigo, ...validado.valores }

  return { productos: [...productos, producto], producto }
}

export function buscarProducto(productos, codigo) {
  return productos.find((producto) => producto.codigo === codigo) || null
}

// El código identifica al producto, por eso no se puede cambiar al editar.
export function actualizarProducto(productos, categorias, codigo, cambios) {
  const existente = buscarProducto(productos, codigo)

  if (!existente) {
    return { error: 'El producto no existe.' }
  }

  const validado = validarDatos({ ...existente, ...cambios }, categorias)

  if (validado.error) {
    return { error: validado.error }
  }

  const producto = { codigo: existente.codigo, ...validado.valores }

  return {
    productos: productos.map((item) => (item.codigo === codigo ? producto : item)),
    producto,
  }
}

export function eliminarProducto(productos, codigo) {
  const existente = buscarProducto(productos, codigo)

  if (!existente) {
    return { error: 'El producto no existe.' }
  }

  return {
    productos: productos.filter((producto) => producto.codigo !== codigo),
    producto: existente,
  }
}

// ---------- Categorías ----------

function existeCategoria(categorias, nombre, ignorar = null) {
  return categorias.some(
    (categoria) =>
      categoria !== ignorar && categoria.toLowerCase() === nombre.toLowerCase()
  )
}

export function crearCategoria(categorias, nombre) {
  const limpio = String(nombre ?? '').trim()

  if (!limpio) {
    return { error: 'El nombre de la categoría es obligatorio.' }
  }

  if (existeCategoria(categorias, limpio)) {
    return { error: 'Esa categoría ya existe.' }
  }

  return { categorias: [...categorias, limpio] }
}

// Al renombrar una categoría también se actualizan los productos que la usan.
export function renombrarCategoria(categorias, productos, actual, nuevo) {
  if (!categorias.includes(actual)) {
    return { error: 'La categoría no existe.' }
  }

  const limpio = String(nuevo ?? '').trim()

  if (!limpio) {
    return { error: 'El nombre de la categoría es obligatorio.' }
  }

  if (existeCategoria(categorias, limpio, actual)) {
    return { error: 'Esa categoría ya existe.' }
  }

  return {
    categorias: categorias.map((categoria) => (categoria === actual ? limpio : categoria)),
    productos: productos.map((producto) =>
      producto.categoria === actual ? { ...producto, categoria: limpio } : producto
    ),
  }
}

export function eliminarCategoria(categorias, productos, nombre) {
  if (!categorias.includes(nombre)) {
    return { error: 'La categoría no existe.' }
  }

  if (productos.some((producto) => producto.categoria === nombre)) {
    return { error: 'No puedes eliminar una categoría que tiene productos.' }
  }

  return { categorias: categorias.filter((categoria) => categoria !== nombre) }
}
