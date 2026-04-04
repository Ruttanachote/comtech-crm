<template>
  <div class="relative">
    <!-- Bell Icon -->
    <NotificationBell
      :unread-count="unreadCount"
      :is-connected="isWebSocketConnected"
      :show-connection-status="false"
      @click="togglePanel"
    />

    <!-- Panel -->
    <NotificationPanel
      v-model:active-tab="activeTab"
      :is-open="isPanelOpen"
      :notifications="notifications"
      :unread-count="unreadCount"
      :total-count="totalCount"
      :is-loading="isLoading"
      :has-more="hasMore"
      @close="closePanel"
      @mark-as-read="markAsRead"
      @mark-all-as-read="markAllAsRead"
      @delete="deleteNotification"
      @load-more="loadMore"
    />
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
import NotificationBell from './NotificationBell.vue'
import NotificationPanel from './NotificationPanel.vue'

// Use notification composable
const {
  notifications,
  unreadCount,
  totalCount,
  isLoading,
  isPanelOpen,
  activeTab,
  isWebSocketConnected,
  hasMore,
  togglePanel,
  closePanel,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  loadMore
} = useNotification()
</script>
