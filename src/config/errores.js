const errores = {
    PRODUCTO_NO_ENCONTRADO: 'El producto no se ha encontrado.',
    PRODUCTO_EXISTE: 'El producto ya existe.',
    ERROR_CREAR_PRODUCTO: 'Se produjo un error al crear el producto.',
    ERROR_AGREGAR_CARRITO: 'Se produjo un error al agregar el producto al carrito.',
    ERROR_OBTENER_PRODUCTOS: 'Error al obtener productos desde la base de datos.',
  };
  
  function manejarError(codigoError) {
    const mensajeError = errores[codigoError] || 'Error desconocido';
    return { error: mensajeError };
  }
  
  export { manejarError };
  