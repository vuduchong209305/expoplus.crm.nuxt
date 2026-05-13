export const usePermission = () => {

    const user = useUserStore()

    const can = (key: string) => {

        if (user?.user?.is_admin == 1) return true

        return user.permissions.includes(key)
    }

    return {
        can
    }
}