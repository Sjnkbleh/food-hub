<template>
  <div v-if="visible" class="fixed inset-0 flex items-start justify-center z-50 pt-8">
    <div class="bg-white p-4 rounded shadow-lg text-center">
      <p>{{ message }}</p>
      <button @click="closePopup" class="mt-2 bg-green-500 text-white py-1 px-4 rounded">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['close']);

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  timeout: {
    type: Number,
    default: 3000
  }
});

const visible = ref(true);

const closePopup = () => {
  visible.value = false;
  emit('close');
};

let timeoutId;
onMounted(() => {
  timeoutId = setTimeout(closePopup, props.timeout);
});

onUnmounted(() => {
  clearTimeout(timeoutId);
});
</script>

<style scoped>
.fixed {
  position: fixed;
}
</style>
