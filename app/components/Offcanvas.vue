<template>
    <Teleport to="body">
        <!-- Overlay -->
        <transition name="fade">
            <div v-if="open" class="fixed inset-0 bg-black/40 z-50" @click="emit('close')" />
        </transition>
        <!-- Panel -->
        <transition name="slide">
            <div v-if="open" :class="[
          'fixed top-0 right-0 h-full bg-white shadow-xl z-50 flex flex-col',
          width
        ]">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="font-semibold"></h3>
                    <button @click="emit('close')">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                <!-- Content -->
                <div class="p-4 overflow-y-auto flex-1">
                    <slot />
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
    const props = defineProps({
        open: Boolean,
        width: {
            type: String,
            default: 'w-[400px]'
        }
    })

    const emit = defineEmits(['close'])

    const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') emit('close')
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKey)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKey)
    })
</script>

<style>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: transform 0.25s ease;
    }
    .slide-enter-from,
    .slide-leave-to {
        transform: translateX(100%);
    }
</style>