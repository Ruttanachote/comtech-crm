<script setup lang="ts">
  import { useSystemStore } from '~/stores/useSystemStore';
  import { useAuthStore } from '~/stores/useAuthStore';
  import ConfirmModal from '~/components/modal/ConfirmModal.vue';

  const route = useRoute();
  const systemStore = useSystemStore();
  const authStore = useAuthStore();
  const { t } = useI18n();

  const isOpenLogout = computed({
    get: () => systemStore.showLogoutModal,
    set: (value) => {
      systemStore.showLogoutModal = value;
    },
  });

  const onSave = async () => {
    systemStore.showLogoutModal = false;
    await authStore.logout();
  };

  const onCancel = () => {
    systemStore.showLogoutModal = false;
  };

  // Check if current route should use default layout
  const showLayout = computed(() => {
    // If we're on a public auth page, don't show layout
    if (route.path.startsWith('/auth/')) return false;
    return route.meta.layout !== false;
  });
</script>

<template>
  <ClientOnly>
    <UApp>
      <NuxtPwaManifest />
      
      <!-- Auth pages (no layout) -->
      <NuxtPage v-if="!showLayout" />
      
      <!-- App pages (with layout) -->
      <NuxtLayout v-else name="default">
        <NuxtPage />
      </NuxtLayout>

      <!-- Global Logout Modal -->
      <Teleport to="body">
        <ConfirmModal
          :open="isOpenLogout"
          :title="t('common.logout_title') || 'Logout Confirmation'"
          :description="t('common.logout_desc') || 'Are you sure you want to logout?'"
          @confirm="onSave"
          @cancel="onCancel"
        />
      </Teleport>
    </UApp>
  </ClientOnly>
</template>
