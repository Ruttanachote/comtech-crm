<script setup lang="ts">
  import { useSystemStore } from '../../stores/useSystemStore';
  import type { MenuItem } from '~~/types/menu.interface';
  import user from '~/data/user.json';

  const { t } = useI18n();
  const systemStore = useSystemStore();
  const isMenuOpen = computed(() => systemStore.isMenuOpen);
  const route = useRoute();
  const openSubmenus = ref<Set<string>>(new Set());
  const searchMenu = ref('');

  // Define menu structure based on user request (HTML)
  const menuItems = computed<MenuItem[]>(() => [
    {
      label: t('nav.dashboard'),
      icon: 'i-lucide-layout-dashboard',
      to: '/',
      children: [
        { label: t('nav.dashboard_catalog'), icon: 'i-lucide-layers', to: '/' },
        {
          label: t('nav.customer_intelligence'),
          icon: 'i-lucide-brain',
          to: '/customers/insights-bel',
        },
      ],
    },
    {
      label: t('nav.todo_list'),
      icon: 'i-lucide-list-todo',
      to: '/todo-list',
    },
    {
      label: t('nav.visits'),
      icon: 'i-lucide-calendar',
      to: '/visits',
      children: [
        { label: t('nav.visit_activities'), icon: 'i-lucide-calendar', to: '/visits/activities' },
        { label: t('nav.visit_customer'), icon: 'i-lucide-map-pin', to: '/visits/customers' },
      ],
    },
    {
      label: t('nav.customers'),
      icon: 'i-lucide-building-2',
      to: '/customers',
      children: [
        { label: t('nav.customers'), icon: 'i-lucide-users', to: '/customers/customers' },
        { label: t('nav.my_customers'), icon: 'i-lucide-users', to: '/customers/my-customers' },
        { label: t('nav.leads'), icon: 'i-lucide-user-plus', to: '/customers/leads' },
      ],
    },
    {
      label: t('nav.deals'),
      icon: 'i-lucide-folder-kanban',
      to: '/deals',
      children: [
        { label: t('nav.deals'), icon: 'i-lucide-handshake', to: '/deals/deals' },
        { label: t('nav.quotations'), icon: 'i-lucide-file-text', to: '/deals/quotations' },
        { label: t('nav.proposals'), icon: 'i-lucide-file-signature', to: '/deals/proposals' },
        { label: t('nav.contracts'), icon: 'i-lucide-file-check', to: '/deals/contracts' },
      ],
    },
    {
      label: t('nav.approvals'),
      icon: 'i-lucide-circle-check',
      to: '/approvals',
    },
  ]);

  // Props to control behavior
  const props = defineProps({
    showSearch: {
      type: Boolean,
      default: false, // Hidden by default based on Figma screenshot
    },
    alwaysExpanded: {
      type: Boolean,
      default: false,
    },
  });

  const isExpanded = computed(() => props.alwaysExpanded || isMenuOpen.value);

  // Function to toggle submenu
  const toggleSubmenu = (label: string) => {
    if (openSubmenus.value.has(label)) {
      openSubmenus.value.delete(label);
    } else {
      openSubmenus.value.add(label);
    }
  };

  const filteredMenuItems = computed(() => {
    const query = searchMenu.value?.toLowerCase() || '';
    if (!query) return menuItems.value;

    return menuItems.value
      .map((item) => {
        const parentMatch = item.label.toLowerCase().includes(query);
        const matchingChildren = item.children?.filter((child) =>
          child.label.toLowerCase().includes(query)
        );

        if (parentMatch) return { ...item }; // Keep all children if parent matches
        if (matchingChildren?.length) return { ...item, children: matchingChildren };
        return null;
      })
      .filter((item): item is MenuItem => item !== null);
  });

  // Auto-open submenu if it contains the active route
  watch(
    () => route.path,
    () => {
      if (isExpanded.value) {
        menuItems.value.forEach((item) => {
          if (item.children) {
            const hasActiveChild = item.children.some((child) => child.to === route.path);
            if (hasActiveChild) {
              openSubmenus.value.add(item.label);
            }
          }
        });
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div
    class="w-full h-full flex flex-col bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
  >
    <!-- Header (Logo) -->
    <div
      class="flex items-center gap-3 px-6 py-6 border-b border-gray-100 dark:border-gray-800"
      v-if="isExpanded"
    >
      <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-sm">
        <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-white" />
      </div>
      <div class="flex flex-col">
        <span class="font-bold text-lg text-gray-900 dark:text-white leading-tight">CRM</span>
        <span class="text-xs font-medium text-primary-500">{{ user.role }}</span>
      </div>
    </div>
    <div
      class="flex items-center justify-center py-6 border-b border-gray-100 dark:border-gray-800"
      v-else
    >
      <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-sm">
        <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-white" />
      </div>
    </div>

    <!-- Search Bar (Optional) -->
    <div class="pt-4 pb-2 px-4" v-if="props.showSearch && isExpanded">
      <UInput
        v-model="searchMenu"
        icon="i-lucide-search"
        :placeholder="t('general.search-menu')"
        variant="outline"
        class="w-full"
        :ui="{ trailing: 'p-0' }"
      >
        <template #trailing v-if="searchMenu">
          <UButton variant="link" icon="i-lucide-x" :padded="false" @click="searchMenu = ''" />
        </template>
      </UInput>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
      <template v-for="(item, index) in filteredMenuItems" :key="index">
        <!-- Single Menu Item -->
        <template v-if="!item.children || item.children.length === 0">
          <NuxtLink
            :to="item.to"
            class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 font-medium shadow-sm group cursor-pointer"
            :class="[
              route.path === item.to
                ? 'bg-linear-to-r from-primary-400 to-primary-600 text-white shadow-md'
                : 'bg-primary-50 text-[#1a1a2e] dark:bg-gray-800 dark:text-gray-200 hover:text-[#1a1a2e] dark:hover:text-white',
            ]"
            :title="!isExpanded ? item.label : ''"
          >
            <span
              :class="
                route.path === item.to ? 'text-white' : 'text-primary-600 dark:text-primary-400'
              "
            >
              <UIcon :name="item.icon" class="h-5 w-5 shrink-0" />
            </span>
            <span v-if="isExpanded" class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </template>

        <!-- Menu Item with Submenu -->
        <template v-else>
          <div>
            <button
              @click="toggleSubmenu(item.label)"
              class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 font-medium shadow-sm group cursor-pointer"
              :class="[
                route.path === item.to || item.children?.some((child) => route.path === child.to)
                  ? 'bg-linear-to-r from-primary-400 to-primary-600 text-white shadow-md'
                  : 'bg-primary-50 text-[#1a1a2e] dark:bg-gray-800 dark:text-gray-200 hover:text-[#1a1a2e] dark:hover:text-white',
              ]"
              :title="!isExpanded ? item.label : ''"
            >
              <span
                :class="
                  route.path === item.to || item.children?.some((child) => route.path === child.to)
                    ? 'text-white'
                    : 'text-primary-600 dark:text-primary-400'
                "
              >
                <UIcon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
              </span>
              <span v-if="isExpanded" class="truncate">{{ item.label }}</span>
              <UIcon
                v-if="isExpanded"
                name="i-lucide-chevron-down"
                class="h-5 w-5 flex-shrink-0 ml-auto transition-transform duration-200"
                :class="[
                  route.path === item.to || item.children?.some((child) => route.path === child.to)
                    ? 'text-white'
                    : 'text-primary-600 dark:text-primary-400',
                  { 'rotate-180': openSubmenus.has(item.label) },
                ]"
              />
            </button>

            <!-- Submenu Items -->
            <div v-show="isExpanded && openSubmenus.has(item.label)" class="mt-1 ml-4 space-y-1">
              <NuxtLink
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
                :to="child.to"
                class="flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all duration-200 font-medium shadow-sm group cursor-pointer"
                :class="[
                  route.path === child.to
                    ? 'bg-linear-to-r from-primary-400 to-primary-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
                ]"
              >
                <span
                  :class="
                    route.path === child.to
                      ? 'text-white'
                      : 'text-primary-600 dark:text-primary-400'
                  "
                >
                  <UIcon :name="child.icon" class="h-4 w-4 shrink-0" />
                </span>
                <span class="truncate">{{ child.label }}</span>
              </NuxtLink>
            </div>
          </div>
        </template>
      </template>
    </nav>

    <!-- Footer (Profile) -->
    <div
      class="mt-auto border-t border-gray-100 dark:border-gray-800 bg-primary-50/50 dark:bg-gray-900 p-4"
    >
      <div class="flex items-center gap-3" v-if="isExpanded">
        <div
          class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium shadow-sm shrink-0"
        >
          {{ user.initials }}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-bold text-sm text-gray-900 dark:text-white truncate">
            {{ user.name }}
          </span>
          <span class="text-xs text-primary-500 truncate">{{ user.role }}</span>
        </div>
        <button
          class="ml-auto text-primary-500 hover:text-primary-600 p-1 rounded-full hover:bg-primary-100 dark:hover:bg-gray-800 transition-colors"
        >
          <UIcon name="i-lucide-settings" class="w-5 h-5" />
        </button>
      </div>
      <div class="flex justify-center" v-else>
        <div
          class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium shadow-sm cursor-pointer"
          :title="user.name"
        >
          {{ user.initials }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Custom scrollbar for menu */
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 4px;
  }
  .dark ::-webkit-scrollbar-thumb {
    background: #374151;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
  }
  .dark ::-webkit-scrollbar-thumb:hover {
    background: #4b5563;
  }
</style>
