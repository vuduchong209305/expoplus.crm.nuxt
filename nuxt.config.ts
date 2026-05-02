// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    ssr:false,
    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL,
            apiDomain: process.env.API_DOMAIN,
            apiBase: process.env.API_DOMAIN+'/api/v1/',
            apiFile: process.env.API_DOMAIN+'/storage/'
        },
    },
    css: [
        '@tabler/icons-webfont/dist/tabler-icons.min.css',
        'flatpickr/dist/flatpickr.css',
        '~/assets/css/style.css'
    ],
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss'
    ],
    app: {
        head: {
            title: 'Admin',
            titleTemplate: '%s | Expoplus CRM'
        }
    }
})