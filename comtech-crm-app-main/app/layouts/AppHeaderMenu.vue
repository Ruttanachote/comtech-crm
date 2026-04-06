<script setup lang="ts">
  import { useHeaderMenu } from '~/composables/useHeaderMenu';
  import { useSystemStore } from '~~/stores/useSystemStore';
  import { useAuthStore } from '~~/stores/useAuthStore';
  import user from '~/data/user.json';

  const { toggleMenu } = useHeaderMenu();
  const colorMode = useColorMode();
  const { locale, setLocale, t } = useI18n();
  const systemStore = useSystemStore();
  const authStore = useAuthStore();

  const isDark = computed({
    get() {
      return colorMode.value === 'dark';
    },
    set() {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
    },
  });

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const handleLogout = () => {
    systemStore.showLogoutModal = true;
  };

  const search = ref('');
</script>

<template>
  <div>
    <div
      class="w-full h-16 px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between z-10 sticky top-0"
    >
      <!-- Left Section: Menu Toggle & Title -->
      <div class="flex items-center gap-4">
        <UButton
          icon="i-lucide-menu"
          size="md"
          variant="ghost"
          color="neutral"
          @click="toggleMenu"
          class="lg:hidden"
        />
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('header.tasks') }}</h1>

        <!-- Search Bar -->
        <div class="hidden md:block w-64 ml-4">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            :placeholder="t('header.search_placeholder')"
            variant="outline"
            :ui="{ base: 'rounded-full' }"
            class="bg-gray-50 dark:bg-gray-800"
          />
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="flex items-center gap-2 sm:gap-4 h-full">
        <!-- Teleport Target for Page Actions -->
        <div id="header-actions"></div>

        <!-- Notifications -->
        <div class="relative">
          <UButton
            icon="i-heroicons-bell"
            size="xl"
            variant="ghost"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          />
          <span
            class="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900"
          >
            4
          </span>
        </div>

        <!-- Help -->
        <UButton
          variant="ghost"
          :label="t('header.help')"
          class="hidden sm:flex text-gray-500 font-normal hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        />

        <!-- Language Switcher -->
        <div
          class="flex items-center border border-gray-200 dark:border-gray-700 rounded-full p-1 bg-white dark:bg-gray-800"
        >
          <button
            @click="setLocale('en')"
            class="px-3 py-1 text-xs font-medium rounded-full transition-colors"
            :class="
              locale === 'en'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-globe-alt" class="w-3 h-3" />
              EN
            </div>
          </button>
          <button
            @click="setLocale('th')"
            class="px-3 py-1 text-xs font-medium rounded-full transition-colors"
            :class="
              locale === 'th'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-globe-alt" class="w-3 h-3" />
              TH
            </div>
          </button>
        </div>

        <!-- Theme Toggle -->
        <UButton
          icon="i-heroicons-moon-20-solid"
          color="purple"
          variant="ghost"
          :label="t('header.dark_mode')"
          class="hidden sm:flex text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
          @click="toggleTheme"
        />

        <!-- Profile -->
        <div
          class="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700"
        >
          <div class="flex flex-col items-end">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ user.name }}
              </span>
              <UBadge
                color="primary"
                variant="subtle"
                size="xs"
                :label="user.role"
                class="rounded-full"
              />
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('header.own_customers_only') }}
            </span>
          </div>
          <UAvatar :alt="user.initials" size="md" class="bg-primary-500 text-white" />
          <UButton
            icon="i-heroicons-arrow-right-on-rectangle-20-solid"
            size="xl"
            variant="ghost"
            class="ml-1 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="handleLogout"
          />
        </div>
      </div>
    </div>
  </div>
</template>
