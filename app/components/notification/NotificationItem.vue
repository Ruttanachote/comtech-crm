<template>
  <div
    class="flex items-start gap-3 p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
    :class="{ 'bg-blue-50/50 hover:bg-blue-50': isUnread }"
    @click="handleClick"
  >
    <!-- Icon -->
    <NotificationIcon :type="notification.type" />

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2 mb-1">
        <h4 class="text-sm font-semibold text-gray-900 truncate">
          {{ $t(notification.title) }}
        </h4>
        <span class="text-xs text-gray-500 flex-shrink-0">
          {{ formattedTime }}
        </span>
      </div>
      
      <p class="text-sm text-gray-600 line-clamp-2 mb-2">
        {{ notification.message }}
      </p>
      
      <div class="flex items-center gap-2">
        <!-- Priority Badge -->
        <span
          v-if="isHighPriority"
          class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700"
        >
          {{ $t('notifications.priority.high') }}
        </span>
        
        <!-- Unread Dot -->
        <span
          v-if="isUnread"
          class="w-2 h-2 rounded-full bg-blue-500"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <UButton
        v-if="isUnread"
        variant="ghost"
        size="xs"
        color="gray"
        :icon="'i-heroicons-check'"
        @click.stop="handleMarkAsRead"
      />
      <UButton
        variant="ghost"
        size="xs"
        color="gray"
        :icon="'i-heroicons-trash'"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Notification } from '~/types/notification.type'
import { NotificationPriority, NotificationStatus } from '~/types/notification.type'
import NotificationIcon from './NotificationIcon.vue'

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime)

interface Props {
  notification: Notification
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [notification: Notification]
  markAsRead: [notificationId: string]
  delete: [notificationId: string]
}>()

const { t, locale } = useI18n()

// ============ Computed ============

const isUnread = computed(() => props.notification.status === NotificationStatus.UNREAD)

const isHighPriority = computed(() => props.notification.priority === NotificationPriority.HIGH)

const formattedTime = computed(() => {
  const date = dayjs(props.notification.createdAt)
  const now = dayjs()
  const diffMinutes = now.diff(date, 'minute')
  const diffHours = now.diff(date, 'hour')
  const diffDays = now.diff(date, 'day')

  if (diffMinutes < 1) {
    return t('notifications.time.justNow')
  } else if (diffMinutes < 60) {
    return t('notifications.time.minutesAgo', { count: diffMinutes })
  } else if (diffHours < 24) {
    return t('notifications.time.hoursAgo', { count: diffHours })
  } else if (diffDays < 7) {
    return t('notifications.time.daysAgo', { count: diffDays })
  } else {
    return date.format('DD MMM YYYY')
  }
})

// ============ Methods ============

const handleClick = () => {
  emit('click', props.notification)
}

const handleMarkAsRead = () => {
  emit('markAsRead', props.notification.id)
}

const handleDelete = () => {
  emit('delete', props.notification.id)
}
</script>
