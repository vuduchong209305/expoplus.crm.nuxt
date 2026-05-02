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

    onMounted(() => {
        // Gắn sự kiện lắng nghe online/offline
        window.addEventListener("online", updateNetworkStatus);
        window.addEventListener("offline", updateNetworkStatus);

        // Kiểm tra trạng thái mạng ban đầu
        updateNetworkStatus();
    })

    onUnmounted(() => {
        // Gỡ sự kiện khi component unmount
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);
    });

    const updateNetworkStatus = () => {
        if (!navigator.onLine) {
            notify.error(
                {
                    title: 'Có lỗi xảy ra',
                    description: 'Mất kết nối mạng'
                }
            )
        }
    };
</script>