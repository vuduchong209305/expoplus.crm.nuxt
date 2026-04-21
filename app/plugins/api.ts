import { $fetch as originalFetch } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {

    const { start, stop } = useLoading()

    const apiFetch = $fetch.create({
        baseURL: useRuntimeConfig().public.apiBase,

        async onRequest({
            options
        }) {
            const isFormData = options.body instanceof FormData

            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${useAuthCookie()?.value}`,
                Accept: 'application/json',
                ...(isFormData ? {} : {
                    'Content-Type': 'application/json'
                })
            }

            start() // 🔥 start loading
        },

        async onResponse() {
            stop() // 🔥 stop loading
        },

        async onResponseError() {
            stop() // 🔥 stop khi lỗi
        }

    })

    return {
        provide: {
            apiFetch
        }
    }
})