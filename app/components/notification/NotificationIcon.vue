<template>
  <div
    class="notification-icon"
    :class="`notification-icon--${type}`"
    :style="{ backgroundColor: iconConfig.bgColor }"
  >
    <UIcon
      :name="iconConfig.icon"
      class="notification-icon__icon"
      :style="{ color: iconConfig.iconColor }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NotificationType } from '~/types/notification.type'
import type { NotificationIconConfig } from '~/types/notification.type'

interface Props {
  type: NotificationType
}

const props = defineProps<Props>()

// กำหนดค่าไอคอนตามประเภท
const iconConfigMap: Record<NotificationType, NotificationIconConfig> = {
  [NotificationType.APPROVAL]: {
    icon: 'i-heroicons-document-check',
    bgColor: '#F3E8FF', // purple-100
    iconColor: '#9333EA'  // purple-600
  },
  [NotificationType.TASK]: {
    icon: 'i-heroicons-clipboard-document-list',
    bgColor: '#FEF3C7', // amber-100
    iconColor: '#D97706'  // amber-600
  },
  [NotificationType.DEAL]: {
    icon: 'i-heroicons-currency-dollar',
    bgColor: '#DBEAFE', // blue-100
    iconColor: '#2563EB'  // blue-600
  },
  [NotificationType.COMMENT]: {
    icon: 'i-heroicons-chat-bubble-left-right',
    bgColor: '#E0E7FF', // indigo-100
    iconColor: '#4F46E5'  // indigo-600
  },
  [NotificationType.CUSTOMER]: {
    icon: 'i-heroicons-user-group',
    bgColor: '#D1FAE5', // emerald-100
    iconColor: '#059669'  // emerald-600
  },
  [NotificationType.SYSTEM]: {
    icon: 'i-heroicons-cog-6-tooth',
    bgColor: '#F3F4F6', // gray-100
    iconColor: '#6B7280'  // gray-500
  },
  [NotificationType.QUOTATION]: {
    icon: 'i-heroicons-document-text',
    bgColor: '#FCE7F3', // pink-100
    iconColor: '#DB2777'  // pink-600
  }
}

const iconConfig = computed(() => iconConfigMap[props.type])
</script>

<style scoped>
.notification-icon {
  @apply flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0;
}

.notification-icon__icon {
  @apply w-5 h-5;
}
</style>
