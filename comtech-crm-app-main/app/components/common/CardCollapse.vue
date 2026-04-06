<script setup lang="ts">
  const props = defineProps({
    isBackground: {
      type: Boolean,
      default: true,
    },
    body: {
      type: String,
      default: 'p-4',
    },
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
  });

  const isCollapsed = ref(props.defaultCollapsed);

  const toggleCollapse = (event: MouseEvent) => {
    // ตรวจสอบว่าไม่ได้คลิกที่ปุ่มหรือ icon
    if (!(event.target as HTMLElement).closest('button')) {
      isCollapsed.value = !isCollapsed.value;
    }
  };
</script>
<template>
  <div class="bg-white dark:bg-gray-900 shadow rounded-lg ring-1 ring-gray-200 dark:ring-white/70">
    <!-- Header -->
    <div
      v-if="$slots.header"
      :class="[
        'p-4 rounded-t-lg rounded-b-none cursor-pointer',
        !props.isBackground ? '!px-4 bg-none' : 'px-2 bg-gray-100 dark:bg-gray-800',
      ]"
      @click="toggleCollapse"
    >
      <div class="flex flex-col space-y-2">
        <div class="flex items-center justify-between">
          <div class="mr-4">
            <UIcon
              name="i-heroicons-chevron-down"
              :class="[
                'w-5 h-5 transition-transform duration-200',
                isCollapsed ? 'rotate-0' : 'rotate-180',
              ]"
            />
          </div>
          <div class="flex-1">
            <slot name="header" />
          </div>
        </div>
        <slot name="detail" v-if="$slots.detail && !isCollapsed" />
      </div>
    </div>

    <!-- Body -->
    <div v-if="!isCollapsed" class="sm:p-4 p-4">
      <slot />
    </div>
  </div>
</template>
