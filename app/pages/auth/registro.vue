<script setup lang="ts">
const route = useRoute()
const callbackUrl = route.query.callbackUrl as string | undefined
navigateTo({ path: '/auth/login', query: { tab: 'register', ...(callbackUrl ? { callbackUrl } : {}) } }, { replace: true })
</script>
