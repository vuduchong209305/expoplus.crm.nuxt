<template>
    <Transition name="fade">
        <div v-if="isLoading" class="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center">
            <div class="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-sm text-gray-700">Đang tải dữ liệu...</span>
            </div>
        </div>
    </Transition>
</template>
<script setup>
    const { isLoading } = useLoading()
</script>
<style>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .2s;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>