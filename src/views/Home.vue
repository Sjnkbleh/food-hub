<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1 p-8 pb-0 text-green-500">
      <Popup v-if="showNotification" :message="notificationMessage" />
      <h1 class="text-4xl font-bold mb-4">Have you tried..?</h1>
      <LoadingSpinner v-if="loading"></LoadingSpinner>
      <MealsCarousel v-else :meals="meals"></MealsCarousel>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axiosClient from "../axiosClient.js";
import MealsCarousel from "../components/MealsCarousel.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import Popup from "../components/Popup.vue";
import Footer from "../components/Footer.vue";

const meals = ref([]);
const loading = ref(true);
const showNotification = ref(localStorage.getItem('showNotification') === 'true');
const notificationMessage = ref(localStorage.getItem('notificationMessage'));

onMounted(async () => {
  if (showNotification.value) {
    // Clear the notification flag in local storage after showing it
    localStorage.removeItem('showNotification');
    localStorage.removeItem('notificationMessage');
  }
  try {
    for (let i = 0; i < 10; i++) {
      // Fetch a random meal
      const { data } = await axiosClient.get('random.php');
      meals.value.push(data.meals[0]);
    }
  } catch (error) {
    // Log the error 
    console.error('Error fetching meals:', error);
  } finally {
    loading.value = false;
  }
});
</script>
