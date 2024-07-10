<template>
  <header class="sticky top-0 z-50 bg-white shadow h-16 flex justify-between items-stretch">
    <router-link :to="{ name: 'home' }" class="inline-flex items-center h-full px-5 text-green-500 font-bold"
      @click="setActiveMenuItem('home')">
      <img src="../assets/logo.png" alt="Food Hub" class="h-8 w-auto" />
    </router-link>
    <div class="hidden md:flex items-center gap-1">
      <router-link :to="{ name: 'byName' }"
        class="inline-flex items-center px-2 h-full transition-colors hover:bg-green-500 hover:text-white"
        @click="setActiveMenuItem('byName')">
        Search Meals
      </router-link>
      <router-link :to="{ name: 'byLetter' }"
        class="inline-flex items-center px-2 h-full transition-colors hover:bg-green-500 hover:text-white"
        @click="setActiveMenuItem('byLetter')">
        Meals By Letter
      </router-link>
      <router-link :to="{ name: 'ingredients' }"
        class="inline-flex items-center px-2 h-full transition-colors hover:bg-green-500 hover:text-white"
        @click="setActiveMenuItem('ingredients')">
        Meals By Ingredients
      </router-link>
      <router-link :to="{ name: 'favorite' }"
        class="inline-flex items-center px-2 h-full transition-colors hover:bg-green-500 hover:text-white"
        @click="setActiveMenuItem('favorite')">
        Favorite
      </router-link>
      <div class="relative" @click="toggleDropdown">
        <font-awesome-icon :icon="['fas', 'user']"
          class="text-green-500 text-2xl cursor-pointer px-2"></font-awesome-icon>
        <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <button @click="logout"
            class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-500 hover:text-white">
            Logout
          </button>
        </div>
      </div>
    </div>
    <!-- Mobile menu button -->
    <div class="md:hidden flex items-center px-4">
      <button @click="toggleMobileMenu" class="text-green-500 text-2xl focus:outline-none">
        <font-awesome-icon :icon="['fas', 'bars']"></font-awesome-icon>
      </button>
    </div>
    <!-- Mobile menu dropdown -->
    <div v-if="mobileMenuOpen" class="absolute top-16 left-0 right-0 bg-white shadow-md z-20 md:hidden">
      <router-link :to="{ name: 'byName' }" class="block px-4 py-2 text-gray-800 hover:bg-green-500 hover:text-white"
        :class="{ 'bg-green-500 text-white': activeMenuItem === 'byName' }" @click="toggleMobileMenu('byName')">
        Search Meals
      </router-link>
      <router-link :to="{ name: 'byLetter' }" class="block px-4 py-2 text-gray-800"
        :class="{ 'bg-green-500 text-white': activeMenuItem === 'byLetter' }" @click="toggleMobileMenu('byLetter')">
        Meals By Letter
      </router-link>
      <router-link :to="{ name: 'ingredients' }" class="block px-4 py-2 text-gray-800"
        :class="{ 'bg-green-500 text-white': activeMenuItem === 'ingredients' }"
        @click="toggleMobileMenu('ingredients')">
        Meals By Ingredients
      </router-link>
      <router-link :to="{ name: 'favorite' }" class="block px-4 py-2 text-gray-800"
        :class="{ 'bg-green-500 text-white': activeMenuItem === 'favorite' }" @click="toggleMobileMenu('favorite')">
        Favorite
      </router-link>
      <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-800">
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const dropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const activeMenuItem = ref('');

// Toggle dropdown menu
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Toggle mobile menu
const toggleMobileMenu = (menuItem) => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  activeMenuItem.value = menuItem;
};

// Set active menu item
const setActiveMenuItem = (menuItem) => {
  activeMenuItem.value = menuItem;
};

// Logout
const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/guest/login';
};
</script>

<style scoped>
.header-link {
  padding: 0.5rem 1rem;
  transition: background-color 0.3s, color 0.3s;
}

.header-link:hover,
.header-link.active {
  background-color: #38a169;
  color: white;
}
</style>
