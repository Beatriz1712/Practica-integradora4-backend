  # PRACTICA INTEGRADORA 4 - BACKEND
  Este proyecto es una aplicación en Node.js que gestiona productos y carritos de compras, con funcionalidades avanzadas de gestión de usuarios y productos. Utiliza Handlebars para renderizar vistas, MongoDB para la persistencia de datos y cuenta con un sistema de autenticación y autorización para diferentes roles de usuario.

 En esta Versión : 
 se incluye en el schema del user las propiedades de "documents" donde se almacenara los archivos cargados por los usuarios, y "last-connection" que almacena en la base de datos la fecha de la ultima vez que el usuario haga login o logout.

Tambien se incluye una opcion de validacion para que los usuarios normales de tipo "user" puedan subir su rango a usuario de tipo "premium" que les permita cargar productos al sistema. Este sistema de validacion requiere que el usuario cargue tres documentos: identificacion, comprobante de domicilio y comprobante de estado de cuenta. Una vez cargados estos archivos, el usuario puede actualizar su rol y cambiar a premium
