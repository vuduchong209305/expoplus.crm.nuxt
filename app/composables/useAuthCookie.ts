export const useAuthCookie = () => {
    return useCookie('expoplus_crm_token', {
        maxAge: 60 * 60 * 24, // 1 ngày
        sameSite: 'lax',
        path: '/'
    })
}