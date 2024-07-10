<template>
  <div class="flex flex-col min-h-screen">
    <div class="p-8 pb-0">
      <h1 class="text-4xl font-bold mb-4 text-green-500">Meals by Letter</h1>
    </div>
    <div class="flex flex-wrap justify-center gap-3 px-8 mb-6">
      <router-link :to="{ name: 'byLetter', params: { letter } }" v-for="letter of letters" :key="letter"
        class="w-2 h-2 flex items-center justify-center hover:text-green-500 hover:scale-150 focus:text-green-500 focus:scale-150 transition-all">
        {{ letter }}
      </router-link>
    </div>
    <div v-if="loading" class="loading-container flex justify-center items-center h-200">
      <LoadingSpinner />
    </div>
    <div v-else class="flex-1 pb-4">
      <Meals :meals="paginatedMeals" />
      <div v-if="showPagination">
        <Pagination :currentPage="currentPage" :totalItems="meals.length" :itemsPerPage="itemsPerPage"
          :loading="loading" @update:currentPage="updateCurrentPage" />
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store';
import Meals from '../components/Meals.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import Pagination from '../components/Pagination.vue';
import Footer from "../components/Footer.vue";

const route = useRoute();
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const meals = computed(() => store.state.mealsByLetter);
const loading = ref(true);

const currentPage = ref(1);
const itemsPerPage = 6;

// Fetch meals by letter
const fetchMeals = async () => {
  try {
    loading.value = true;
    await store.dispatch('searchMealsByLetter', route.params.letter); 
  } catch (error) {
    // Log the error
    console.error('Error fetching meals by letter', error);
  } finally {
    loading.value = false;
  }
};

// Compute paginated meals
const paginatedMeals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return meals.value.slice(start, end);
});

// Update the current page
const updateCurrentPage = (page) => {
  currentPage.value = page;
};

// Computed property to determine if pagination should be shown
const showPagination = computed(() => {
  return meals.value.length > 6;
});

watch(route, fetchMeals);
watch(meals, () => {
  currentPage.value = 1; // Reset to first page when meals change
});

onMounted(fetchMeals);
</script>
