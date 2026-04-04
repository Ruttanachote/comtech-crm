<template>
  <div class="notification-bell">
    <UButton
      variant="ghost"
      color="gray"
      class="notification-bell__button"
      @click="handleClick"
    >
      <div class="notification-bell__icon-wrapper">
        <UIcon
          name="i-heroicons-bell"
          class="notification-bell__icon"
        />
        
        <!-- Badge -->
        <span
          v-if="unreadCount > 0"
          class="notification-bell__badge"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
        
        <!-- WebSocket Status Indicator -->
        <span
          v-if="showConnectionStatus"
          class="notification-bell__status"
          :class="`notification-bell__status--${connectionStatus}`"
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

const connectionStatus = computed(() => {
  return props.isConnected ? 'connected' : 'disconnected'
})

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.notification-bell {
  @apply relative;
}

.notification-bell__button {
  @apply p-2;
}

.notification-bell__icon-wrapper {
  @apply relative;
}

.notification-bell__icon {
  @apply w-6 h-6 text-gray-600;
}

.notification-bell__badge {
  @apply absolute -top-1 -right-1 flex items-center justify-center;
  @apply min-w-[18px] h-[18px] px-1;
  @apply text-xs font-bold text-white bg-red-500 rounded-full;
  @apply border-2 border-white;
}

.notification-bell__status {
  @apply absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white;
}

.notification-bell__status--connected {
  @apply bg-green-500;
}

.notification-bell__status--disconnected {
  @apply bg-gray-400;
}
</style>
