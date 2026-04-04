<template>
  <div
    v-if="isOpen"
    class="notification-panel"
    v-click-outside="handleClickOutside"
  >
    <!-- Header -->
    <div class="notification-panel__header">
      <div class="notification-panel__header-top">
        <h3 class="notification-panel__title">
          {{ $t('notifications.title') }}
        </h3>
        <UButton
          variant="ghost"
          size="xs"
          color="primary"
          :icon="'i-heroicons-check-all'"
          @click="handleMarkAllAsRead"
        >
          {{ $t('notifications.markAllAsRead') }}
        </UButton>
      </div>

      <!-- Tabs -->
      <div class="notification-panel__tabs">
        <button
          class="notification-panel__tab"
          :class="{ 'notification-panel__tab--active': activeTab === 'all' }"
          @click="setActiveTab('all')"
        >
          {{ $t('notifications.tabs.all', { count: totalCount }) }}
        </button>
        <button
          class="notification-panel__tab"
          :class="{ 'notification-panel__tab--active': activeTab === 'unread' }"
          @click="setActiveTab('unread')"
        >
          {{ $t('notifications.tabs.unread', { count: unreadCount }) }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="notification-panel__content">
      <!-- Loading State -->
      <div
        v-if="isLoading && notifications.length === 0"
        class="notification-panel__loading"
      >
        <ULoadingIcon class="w-8 h-8" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="notifications.length === 0"
        class="notification-panel__empty"
      >
        <UIcon
          name="i-heroicons-bell-slash"
          class="notification-panel__empty-icon"
        />
        <p class="notification-panel__empty-title">
          {{ $t('notifications.empty') }}
        </p>
        <p class="notification-panel__empty-description">
          {{ $t('notifications.emptyDescription') }}
        </p>
      </div>

      <!-- Notification List -->
      <div
        v-else
        class="notification-panel__list"
      >
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @click="handleNotificationClick"
          @mark-as-read="handleMarkAsRead"
          @delete="handleDelete"
        />

        <!-- Load More -->
        <div
          v-if="hasMore"
          class="notification-panel__load-more"
        >
          <UButton
            variant="ghost"
            size="sm"
            :loading="isLoading"
            @click="handleLoadMore"
          >
            {{ $t('common.loadMore') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="notification-panel__footer">
      <UButton
        variant="ghost"
        size="sm"
        color="primary"
        block
        @click="handleViewAll"
      >
        {{ $t('notifications.viewAll') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Notification } from '~/types/notification.type'
import NotificationItem from './NotificationItem.vue'

interface Props {
  isOpen: boolean
  notifications: Notification[]
  unreadCount: number
  totalCount: number
  isLoading: boolean
  hasMore: boolean
  activeTab: 'all' | 'unread'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  markAsRead: [notificationId: string]
  markAllAsRead: []
  delete: [notificationId: string]
  loadMore: []
  'update:activeTab': [tab: 'all' | 'unread']
}>()

const router = useRouter()

// ============ Methods ============

const handleClickOutside = () => {
  emit('close')
}

const setActiveTab = (tab: 'all' | 'unread') => {
  emit('update:activeTab', tab)
}

const handleNotificationClick = (notification: Notification) => {
  // Mark as read when clicked
  if (notification.status === 'unread') {
    emit('markAsRead', notification.id)
  }

  // Navigate if URL exists
  if (notification.metadata?.url) {
    router.push(notification.metadata.url)
    emit('close')
  }
}

const handleMarkAsRead = (notificationId: string) => {
  emit('markAsRead', notificationId)
}

const handleMarkAllAsRead = () => {
  emit('markAllAsRead')
}

const handleDelete = (notificationId: string) => {
  emit('delete', notificationId)
}

const handleLoadMore = () => {
  emit('loadMore')
}

const handleViewAll = () => {
  router.push('/notifications')
  emit('close')
}
</script>

<style scoped>
.notification-panel {
  @apply absolute top-full right-0 mt-2 w-[400px] max-w-[calc(100vw-2rem)];
  @apply bg-white rounded-xl shadow-xl border border-gray-200;
  @apply flex flex-col z-50;
  max-height: calc(100vh - 100px);
}

.notification-panel__header {
  @apply flex flex-col border-b border-gray-100;
}

.notification-panel__header-top {
  @apply flex items-center justify-between px-4 py-3;
}

.notification-panel__title {
  @apply text-lg font-semibold text-gray-900;
}

.notification-panel__tabs {
  @apply flex px-4 pb-3 gap-2;
}

.notification-panel__tab {
  @apply px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200;
  @apply text-gray-600 hover:bg-gray-100;
}

.notification-panel__tab--active {
  @apply bg-primary-100 text-primary-700;
}

.notification-panel__content {
  @apply flex-1 overflow-y-auto;
  min-height: 200px;
  max-height: 400px;
}

.notification-panel__loading {
  @apply flex items-center justify-center py-8;
}

.notification-panel__empty {
  @apply flex flex-col items-center justify-center py-8 px-4 text-center;
}

.notification-panel__empty-icon {
  @apply w-12 h-12 text-gray-300 mb-3;
}

.notification-panel__empty-title {
  @apply text-gray-500 font-medium mb-1;
}

.notification-panel__empty-description {
  @apply text-sm text-gray-400;
}

.notification-panel__list {
  @apply divide-y divide-gray-100;
}

.notification-panel__load-more {
  @apply flex justify-center py-4;
}

.notification-panel__footer {
  @apply border-t border-gray-100 p-3;
}
</style>
