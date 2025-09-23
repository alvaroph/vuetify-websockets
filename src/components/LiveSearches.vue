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
import communicationManager from '@/services/communicationManager.js';

// 'ref' crea una variable reactiva. Vue actualizará la vista automáticamente cuando esta variable cambie.
// 'events' almacenará la lista de mensajes que llegan desde el WebSocket.
const events = ref([]);

// Definimos una constante para limitar el número de eventos mostrados en la lista.
const MAX_EVENTS = 10;

const handleMessage = (message) => {
  try {
    const data = JSON.parse(message);
    events.value.unshift(data);
    if (events.value.length > MAX_EVENTS) {
      events.value.pop();
    }
  } catch (error) {
    console.error('Error al parsear el mensaje del WebSocket:', error);
  }
};

// 'onMounted' es un "lifecycle hook" de Vue. El código dentro de esta función
// se ejecuta una sola vez, justo después de que el componente ha sido añadido al DOM (a la página).
onMounted(() => {
  communicationManager.addListener(handleMessage);
});

// 'onUnmounted' es otro "lifecycle hook". Se ejecuta justo antes de que el componente sea
// eliminado del DOM. Es crucial para limpiar recursos y evitar fugas de memoria.
onUnmounted(() => {
  communicationManager.removeListener(handleMessage);
});
</script>

<style scoped>
/* Estilo para destacar las búsquedas confirmadas */
.font-weight-bold {
  background-color: #E3F2FD; /* Un color de fondo sutil para destacar */
}
</style>
