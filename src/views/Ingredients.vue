<template>
  <div class="flex flex-col min-h-screen">
    <div class="p-8 pb-0">
      <h1 class="text-4xl font-bold mb-4 text-green-500">Ingredients</h1>
    </div>
    <div class="flex-1 px-8 pb-4">
      <input type="text" v-model="keyword"
        class="rounded border-2 bg-white border-gray-200 focus:ring-green-500 focus:border-green-500 mb-3 w-full"
        placeholder="Search for Ingredients" />
      <div v-if="loading" class="loading-container">
        <LoadingSpinner />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a href="#" @click.prevent="openIngredient(ingredient)" v-for="ingredient of paginatedIngredients"
          :key="ingredient.idIngredient" class="block bg-white rounded p-3 mb-3 shadow">
          <h3 class="text-2xl font-bold mb-2">{{ ingredient.strIngredient }}</h3>
        </a>
      </div>
      <div v-if="showPagination">
        <Pagination :currentPage="currentPage" :totalItems="filteredIngredients.length" :itemsPerPage="itemsPerPage"
          @update:currentPage="updatePage" />
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axiosClient from "../axiosClient";
import store from "../store";
import LoadingSpinner from '../components/LoadingSpinner.vue';
import Pagination from '../components/Pagination.vue';
import Footer from "../components/Footer.vue";

const router = useRouter();
const keyword = ref("");
const ingredients = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Filter ingredients based on the search keyword
const filteredIngredients = computed(() => {
  if (!keyword.value.trim()) return ingredients.value;
  return ingredients.value.filter((i) =>
    i.strIngredient.toLowerCase().includes(keyword.value.toLowerCase())
  );
});

// Paginate the filtered ingredients
const paginatedIngredients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredIngredients.value.slice(start, end);
});

const showPagination = computed(() => {
  return !loading.value && filteredIngredients.value.length > itemsPerPage.value;
});

// Open the ingredient details page
function openIngredient(ingredient) {
  store.commit('setIngredient', ingredient)
  router.push({
    name: "byIngredient",
    params: { ingredient: ingredient.strIngredient },
  });
}

function updatePage(page) {
  currentPage.value = page;
}

onMounted(async () => {
  try {
    // Fetch ingredients from the API
    const response = await axiosClient.get("list.php?i=list");
    ingredients.value = response.data.meals;
  } catch (error) {
    // Log the error
    console.error("Failed to fetch ingredients", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>
