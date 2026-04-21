<template>
    <Toaster position="top-center" />
    <NuxtLoadingIndicator />
    <NuxtLayout>
        <Loading/>
        <NuxtPage/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import 'vue-sonner/style.css'
</script>