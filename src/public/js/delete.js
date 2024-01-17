
// delete 
document.querySelectorAll('.delete-product-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const cartId = this.dataset.cartid;
        const productId = this.dataset.productid;

        fetch(`/cart/${cartId}/products/${productId}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
              console.log("Producto eliminado");
              // Redirigir al carrito después de eliminar el producto
              window.location.href = "/cart"; // Reemplaza '/cart' con la URL real de tu página del carrito
              // Lógica para eliminar el elemento del DOM o recargar la página
              alert("Producto eliminado");
              
            } else {
                // Manejar errores
                console.error('Error al eliminar el producto');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });
});
