<template>
  <div class="flex justify-center mt-4 space-x-2">
    <button @click="prevPage" :disabled="currentPage === 1 || loading"
      class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed">
      Previous
    </button>

    <button @click="goToPage(1)" :class="{ 'font-bold': currentPage === 1 }"
      class="hidden sm:inline px-4 py-2 bg-gray-200 rounded">
      1
    </button>
  <!-- Input to jump to a specific page -->
    <span v-if="showLeftEllipsis" @click="showLeftInput" class="px-4 py-2 cursor-pointer hidden sm:inline">
      <span v-if="!showLeftPageInput">...</span>
      <input v-if="showLeftPageInput" type="text" v-model.number="leftInputValue" @keydown.enter="jumpToLeftPage"
        @blur="hideLeftInput" class="w-12 p-1 border border-gray-300 rounded" />
    </span>

    <button v-for="page in pagesToShow" :key="page" @click="goToPage(page)"
      :class="{ 'font-bold': currentPage === page }" class="px-4 py-2 bg-gray-200 rounded" :disabled="loading">
      {{ page }}
    </button>
    
  <!-- Input to jump to a specific page -->
    <span v-if="showRightEllipsis" @click="showRightInput" class="px-4 py-2 cursor-pointer hidden sm:inline">
      <span v-if="!showRightPageInput">...</span>
      <input v-if="showRightPageInput" type="text" v-model.number="rightInputValue" @keydown.enter="jumpToRightPage"
        @blur="hideRightInput" class="w-12 p-1 border border-gray-300 rounded" />
    </span>

    <button @click="goToPage(totalPages)" :class="{ 'font-bold': currentPage === totalPages }"
      class="hidden sm:inline px-4 py-2 bg-gray-200 rounded" :disabled="loading">
      {{ totalPages }}
    </button>

    <button @click="nextPage" :disabled="currentPage === totalPages || loading"
      class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed">
      Next
    </button>

    <!-- Current Page Button/Input -->
    <span @click="showCurrentPageInput = true" v-if="!showCurrentPageInput"
      class="inline sm:hidden px-4 py-2 cursor-pointer">
      {{ currentPage }}
    </span>
    <input v-if="showCurrentPageInput" type="text" v-model.number="currentPageInputValue"
      @keydown.enter="jumpToCurrentPage" @blur="hideCurrentPageInput" class="w-12 p-1 border border-gray-300 rounded" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:currentPage']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

// Local state for managing the visibility of page number inputs
const showLeftPageInput = ref(false);
const showRightPageInput = ref(false);
const showCurrentPageInput = ref(false);
const leftInputValue = ref('');
const rightInputValue = ref('');
const currentPageInputValue = ref(props.currentPage);

// Compute the range of pages to show
const pagesToShow = computed(() => {
  const pages = [];
  const startPage = Math.max(2, props.currentPage - 1);
  const endPage = Math.min(totalPages.value - 1, props.currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Compute whether to show left ellipsis
const showLeftEllipsis = computed(() => {
  return props.currentPage > 3;
});

// Compute whether to show right ellipsis
const showRightEllipsis = computed(() => {
  return props.currentPage < totalPages.value - 2;
});

// Go to the previous page
function prevPage() {
  if (props.currentPage > 1) {
    emits('update:currentPage', props.currentPage - 1);
  }
}

// Go to the next page
function nextPage() {
  if (props.currentPage < totalPages.value) {
    emits('update:currentPage', props.currentPage + 1);
  }
}

// Go to a specific page
function goToPage(page) {
  emits('update:currentPage', page);
}

function showLeftInput() {
  showLeftPageInput.value = true;
  setTimeout(() => {
    const input = document.querySelector('.pagination .page-input');
    if (input) input.focus();
  }, 0);
}

function showRightInput() {
  showRightPageInput.value = true;
  setTimeout(() => {
    const input = document.querySelector('.pagination .page-input');
    if (input) input.focus();
  }, 0);
}

function hideLeftInput() {
  if (leftInputValue.value < 1 || leftInputValue.value > totalPages.value) {
    showLeftPageInput.value = false;
  }
}

function hideRightInput() {
  if (rightInputValue.value < 1 || rightInputValue.value > totalPages.value) {
    showRightPageInput.value = false;
  }
}

function jumpToLeftPage() {
  if (leftInputValue.value >= 1 && leftInputValue.value <= totalPages.value) {
    goToPage(leftInputValue.value);
  }
  showLeftPageInput.value = false;
}

function jumpToRightPage() {
  if (rightInputValue.value >= 1 && rightInputValue.value <= totalPages.value) {
    goToPage(rightInputValue.value);
  }
  showRightPageInput.value = false;
}

function hideCurrentPageInput() {
  showCurrentPageInput.value = false;
}

function jumpToCurrentPage() {
  if (currentPageInputValue.value >= 1 && currentPageInputValue.value <= totalPages.value) {
    goToPage(currentPageInputValue.value);
  }
  showCurrentPageInput.value = false;
}

watch(() => props.currentPage, (newPage) => {
  currentPageInputValue.value = newPage;
});
</script>
