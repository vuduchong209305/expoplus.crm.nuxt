export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        permissions: []
    }),
    actions: {
        async fetch() {
            try {
                const res = await useNuxtApp().$apiFetch('me');
                if(res?.message == "Vui lòng đăng nhập lại")
                    useLoginStore().logout();

                this.user = res?.data;
                this.permissions = res.data.permissions || []
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