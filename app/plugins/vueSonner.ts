import { Toaster } from "vue-sonner";
import { h } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("Toaster", {
        setup() {
            return () => h(Toaster);
        },
    });
});