<template>
  <div class="flex flex-col min-h-screen">
    <div v-if="loading" class="flex-1 loading-container flex justify-center items-center h-200">
      <LoadingSpinner />
    </div>
    <div v-else class="max-w-[800px] mx-auto p-8">
      <h1 class="text-4xl font-bold mb-5 text-green-500">{{ meal.strMeal }}</h1>
      <img :src="meal.strMealThumb" :alt="meal.strMeal" class="max-w-[100%] mb-5">
      <div class="grid grid-cols-1 sm:grid-cols-3 text-lg py-2 mb-5">
        <div>
          <strong class="font-bold">Category:</strong> {{ meal.strCategory || 'Unknown' }}
        </div>
        <div>
          <strong class="font-bold">Area:</strong> {{ meal.strArea || 'Unknown' }}
        </div>
        <div>
          <strong class="font-bold">Tags:</strong> {{ meal.strTags || 'Unknown' }}
        </div>
      </div>

      <div class="mb-5">
        {{ meal.strInstructions }}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 mb-5">
        <div>
          <h2 class="text-2xl font-semibold mb-2">Ingredients</h2>
          <ul>
            <template v-for="(el, ind) of new Array(20)">
              <li v-if="meal[`strIngredient${ind + 1}`]">
                {{ ind + 1 }}. {{ meal[`strIngredient${ind + 1}`] }}
              </li>
            </template>
          </ul>
        </div>
        <div>
          <h2 class="text-2xl font-semibold mb-2">Measures</h2>
          <ul>
            <template v-for="(el, ind) of new Array(20)">
              <li v-if="meal[`strMeasure${ind + 1}`]">
                {{ ind + 1 }}. {{ meal[`strMeasure${ind + 1}`] }}
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div class="flex space-x-2">
        <button v-if="meal.idMeal" @click="toggleFavorite(meal)" :class="['px-4 py-2 rounded  border-2 flex items-center', isFavorite(meal) ? 'bg-pink-500 border-pink-600 text-white hover:bg-pink-600 transition-colors' : 'bg-gray-300 border-gray-500 text-black hover:bg-gray-500 transition-colors']">
          <font-awesome-icon :icon="isFavorite(meal) ? ['fas', 'heart'] : ['far', 'heart']" class="mr-2" />
          {{ isFavorite(meal) ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
      </div>

      <div v-if="meal.strYoutube" class="relative w-full pt-[56.25%] mt-4 mb-5">
        <iframe :src="youtubeEmbedUrl(meal.strYoutube)" frameborder="0" class="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import axiosClient from '../axiosClient';
import { useStore } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import Footer from "../components/Footer.vue";

const route = useRoute();
const meal = ref({});
const loading = ref(true);
const store = useStore();

// Embed Youtube video
const youtubeEmbedUrl = (url) => {
  const videoId = url.split('v=')[1];
  const ampersandPosition = videoId.indexOf('&');
  if (ampersandPosition !== -1) {
    return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
  }
  return `https://www.youtube.com/embed/${videoId}`;
};

// Check if a meal is marked as favorite
const isFavorite = (meal) => {
  if (!meal.idMeal) return false;
  return store.state.favoriteMeals.some(favMeal => favMeal.idMeal === meal.idMeal);
};

// Toggle a meal as favorite
const toggleFavorite = (meal) => {
  if (!meal.idMeal) return;
  if (isFavorite(meal)) {
    store.dispatch('removeFavoriteMeal', meal.idMeal);
  } else {
    store.dispatch('addFavoriteMeal', meal);
  }
};

onMounted(async () => {
  try {
    const { data } = await axiosClient.get(`lookup.php?i=${route.params.id}`);
    meal.value = data.meals[0] || {};
  } catch (error) {
    console.error("Error fetching meal details", error);
  } finally {
    loading.value = false;
  }
});
</script>

