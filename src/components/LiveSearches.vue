<template>
  <v-card>
    <v-card-title>Actividad en Tiempo Real</v-card-title>
    <v-divider></v-divider>
    <!-- Usamos v-list de Vuetify para mostrar los eventos -->
    <v-list lines="one" density="compact">
      <!-- Mensaje inicial si no hay eventos -->
      <v-list-item v-if="events.length === 0">
        <v-list-item-title class="text-grey">Esperando actividad...</v-list-item-title>
      </v-list-item>
      <!-- Iteramos sobre el array de eventos y creamos un item por cada uno -->
      <!-- Aplicamos una clase CSS si el evento es de tipo 'search' para destacarlo -->
      <v-list-item v-for="(event, i) in events" :key="i" :class="event.type === 'search' ? 'font-weight-bold' : ''">
        <v-list-item-title>
          <!-- Mostramos un texto diferente según el tipo de evento -->
          <span v-if="event.type === 'typing'">Escribiendo:</span>
          <span v-if="event.type === 'search'">Búsqueda:</span>
          <span class="ml-2">'{{ event.term }}'</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
// Importamos las funciones necesarias de Vue
import { ref, onMounted, onUnmounted } from 'vue';

// 'ref' crea una variable reactiva. Vue actualizará la vista automáticamente cuando esta variable cambie.
// 'events' almacenará la lista de mensajes que llegan desde el WebSocket.
const events = ref([]);
// 'socket' almacenará la instancia de nuestra conexión WebSocket.
let socket = null;

// Definimos una constante para limitar el número de eventos mostrados en la lista.
const MAX_EVENTS = 10;

// 'onMounted' es un "lifecycle hook" de Vue. El código dentro de esta función
// se ejecuta una sola vez, justo después de que el componente ha sido añadido al DOM (a la página).
// Es el lugar perfecto para iniciar conexiones, peticiones a APIs, etc.
onMounted(() => {
  // Creamos una nueva conexión WebSocket usando la API nativa del navegador.
  // La URL debe coincidir con la del servidor que hemos creado.
  socket = new WebSocket('ws://localhost:8080');

  // --- MANEJADORES DE EVENTOS DEL WEBSOCKET ---

  // 1. 'onopen': Se ejecuta cuando la conexión se ha establecido con éxito.
  socket.onopen = () => {
    console.log('Conectado al servidor WebSocket para recibir eventos.');
  };

  // 2. 'onmessage': Se ejecuta cada vez que recibimos un mensaje del servidor.
  socket.onmessage = (event) => {
    try {
      // Los datos del mensaje vienen en 'event.data' como un string.
      // Como sabemos que el servidor envía JSON, lo parseamos para convertirlo en un objeto JavaScript.
      const data = JSON.parse(event.data);
      
      // 'unshift' añade el nuevo evento al PRINCIPIO del array 'events'.
      // Esto hace que los eventos más nuevos aparezcan arriba en la lista.
      events.value.unshift(data);

      // Para que la lista no crezca indefinidamente, comprobamos si hemos superado el máximo.
      if (events.value.length > MAX_EVENTS) {
        // 'pop' elimina el último elemento del array (el más antiguo).
        events.value.pop();
      }
    } catch (error) {
      console.error('Error al parsear el mensaje del WebSocket:', error);
    }
  };

  // 3. 'onerror': Se ejecuta si ocurre algún error en la conexión.
  socket.onerror = (error) => {
    console.error('Error en el WebSocket:', error);
    // Añadimos un evento de error a la lista para que el usuario sepa que algo ha fallado.
    events.value.unshift({ type: 'error', term: 'Error de conexión' });
  };

  // 4. 'onclose': Se ejecuta cuando la conexión se cierra.
  socket.onclose = () => {
    console.log('Desconectado del servidor WebSocket.');
  };
});

// 'onUnmounted' es otro "lifecycle hook". Se ejecuta justo antes de que el componente sea
// eliminado del DOM. Es crucial para limpiar recursos y evitar fugas de memoria.
onUnmounted(() => {
  // Si la conexión WebSocket todavía existe, la cerramos limpiamente.
  if (socket) {
    socket.close();
  }
});
</script>

<style scoped>
/* Estilo para destacar las búsquedas confirmadas */
.font-weight-bold {
  background-color: #E3F2FD; /* Un color de fondo sutil para destacar */
}
</style>
