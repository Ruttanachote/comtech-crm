<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
      <div class="p-4">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Comtech CRM</h1>
      </div>
      <nav class="px-4 py-2">
        <ul class="space-y-1">
          <li>
            <NuxtLink
              to="/"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              active-class="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            >
              <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5" />
              Dashboard
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="ml-64 min-h-screen">
      <!-- Header -->
      <header class="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('dashboard.title') }}
          </h2>
          <div class="flex items-center gap-4">
            <!-- Language Switcher -->
            <LanguageSwitcher />
            <!-- User Menu -->
            <UButton
              icon="i-lucide-user"
              color="gray"
              variant="ghost"
            />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
