<template>
  <div id="container" class="flex flex-col md:flex-row min-h-screen py-10">
    <!-- Mobile Viewport Register Form -->
    <div class="md:hidden max-w-md mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <img src="../assets/logo.png" alt="Food Hub" class="h-16 w-16 mx-auto mb-6" />
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up for an Account</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="username" class="block text-gray-700">Username</label>
          <input v-model="form.username" type="text" id="username"
            class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
        </div>
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
        <div class="flex items-center">
          <input v-model="form.acceptTerms" type="checkbox" id="acceptTerms"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
          <label for="acceptTerms" class="ml-2 block text-gray-900 mr-14">I Accept Terms & Conditions</label>
          <button type="button" @click="showTerms = true" class="ml-2 text-green-500 hover:underline">
            Terms & Conditions
          </button>
        </div>
        <p v-if="errors.acceptTerms" class="text-red-500 text-sm">{{ errors.acceptTerms }}</p>
        <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
          Sign Up
        </button>
      </form>
      <div class="text-center mt-4">
        <span>Already have an account? </span>
        <router-link to="/login" class="text-green-500">
          Login
        </router-link>
      </div>
    </div>

    <!-- Original Layout for Larger Screens -->
    <div class="hidden md:flex md:w-1/2 flex-col justify-center bg-green-500 text-white p-8">
      <div class="max-w-md w-full mx-auto text-center px-16">
        <h2 class="text-4xl font-bold mb-6">Already Signed up?</h2>
        <p class="mb-6">
          Log in to your account so you can enjoy our meal catalogue.
        </p>
        <router-link to="/login" class="bg-white text-green-500 py-2 px-4 rounded-full hover:bg-gray-200 transition">
          Log In
        </router-link>
      </div>
    </div>
    <div class="hidden md:flex md:w-1/2 flex flex-col justify-center bg-white p-8">
      <div class="max-w-md w-full mx-auto">
        <img src="../assets/logo.png" alt="Food Hub" class="h-16 w-16 mx-auto mb-6" />
        <h2 class="text-2xl font-bold mb-6 text-center">Sign Up for an Account</h2>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label for="username" class="block text-gray-700">Username</label>
            <input v-model="form.username" type="text" id="username"
              class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
          </div>
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
          <div class="flex items-center">
            <input v-model="form.acceptTerms" type="checkbox" id="acceptTerms"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
            <label for="acceptTerms" class="ml-2 block text-gray-900 mr-14">I Accept Terms & Conditions</label>
            <button type="button" @click="showTerms = true" class="ml-2 text-green-500 hover:underline">
              Terms & Conditions
            </button>
          </div>
          <p v-if="errors.acceptTerms" class="text-red-500 text-sm">{{ errors.acceptTerms }}</p>
          <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
            Sign Up
          </button>
        </form>
      </div>
    </div>
    <popup v-if="errorMessage" :message="errorMessage" @close="errorMessage = ''" />
    <terms v-if="showTerms" :visible="showTerms" @close="showTerms = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Popup from '../components/Popup.vue';
import Terms from '../components/Terms.vue';

const form = ref({
  username: '',
  email: '',
  password: '',
  acceptTerms: false
});

const errors = ref({});
const showPassword = ref(false);
const showTerms = ref(false);
const errorMessage = ref('');
const router = useRouter();

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Validation schema
const schema = yup.object().shape({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  acceptTerms: yup.bool().oneOf([true], 'You must accept the terms and conditions')
});

// Validate form against schema
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

// Handle form submission
const onSubmit = async () => {
  await validateForm(); // First, validate the form
  if (Object.keys(errors.value).length === 0) {
    try {
      // Attempt to register via a POST request
      await axios.post('http://localhost:5000/api/auth/register', form.value);
      localStorage.setItem('showNotification', 'true'); // Set notification flag
      localStorage.setItem('notificationMessage', 'Registration successful!'); // Set notification message
      // Redirect to login page after successful registration
      router.push({ name: 'login' });
    } catch (error) {
      // Handle registration failure
      if (error.response && error.response.status === 400) {
        errorMessage.value = 'User already exists. Please try again.';
      } else if (error.response && error.response.status === 500) {
        errorMessage.value = 'Something went wrong. Please try again later.';
      } else {
        errorMessage.value = 'Registration failed. Please try again.';
      }
    }
  }
};
</script>
