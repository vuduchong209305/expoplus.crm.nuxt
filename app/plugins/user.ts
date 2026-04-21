export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.mixin({
        computed: {
            user() {
                return useUserStore().user;
            },
        },
    });
});