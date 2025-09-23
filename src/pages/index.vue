<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <h1 class="text-h4 text-center mb-4">Buscador de Películas</h1>
        <v-card class="pa-4 mb-4">
          <v-text-field
            v-model="searchQuery"
            label="Nombre de la película"
            variant="solo-filled"
            @keyup.enter="handleSearch"
            @input="handleTyping"
          ></v-text-field>
          <v-btn
            color="primary"
            @click="handleSearch"
            :loading="loading"
            block
          >
            Buscar
          </v-btn>
        </v-card>

        <v-row v-if="error" class="mt-4">
          <v-col>
            <v-alert type="error" dismissible>{{ error }}</v-alert>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col
            v-for="movie in movies"
            :key="movie.imdbID"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card>
              <v-img
                :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Image'"
                height="450px"
                cover
              ></v-img>
              <v-card-title>{{ movie.Title }}</v-card-title>
              <v-card-subtitle>{{ movie.Year }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="4">
        <LiveSearches />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LiveSearches from '@/components/LiveSearches.vue';

const searchQuery = ref('');
const movies = ref([]);
const loading = ref(false);
const error = ref(null);

let socket = null;

// --- WebSocket Logic ---
onMounted(() => {
  socket = new WebSocket('ws://localhost:8080');
  socket.onopen = () => console.log('Conectado al servidor WebSocket para enviar eventos.');
  socket.onerror = (error) => console.error('Error en el WebSocket de envío:', error);
  socket.onclose = () => console.log('Desconectado del servidor WebSocket de envío.');
});

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});

function sendSocketMessage(type, term) {
  if (socket && socket.readyState === 1) { // 1 is OPEN
    const message = JSON.stringify({ type, term });
    socket.send(message);
  }
}

const handleTyping = () => {
      sendSocketMessage('typing', searchQuery.value);
};

const handleSearch = () => {
  sendSocketMessage('search', searchQuery.value);
  searchMovies();
};

// --- Movie Search Logic (OMDb) ---
const searchMovies = async () => {
  if (!searchQuery.value) {
    error.value = 'Por favor, introduce un término de búsqueda.';
    return;
  }

  loading.value = true;
  error.value = null;
  movies.value = [];

  try {
    const apiKey = '19f8a30e'; // Reemplaza con tu API Key
    const response = await fetch(`http://www.omdbapi.com/?s=${searchQuery.value}&apikey=${apiKey}&type=movie`);

    if (!response.ok) {
      throw new Error('Error en la respuesta de la red');
    }

    const data = await response.json();

    if (data.Response === 'True') {
      movies.value = data.Search.slice(0, 10);
    } else {
      error.value = data.Error || 'No se encontraron películas.';
    }
  } catch (err) {
    console.error(err);
    error.value = 'Ocurrió un error al contactar con la API. Inténtalo de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}
.v-card:hover {
  transform: scale(1.03);
}
</style>
