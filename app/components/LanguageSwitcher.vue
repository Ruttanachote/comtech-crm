<script setup lang="ts">
  const { locale, setLocale } = useI18n();

  const switchLanguage = (lang: string) => {
    setLocale(lang as 'en' | 'th');
  };
</script>

<template>
  <div class="flex items-center gap-2">
    <UButton
      v-for="lang in ['en', 'th']"
      :key="lang"
      :variant="locale === lang ? 'solid' : 'ghost'"
      size="xs"
      class="uppercase font-bold"
      @click="switchLanguage(lang)"
    >
      {{ lang }}
    </UButton>
  </div>
</template>
