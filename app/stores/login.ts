export const useLoginStore = defineStore('login', {
    actions: {
        async login(email: string, password: string) {
            try {
                const res = await useNuxtApp().$apiFetch('login', {
                    method: 'POST',
                    body: {
                        email,
                        password
                    }
                });

                if(res.status) {
                    const tokenCookie = useAuthCookie();
                    tokenCookie.value = res.data.token;

                    useUserStore().user = res.data.user
                } else {
                    throw new Error(res.message || 'Đăng nhập thất bại');
                }
                
            } catch (err) {
                throw new Error(err.message || 'Lỗi không xác định');
            }
        },
        logout() {
            const tokenCookie = useAuthCookie();
            tokenCookie.value = null;

            useUserStore().clear();

            const res = useNuxtApp().$apiFetch('logout', {
                method: 'POST'
            });

            return res
        }
    }
});