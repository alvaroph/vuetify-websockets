// Importamos la clase WebSocketServer desde la librería 'ws'.
// La librería 'ws' es una de las más populares para crear servidores de WebSocket en Node.js.
import { WebSocketServer } from 'ws';

// Creamos una nueva instancia del servidor de WebSocket.
// Le pasamos un objeto de configuración que especifica el puerto en el que escuchará.
// En este caso, el servidor estará disponible en 'ws://localhost:8080'.
const wss = new WebSocketServer({ port: 8080 });

// Imprimimos un mensaje en la consola para saber que el servidor se ha iniciado correctamente.
console.log('Servidor WebSocket iniciado en el puerto 8080');

// El evento 'connection' se dispara cada vez que un nuevo cliente (un navegador) se conecta al servidor.
// La función callback recibe un objeto 'ws' (WebSocket) que representa la conexión con ese cliente específico.
wss.on('connection', function connection(ws) {
  console.log('Un cliente se ha conectado');

  // Escuchamos si ocurre algún error en esta conexión específica.
  ws.on('error', console.error);

  // El evento 'message' se dispara cuando el servidor recibe un mensaje de este cliente.
  // El parámetro 'data' contiene la información enviada por el cliente.
  ws.on('message', function message(data) {
    console.log('Mensaje recibido: %s', data);

    // El objetivo es notificar a todos los demás usuarios de la actividad de un usuario.
    // Por lo tanto, vamos a reenviar (retransmitir o "broadcast") el mensaje recibido a TODOS los clientes conectados.
    // 'wss.clients' es un Set (una colección de elementos únicos) que contiene todos los clientes conectados actualmente.
    wss.clients.forEach(function each(client) {
      // Comprobamos dos cosas:
      // 1. 'client !== ws': No queremos enviar el mensaje de vuelta al mismo cliente que lo envió.
      // 2. 'client.readyState === 1': Nos aseguramos de que la conexión con el cliente esté abierta y lista para recibir mensajes.
      //    (El estado 1 corresponde a WebSocket.OPEN)
      if (client !== ws && client.readyState === 1) {
        // Enviamos el mensaje al cliente. Es importante convertir 'data' a string.
        client.send(data.toString());
      }
    });
  });

  // El evento 'close' se dispara cuando un cliente se desconecta.
  ws.on('close', () => {
    console.log('Un cliente se ha desconectado');
  });
});
