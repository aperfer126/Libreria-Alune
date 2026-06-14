export default defineNuxtRouteMiddleware(async () => {
  const { data: session, status } = useAuth()

  if (status.value === 'unauthenticated') {
    return navigateTo('/auth/login')
  }

  if ((session.value?.user as { role?: string })?.role !== 'ADMIN') {
    return navigateTo('/admin')
  }
})
