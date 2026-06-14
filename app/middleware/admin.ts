export default defineNuxtRouteMiddleware(async () => {
  const { data: session, status } = useAuth()

  if (status.value === 'unauthenticated') {
    return navigateTo('/auth/login')
  }

  const role = (session.value?.user as { role?: string })?.role
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    return navigateTo('/')
  }
})
