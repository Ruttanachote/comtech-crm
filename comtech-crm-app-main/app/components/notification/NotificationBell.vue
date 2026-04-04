<template>
  <div class="relative">
    <UButton
      variant="ghost"
      color="gray"
      class="p-2"
      @click="handleClick"
    >
      <div class="relative">
        <UIcon
          name="i-heroicons-bell"
          class="w-6 h-6 text-gray-600"
        />
        
        <!-- Badge -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
        
        <!-- WebSocket Status Indicator -->
        <span
          v-if="showConnectionStatus"
          class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
          :class="isConnected ? 'bg-green-500' : 'bg-gray-400'"
        />
      </div>
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  unreadCount: number
  isConnected?: boolean
  showConnectionStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isConnected: false,
  showConnectionStatus: false
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>
