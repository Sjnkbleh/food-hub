<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1 p-8 pb-0">
      <h1 class="text-4xl font-bold mb-4 text-green-500">Meals for {{ ingredient.strIngredient }}</h1>
    </div>
    <div v-if="loading" class="loading-container flex justify-center items-center h-200">
      <LoadingSpinner />
    </div>
    <div v-else class="pb-4">
      <Meals :meals="paginatedMeals" />
      <div v-if="showPagination">
        <Pagination 
          :currentPage="currentPage" 
          :totalItems="meals.length" 
          :itemsPerPage="itemsPerPage" 
          :loading="loading" 
          @update:currentPage="updateCurrentPage" 
        />
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import store from "../store";
import Meals from '../components/Meals.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import Pagination from '../components/Pagination.vue';
import Footer from "../components/Footer.vue";

const route = useRoute();
const ingredient = computed(() => store.state.ingredient);
const meals = computed(() => store.state.mealsByIngredient);
const loading = ref(true);

const currentPage = ref(1);
const itemsPerPage = ref(6);

// Computed property for paginated meals
const paginatedMeals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return meals.value.slice(start, end);
});

// Fetch meals by ingredient
const fetchMeals = async () => {
  try {
    loading.value = true;
    await store.dispatch('searchMealsByIngredient', route.params.ingredient);
  } catch (error) {
    // Log the error
    console.error("Error fetching meals by ingredient", error);
  } finally {
    loading.value = false;
  }
};

// Update current page
const updateCurrentPage = (page) => {
  currentPage.value = page;
};

// Computed property to determine if pagination should be shown
const showPagination = computed(() => {
  return meals.value.length > itemsPerPage.value;
});

onMounted(fetchMeals);

watch(route, fetchMeals);
watch(meals, () => {
  currentPage.value = 1; // Reset to first page when meals change
});
</script>

<style scoped>
.loading-container {
  min-height: 200px;
}
</style>
