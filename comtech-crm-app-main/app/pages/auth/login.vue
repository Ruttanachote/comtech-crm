<template>
  <div class="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center gap-4">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      <p class="text-sm text-gray-500 dark:text-gray-400">กำลังเข้าสู่ระบบ...</p>
    </div>
  </div>
</template>

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
