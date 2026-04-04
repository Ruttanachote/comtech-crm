<template>
  <UPopover v-model:open="isOpen" :popper="{ placement: 'bottom-end' }">
    <!-- Bell Icon Trigger -->
    <UButton
      variant="ghost"
      color="gray"
      class="p-2 relative"
    >
      <UIcon name="i-heroicons-bell" class="w-6 h-6 text-gray-600" />
      
      <!-- Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </UButton>

    <!-- Panel Content -->
    <template #panel>
      <div class="w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col" style="max-height: calc(100vh - 100px); min-height: 200px;">
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
              icon="i-heroicons-check-all"
              @click="markAllAsRead"
            >
              {{ $t('notifications.markAllAsRead') }}
            </UButton>
          </div>

          <!-- Tabs -->
          <div class="flex px-4 pb-3 gap-2">
            <UButton
              size="xs"
              :color="activeTab === 'all' ? 'primary' : 'gray'"
              :variant="activeTab === 'all' ? 'solid' : 'ghost'"
              @click="activeTab = 'all'"
            >
              {{ $t('notifications.tabs.all', { count: totalCount }) }}
            </UButton>
            <UButton
              size="xs"
              :color="activeTab === 'unread' ? 'primary' : 'gray'"
              :variant="activeTab === 'unread' ? 'solid' : 'ghost'"
              @click="activeTab = 'unread'"
            >
              {{ $t('notifications.tabs.unread', { count: unreadCount }) }}
            </UButton>
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
            <UIcon name="i-heroicons-bell-slash" class="w-12 h-12 text-gray-300 mb-3" />
            <p class="text-gray-500 font-medium mb-1">{{ $t('notifications.empty') }}</p>
            <p class="text-sm text-gray-400">{{ $t('notifications.emptyDescription') }}</p>
          </div>

          <!-- Notification List -->
          <div v-else class="divide-y divide-gray-100">
            <NotificationItem
              v-for="notification in notifications"
              :key="notification.id"
              :notification="notification"
              @click="handleNotificationClick"
              @mark-as-read="markAsRead"
              @delete="deleteNotification"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-100 p-3">
          <UButton
            variant="ghost"
            size="sm"
            color="primary"
            block
            to="/notifications"
            @click="isOpen = false"
          >
            {{ $t('notifications.viewAll') }}
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '~/stores/notification.store'
import { mockNotificationResponse } from '~/data/mock/notification.mock'
import NotificationItem from './NotificationItem.vue'
import type { Notification } from '~/types/notification.type'

const store = useNotificationStore()
const router = useRouter()

const isOpen = ref(false)
const activeTab = ref<'all' | 'unread'>('all')

// Load notifications on mount
onMounted(() => {
  store.setNotifications(mockNotificationResponse)
})

// Computed
const notifications = computed(() => {
  if (activeTab.value === 'unread') {
    return store.unreadNotifications
  }
  return store.allNotifications
})

const unreadCount = computed(() => store.getUnreadCount)
const totalCount = computed(() => store.getTotalCount)
const isLoading = computed(() => store.getIsLoading)

// Methods
const handleNotificationClick = (notification: Notification) => {
  if (notification.status === 'unread') {
    store.markAsRead(notification.id)
  }
  if (notification.metadata?.url) {
    router.push(notification.metadata.url)
    isOpen.value = false
  }
}

const markAsRead = (id: string) => {
  store.markAsRead(id)
}

const markAllAsRead = () => {
  store.markAllAsRead()
}

const deleteNotification = (id: string) => {
  store.removeNotification(id)
}
</script>
