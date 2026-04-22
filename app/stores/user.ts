export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        async fetch() {
            try {
                const response = await useNuxtApp().$apiFetch('me');
                if(response?.message == "Vui lòng đăng nhập lại")
                    useLoginStore().logout();

                this.user = response?.data;
            } catch (error) {
                useLoginStore().logout();
                this.user = null;
            }
        },
        clear() {
            this.user = null;
        },
    },
});