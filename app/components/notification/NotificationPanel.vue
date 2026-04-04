<template>
  <div
    v-if="isOpen"
    class="absolute top-full right-0 mt-2 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col z-50"
    style="max-height: calc(100vh - 100px); min-height: 200px;"
    v-click-outside="handleClickOutside"
  >
    <!-- Header -->
    <div class="flex flex-col border-b border-gray-100">
      <div class="flex items-center justify-between px-4 py-3">
        <h3 class="text-lg font-semibold text-gray-900">
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
      <div class="flex px-4 pb-3 gap-2">
        <button
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="activeTab === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
          @click="setActiveTab('all')"
        >
          {{ $t('notifications.tabs.all', { count: totalCount }) }}
        </button>
        <button
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="activeTab === 'unread' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
          @click="setActiveTab('unread')"
        >
          {{ $t('notifications.tabs.unread', { count: unreadCount }) }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto" style="max-height: 400px;">
      <!-- Loading State -->
      <div
        v-if="isLoading && notifications.length === 0"
        class="flex items-center justify-center py-8"
      >
        <ULoadingIcon class="w-8 h-8" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="notifications.length === 0"
        class="flex flex-col items-center justify-center py-8 px-4 text-center"
      >
        <UIcon
          name="i-heroicons-bell-slash"
          class="w-12 h-12 text-gray-300 mb-3"
        />
        <p class="text-gray-500 font-medium mb-1">
          {{ $t('notifications.empty') }}
        </p>
        <p class="text-sm text-gray-400">
          {{ $t('notifications.emptyDescription') }}
        </p>
      </div>

      <!-- Notification List -->
      <div
        v-else
        class="divide-y divide-gray-100"
      >
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          class="group"
          @click="handleNotificationClick"
          @mark-as-read="handleMarkAsRead"
          @delete="handleDelete"
        />

        <!-- Load More -->
        <div
          v-if="hasMore"
          class="flex justify-center py-4"
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
    <div class="border-t border-gray-100 p-3">
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
