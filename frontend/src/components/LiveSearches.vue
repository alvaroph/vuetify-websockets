<template>
  <v-card>
    <v-card-title>Actividad en Tiempo Real</v-card-title>
    <v-divider></v-divider>
    <v-list lines="one" density="compact">
      <v-list-item v-if="events.length === 0">
        <v-list-item-title class="text-grey">Esperando actividad...</v-list-item-title>
      </v-list-item>
      <v-list-item v-for="(event, i) in events" :key="i" :class="event.type === 'search' ? 'font-weight-bold' : ''">
        <v-list-item-title>
          <span v-if="event.type === 'typing'">Escribiendo:</span>
          <span v-if="event.type === 'search'">Búsqueda:</span>
          <span class="ml-2">'{{ event.term }}'</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import websocketManager from '@/services/websocketManager.js';

const events = websocketManager.events;
</script>

<style scoped>
.font-weight-bold {
  background-color: #E3F2FD; /* Un color de fondo sutil para destacar */
}
</style>