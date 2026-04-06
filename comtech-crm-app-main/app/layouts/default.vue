<script setup lang="ts">
  import AppHeaderMenu from './AppHeaderMenu.vue';
  import AppSideMenu from './AppSideMenu.vue';
  import ConfirmModal from '~/components/modal/ConfirmModal.vue';
  import { useSystemStore } from '~/stores/useSystemStore';
  import { useAuthStore } from '~/stores/useAuthStore';

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
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar (Left) -->
    <AppSideMenu class="shrink-0 h-full z-20" />

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 min-w-0">
      <!-- Header -->
      <AppHeaderMenu class="shrink-0" />

      <!-- Page Content -->
      <main class="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
        <slot />
      </main>

      <!-- Footer -->
      <footer
        class="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-xs text-gray-500 dark:text-gray-400"
      >
        © {{ new Date().getFullYear() }} SCGJWD | Dynamic IT Solutions. All rights reserved.
      </footer>
    </div>

    <!-- Logout Modal -->
    <Teleport to="body">
      <ConfirmModal
        :open="isOpenLogout"
        :title="t('common.logout_title') || 'Logout Confirmation'"
        :description="t('common.logout_desc') || 'Are you sure you want to logout?'"
        @confirm="onSave"
        @cancel="onCancel"
      />
    </Teleport>
  </div>
</template>
