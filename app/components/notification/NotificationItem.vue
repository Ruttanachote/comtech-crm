<template>
  <div
    class="notification-item"
    :class="{
      'notification-item--unread': isUnread,
      'notification-item--high': isHighPriority
    }"
    @click="handleClick"
  >
    <!-- Icon -->
    <NotificationIcon :type="notification.type" />

    <!-- Content -->
    <div class="notification-item__content">
      <div class="notification-item__header">
        <h4 class="notification-item__title">
          {{ $t(notification.title) }}
        </h4>
        <span class="notification-item__time">
          {{ formattedTime }}
        </span>
      </div>
      
      <p class="notification-item__message">
        {{ notification.message }}
      </p>
      
      <div class="notification-item__footer">
        <!-- Priority Badge -->
        <span
          v-if="isHighPriority"
          class="notification-item__priority"
        >
          {{ $t('notifications.priority.high') }}
        </span>
        
        <!-- Unread Dot -->
        <span
          v-if="isUnread"
          class="notification-item__unread-dot"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="notification-item__actions">
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

<style scoped>
.notification-item {
  @apply flex items-start gap-3 p-4 cursor-pointer transition-colors duration-200;
  @apply hover:bg-gray-50;
}

.notification-item--unread {
  @apply bg-blue-50/50;
}

.notification-item--unread:hover {
  @apply bg-blue-50;
}

.notification-item__content {
  @apply flex-1 min-w-0;
}

.notification-item__header {
  @apply flex items-start justify-between gap-2 mb-1;
}

.notification-item__title {
  @apply text-sm font-semibold text-gray-900 truncate;
}

.notification-item__time {
  @apply text-xs text-gray-500 flex-shrink-0;
}

.notification-item__message {
  @apply text-sm text-gray-600 line-clamp-2 mb-2;
}

.notification-item__footer {
  @apply flex items-center gap-2;
}

.notification-item__priority {
  @apply inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full;
  @apply bg-red-100 text-red-700;
}

.notification-item__unread-dot {
  @apply w-2 h-2 rounded-full bg-blue-500;
}

.notification-item__actions {
  @apply flex items-center gap-1 opacity-0 transition-opacity duration-200;
}

.notification-item:hover .notification-item__actions {
  @apply opacity-100;
}
</style>
