<template></template>

<script setup lang="ts">
  import { useAuthStore } from '~~/stores/useAuthStore';

  definePageMeta({
    layout: false,
  });

  const authStore = useAuthStore();
  const router = useRouter();

  onMounted(async () => {
    try {
      const isAuthenticated = await authStore.login();

      if (isAuthenticated) {
        await router.push('/');
      }
    } catch (error) {
      console.error('Failed to initiate login:', error);
    }
  });
</script>
