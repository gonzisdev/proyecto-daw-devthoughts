import server from "./server.js"

// Configuracion del puerto. Se usa el puerto definido en las variables de entorno o el 4000 por defecto
const PORT = process.env.PORT || 4000;

// Iniciamos el servidor
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));