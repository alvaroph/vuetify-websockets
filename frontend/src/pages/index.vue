<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <h1 class="text-h4 text-center mb-4">Buscador de Películas </h1>
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
import { ref } from 'vue';
import LiveSearches from '@/components/LiveSearches.vue';
import websocketManager from '@/services/websocketManager.js';
import fetchManager from '@/services/fetchManager.js';

const searchQuery = ref('');
const movies = ref([]);
const loading = ref(false);
const error = ref(null);

const handleTyping = () => {
  websocketManager.sendMessage('typing', searchQuery.value);
};

const handleSearch = () => {
  websocketManager.sendMessage('search', searchQuery.value);
  searchMovies();
};

const searchMovies = async () => {
  if (!searchQuery.value) {
    error.value = 'Por favor, introduce un término de búsqueda.';
    return;
  }

  loading.value = true;
  error.value = null;
  movies.value = [];

  try {
    const data = await fetchManager.fetchFromOMDb(searchQuery.value);

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
