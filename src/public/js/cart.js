//  solicitud para obtener el cartId del servidor
fetch("/getCartId")
  .then((response) => response.json())
  .then((data) => {
    const cartId = data.cartId;
    
    // Utiliza cartId en las solicitudes posteriores
    fetch(`/cart/${cartId}/products`, {
      method: "POST",  
      // Resto de la configuración de la solicitud
    });
  });
