export default defineNuxtPlugin((nuxtApp) => {
    const userStore = useUserStore();
    const token = useAuthCookie().value;
    if (token && !userStore.user) {
        userStore.fetch();
    }
});