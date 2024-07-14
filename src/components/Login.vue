<template>
  <div id="container" class="flex flex-col md:flex-row min-h-screen py-10">
    <!-- Mobile Viewport -->
    <div class="md:hidden max-w-md mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <img src="../assets/logo.png" alt="Food Hub" class="h-16 w-16 mx-auto mb-6" />
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email"
            class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
        </div>
        <div>
          <label for="password" class="block text-gray-700">Password</label>
          <div class="relative mt-1">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password"
              class="block w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500" />
            <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'"
              class="absolute right-3 top-3 cursor-pointer text-gray-500" @click="togglePasswordVisibility" />
          </div>
          <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
        </div>
        <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
          Login
        </button>
        <div class="text-center mt-4">
          <span>Don't have an account? </span>
          <router-link to="/guest/register" class="text-green-500">
            Register
          </router-link>
        </div>
      </form>
    </div>

    <!-- Original Layout for Larger Screens -->
    <div class="hidden md:flex md:w-1/2 flex-col justify-center bg-white p-8">
      <div class="max-w-md w-full mx-auto px-16">
        <img src="../assets/logo.png" alt="Food Hub" class="h-16 w-16 mx-auto mb-6" />
        <h2 class="text-2xl font-bold mb-6 text-center">Log in to Your Account</h2>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-gray-700">Email</label>
            <input v-model="form.email" type="email" id="email"
              class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
          </div>
          <div>
            <label for="password" class="block text-gray-700">Password</label>
            <div class="relative mt-1">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password"
                class="block w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'"
                class="absolute right-3 top-3 cursor-pointer text-gray-500" @click="togglePasswordVisibility" />
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
          </div>
          <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
            Log In
          </button>
        </form>
      </div>
    </div>
    <div class="hidden md:flex md:w-1/2 flex flex-col justify-center bg-green-500 text-white p-8">
      <div class="max-w-md w-full mx-auto text-center">
        <h2 class="text-4xl font-bold mb-6">Don't Have an Account Yet?</h2>
        <p class="text-lg mb-8">
          Let's get you all set up so you can relish a cornucopia of dishes.
        </p>
        <router-link to="/guest/register"
          class="bg-white text-green-500 py-2 px-4 rounded-full hover:bg-gray-200 transition">
          Sign Up
        </router-link>
      </div>
    </div>
    <popup v-if="errorMessage" :message="errorMessage" @close="errorMessage = ''" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Popup from '../components/Popup.vue';


const form = ref({
  email: '',
  password: '',
});

const errors = ref({});
const showPassword = ref(false);
const errorMessage = ref('');
const router = useRouter();

// Toggles the visibility of the password field
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Yup schema for form validation
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number and one special character')
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

// Validates the form against the schema
const validateForm = async () => {
  try {
    // Validates the form data, abortEarly: false ensures all errors are captured, not just the first
    await schema.validate(form.value, { abortEarly: false });
    errors.value = {}; // Clear errors if validation is successful
  } catch (err) {
    // Accumulate errors in a reactive object if validation fails
    errors.value = err.inner.reduce((acc, curr) => ({ ...acc, [curr.path]: curr.message }), {});
  }
};

// Handles form submission
const onSubmit = async () => {
  await validateForm(); // First, validate the form
  if (Object.keys(errors.value).length === 0) { // Proceed if no errors
    try {
      // Attempt to login via a POST request
      const response = await axios.post('http://localhost:5000/api/auth/login', form.value);
      const token = response.data.token; // Extract token from response
      localStorage.setItem('token', token); // Store token in local storage
      localStorage.setItem('showNotification', 'true'); 
      localStorage.setItem('notificationMessage', 'Login successful!');
      // Navigate to the home route with a notification
      router.push({ name: 'home', meta: { showNotification: true } });
    } catch (error) {
      // Handle login failure
      if (error.response && error.response.status === 404) {
        errorMessage.value = 'User does not exist. Please try again.';
      } else if (error.response && error.response.status === 400) {
        errorMessage.value = 'Invalid credentials. Please try again.';
      } else if (error.response && error.response.status === 500) {
        errorMessage.value = 'Something went wrong. Please try again later.';
      } else {
        errorMessage.value = 'Login failed. Please try again.';
      }
    }
  }
};
</script>
