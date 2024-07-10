<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 class="text-2xl font-bold mb-4">Terms & Conditions</h2>
            <div class="max-h-80 overflow-y-auto">
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos, suscipit commodi, libero vero error
                    assumenda unde ipsam possimus nihil officiis adipisci quo natus. Obcaecati voluptates incidunt
                    dolores debitis repudiandae illo nihil error quos ex sint aspernatur, fugiat consequuntur corrupti
                    exercitationem ipsum veniam eligendi, vero suscipit recusandae voluptate, enim sunt magni. Sit
                    reiciendis recusandae ducimus, excepturi laborum rerum cumque consectetur praesentium.</p>
            </div>
            <button @click="closePopup" class="mt-4 bg-green-500 text-white py-2 px-4 rounded">
                Close
            </button>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close']);

const closePopup = () => {
    emit('close');
};
</script>

<style scoped>
.fixed {
    position: fixed;
}
</style>