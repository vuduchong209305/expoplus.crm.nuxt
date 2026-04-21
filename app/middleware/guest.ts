export default defineNuxtRouteMiddleware((to) => {
	const token = useCookie('expoplus_crm_token')
	if (token.value) return navigateTo('/')
});