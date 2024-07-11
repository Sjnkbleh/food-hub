<template>
    <div class="flex flex-col min-h-screen">
      <div class="max-w-7xl mx-auto pt-8 w-full">
        <h1 class="text-4xl font-bold mb-5 text-green-500">Favorite Meals</h1>
      </div>
      <div class="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        <div v-if="favoriteMeals.length === 0" class="flex-1 text-left text-lg text-gray-600">
          You have no favorite meals.
        </div>
        <div v-else>
          <div class="p-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
            <MealItem v-for="meal in paginatedMeals" :key="meal.idMeal" :meal="meal" @toggleFavorite="toggleFavorite" />
          </div>
          <Pagination class="pb-4"
            v-if="favoriteMeals.length > itemsPerPage" 
            :currentPage="currentPage" 
            :totalItems="favoriteMeals.length" 
            :itemsPerPage="itemsPerPage" 
            @update:currentPage="updateCurrentPage" 
          />
        </div>
      </div>
      <Footer></Footer>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import MealItem from '../components/MealItem.vue';
  import Footer from '../components/Footer.vue';
  import Pagination from '../components/Pagination.vue'; 
  
  const store = useStore();
  
  const favoriteMeals = computed(() => store.state.favoriteMeals);
  
  // Pagination state
  const currentPage = ref(1);
  const itemsPerPage = 6; 
  
  // Compute paginated meals
  const paginatedMeals = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return favoriteMeals.value.slice(start, end);
  });
  
  // Toggle a meal as favorite
  const toggleFavorite = (meal) => {
    if (isFavorite(meal)) {
      store.dispatch('removeFavoriteMeal', meal.idMeal);
    } else {
      store.dispatch('addFavoriteMeal', meal);
    }
  };
  
  // Check if a meal is marked as favorite in the store
  const isFavorite = (meal) => {
    return store.getters.isFavorite(meal);
  };
  
  // Update the current page
  const updateCurrentPage = (page) => {
    currentPage.value = page;
  };
  
  onMounted(() => {
    store.dispatch('loadFavoriteMeals');
  });
  </script>
  