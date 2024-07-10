<template>
  <div class="flex flex-col min-h-screen">
  <div class="p-8 pb-0">
    <h1 class="text-4xl font-bold mb-4 text-green-500">Search Meals by Name</h1>
  </div>
  <div class="px-8 pb-3">
    <div class="relative w-full">
      <input type="text" v-model="keyword" @input="searchMeals"
        class="rounded border-2 bg-white border-gray-200 focus:ring-green-500 focus:border-green-500 w-full pl-10 pr-10"
        placeholder="Search for Meals" />
      <button @click="searchMeals" class="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="text-xl cursor-pointer"></font-awesome-icon>
      </button>
      <div v-if="showDropdown" class="absolute w-full bg-white mt-1 border rounded overflow-y-auto" style="max-height: 200px;">
        <ul>
          <li v-for="meal in searchResults" :key="meal.idMeal" @click="selectMeal(meal.idMeal)"
            class="p-2 hover:bg-gray-100 cursor-pointer flex items-center">
            <img :src="meal.strMealThumb" alt="Meal Thumbnail" class="w-10 h-10 mr-2">
            {{ meal.strMeal }}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div v-if="loading" class="loading-container flex justify-center items-center h-200">
    <LoadingSpinner />
  </div>
  <div v-else class="flex-1 pb-4">
    <Meals :meals="paginatedMeals" />
    <Pagination v-if="meals.length > itemsPerPage"
      :currentPage="currentPage" 
      :totalItems="meals.length" 
      :itemsPerPage="itemsPerPage" 
      @update:currentPage="updateCurrentPage" 
    />
  </div>
  <Footer></Footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../store";
import Meals from '../components/Meals.vue';
import Pagination from '../components/Pagination.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import Footer from "../components/Footer.vue";

const route = useRoute();
const router = useRouter();
const keyword = ref("");
const meals = computed(() => store.state.searchedMeals);
const searchResults = ref([]);
const showDropdown = ref(false);
const loading = ref(false);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(6);

// Computed property for paginated meals
const paginatedMeals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return meals.value.slice(start, end);
});

// Search meals by name
async function searchMeals() {
  // Fetch meals by name
  if (keyword.value.trim()) {
    const fetchMeals = async () => {
      loading.value = true;
      await store.dispatch('searchMeals', keyword.value);
      searchResults.value = store.state.searchedMeals;
      loading.value = false;
    };

    // Timeout promise
    const timeout = (ms) => new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), ms);
    });

    try {
      await Promise.race([fetchMeals(), timeout(5000)]); // Timeout after 5 seconds
      showDropdown.value = searchResults.value.length > 0;
      currentPage.value = 1; // Reset to first page on new search
    } catch (error) {
      // Log the error
      console.error(error.message);
      showDropdown.value = false;
    }
  } else {
    store.commit('setSearchedMeals', []); // Clear the searched meals
    searchResults.value = [];
    showDropdown.value = false;
  }
}

// Select a meal from the dropdown
function selectMeal(mealId) {
  router.push(`/meal/${mealId}`);
  showDropdown.value = false;
}

// Update current page
function updateCurrentPage(page) {
  currentPage.value = page;
}

onMounted(() => {
  keyword.value = route.params.name;
  if (keyword.value) {
    searchMeals();
  }
});
</script>


