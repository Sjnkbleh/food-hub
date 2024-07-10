<template>
  <div class="bg-white shadow rounded-xl hover:scale-105 transition-all">
    <router-link :to="{ name: 'mealDetails', params: { id: meal.idMeal } }">
      <img :src="meal.strMealThumb" :alt="meal.strMeal" class="rounded-t-xl w-full h-48 object-cover" />
    </router-link>
    <div class="p-3">
      <h3 class="font-bold">{{ meal.strMeal }}</h3>
      <p class="mb-4">
        {{ truncateWords(meal.strInstructions, 20) }}
      </p>
      <div class="flex items-center gap-3">
        <YouTubeButton :href="meal.strYoutube" />
        <button @click="toggleFavorite(meal)"
          :class="['px-4 py-2 rounded border-2 flex items-center', isFavorite(meal) ? 'bg-pink-500 border-pink-600 text-white hover:bg-pink-600 transition-colors' : 'bg-gray-300 border-gray-500 text-black hover:bg-gray-500 transition-colors']">
          <font-awesome-icon :icon="isFavorite(meal) ? ['fas', 'heart'] : ['far', 'heart']" class="mr-2" />
          {{ isFavorite(meal) ? 'Remove' : 'Favorite' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import YouTubeButton from './YouTubeButton.vue';

const { meal } = defineProps({
  meal: {
    required: true,
    type: Object
  }
});

const store = useStore();

// Truncate a string to a specified number of words
const truncateWords = (str, count) => {
  if (!str) return str;
  return str.split(" ").slice(0, count).join(" ");
};

// Check if a meal is marked as favorite in the store
const isFavorite = (meal) => {
  return store.state.favoriteMeals.some(favMeal => favMeal.idMeal === meal.idMeal);
};

// Toggle a meal as favorite
const toggleFavorite = (meal) => {
  if (isFavorite(meal)) {
    store.dispatch('removeFavoriteMeal', meal.idMeal); // Remove meal from favorites
  } else {
    store.dispatch('addFavoriteMeal', meal); // Add meal to favorites
  }
};
</script>
