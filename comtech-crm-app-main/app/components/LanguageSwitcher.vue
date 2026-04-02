<template>
  <UDropdown
    :items="items"
    :popper="{ placement: 'bottom-end' }"
  >
    <UButton
      color="gray"
      variant="ghost"
      icon="i-lucide-globe"
      :label="currentLocale === 'en' ? 'EN' : 'TH'"
    />
  </UDropdown>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

const currentLocale = computed(() => locale.value)

const items = [
  [{
    label: 'English',
    click: () => setLocale('en'),
  },
  {
    label: 'ไทย',
    click: () => setLocale('th'),
  }],
]
</script>
