<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1 p-8 pb-0">
      <h1 class="text-4xl font-bold mb-4 text-green-500">Meals for {{ ingredient.strIngredient }}</h1>
    </div>
    <div v-if="loading" class="loading-container flex justify-center items-center h-200">
      <LoadingSpinner />
    </div>
    <div v-else class="pb-4">
      <Meals :meals="meals" />
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import store from "../store";
import Meals from '../components/Meals.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import Footer from "../components/Footer.vue";

const route = useRoute();
const ingredient = computed(() => store.state.ingredient);
const meals = computed(() => store.state.mealsByIngredient);
const loading = ref(true);

onMounted(async () => {
  try {
    // Fetch meals by ingredient
    await store.dispatch('searchMealsByIngredient', route.params.ingredient);
  } catch (error) {
    // Log the error
    console.error("Error fetching meals by ingredient", error);
  } finally {
    loading.value = false;
  }
});
</script>