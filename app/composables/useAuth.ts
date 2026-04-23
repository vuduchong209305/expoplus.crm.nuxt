export const useAuth = () => {
    const userStore = useUserStore()

    return {
        user: computed(() => userStore.user),
        isLoggedIn: computed(() => !!userStore.user),
    }
}