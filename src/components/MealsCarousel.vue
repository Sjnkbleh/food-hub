<template>
  <div v-if="meals.length > 0" class="relative flex flex-col items-center justify-center overflow-hidden h-full w-full">
    <div class="relative h-full w-full">
      <transition-group :name="transitionName" mode="out-in" tag="div"
        class="relative w-full flex-nowrap flex overflow-hidden rounded-lg">
        <router-link :key="currentMeal.strMeal" :to="{ name: 'mealDetails', params: { id: currentMeal.idMeal } }"
          class="flex-shrink-0 w-full transition-transform duration-1000">
          <img :src="currentMeal.strMealThumb" :alt="currentMeal.strMeal" class="w-full max-h-96 object-cover" />
        </router-link>
      </transition-group>
      <!-- Carousel indicators -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <span v-for="(meal, index) in meals" :key="index" @click="goToMeal(index)"
          :class="['h-1 w-3 sm:w-6 cursor-pointer transition-none', index === currentIndex ? 'bg-white' : 'bg-gray-500 hover:bg-gray-700']"></span>
      </div>
      <!-- Slider controls -->
      <button @click="prevMeal" type="button"
        class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
        <span
          class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/50 group-hover:bg-black/70 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
          <svg aria-hidden="true" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="sr-only">Previous</span>
        </span>
      </button>
      <button @click="nextMeal" type="button"
        class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
        <span
          class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/50 group-hover:bg-black/70 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
          <svg aria-hidden="true" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span class="sr-only">Next</span>
        </span>
      </button>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="currentMeal" class="mt-5 text-left w-full p-5" :key="currentMeal.strMeal">
        <router-link :to="{ name: 'mealDetails', params: { id: currentMeal.idMeal } }">
          <h2 class="text-green-600 font-semibold text-2xl">{{ currentMeal.strMeal || 'Unknown Meal' }}</h2>
        </router-link>
        <div class="grid grid-cols-1 sm:grid-cols-3 text-lg py-2">
          <div>
            <strong class="font-bold">Category:</strong> {{ currentMeal.strCategory || 'Unknown' }}
          </div>
          <div>
            <strong class="font-bold">Area:</strong> {{ currentMeal.strArea || 'Unknown' }}
          </div>
          <div>
            <strong class="font-bold">Tags:</strong> {{ currentMeal.strTags || 'Unknown' }}
          </div>
        </div>
        <p class="text-lg text-gray-700 mb-5">{{ truncateWords(currentMeal.strInstructions, 100) }}</p>
        <div class="flex space-x-2">
          <button v-if="currentMeal.strYoutube" class="bg-red-600 text-white px-4 py-2 rounded">
            <a :href="currentMeal.strYoutube" target="_blank">YouTube</a>
          </button>
          <button @click="toggleFavorite(currentMeal)"
            :class="['px-4 py-2 rounded border-2 flex items-center', isFavorite(currentMeal) ? 'bg-pink-500 border-pink-600 text-white hover:bg-pink-600 transition-colors' : 'bg-gray-300 border-gray-500 text-black hover:bg-gray-500 transition-colors']">
            <font-awesome-icon :icon="isFavorite(currentMeal) ? ['fas', 'heart'] : ['far', 'heart']" class="mr-2" />
            {{ isFavorite(currentMeal) ? 'Remove from Favorites' : 'Add to Favorites' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  meals: {
    type: Array,
    required: true
  }
});

const store = useStore();

const currentIndex = ref(0);
const direction = ref('forward');

const currentMeal = computed(() => props.meals[currentIndex.value]);

const transitionName = computed(() => direction.value === 'forward' ? 'slide-left' : 'slide-right');

// Go to the previous meal
const prevMeal = () => {
  direction.value = 'backward';
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.meals.length - 1;
  }
  resetInterval();
};

// Go to the next meal
const nextMeal = () => {
  direction.value = 'forward';
  if (currentIndex.value < props.meals.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
  resetInterval();
};

// Go to a specific meal
const goToMeal = (index) => {
  direction.value = index > currentIndex.value ? 'forward' : 'backward';
  currentIndex.value = index;
  resetInterval();
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

// Truncate a string to a specified number of words
const truncateWords = (str, count) => {
  if (!str) return str;
  return str.split(" ").slice(0, count).join(" ");
};

let interval;

const startInterval = () => {
  interval = setInterval(nextMeal, 20000); // Change meal every 20 seconds
};

const resetInterval = () => {
  clearInterval(interval);
  startInterval();
};

onMounted(() => {
  startInterval();
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all transform 0.7s ease-in-out;
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
