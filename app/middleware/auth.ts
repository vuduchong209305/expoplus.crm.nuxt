export default defineNuxtRouteMiddleware(async (to) => {
	const token = useCookie('expoplus_crm_token')
	if (!token.value) return navigateTo('/auth/login')
});