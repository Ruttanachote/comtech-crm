<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ t('approval.detail.activity') }}
    </h3>

    <!-- Activity List -->
    <div v-if="activities.length > 0" class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex gap-4"
      >
        <!-- Avatar -->
        <UAvatar
          :src="activity.user.avatar"
          :alt="activity.user.name"
          size="md"
        />

        <!-- Content -->
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-medium text-gray-900">{{ activity.user.name }}</span>
            <span class="text-sm text-gray-500">({{ activity.user.role }})</span>
          </div>

          <p class="text-sm text-gray-700 mb-1">
            <span v-if="activity.action === 'submitted'" class="text-blue-600">
              {{ t('approval.activity.submitted') }}
            </span>
            <span v-else-if="activity.action === 'approved'" class="text-emerald-600">
              {{ t('approval.activity.approved') }}
            </span>
            <span v-else-if="activity.action === 'rejected'" class="text-red-600">
              {{ t('approval.activity.rejected') }}
            </span>
            <span v-else-if="activity.action === 'request_more_info'" class="text-amber-600">
              {{ t('approval.activity.requestedMoreInfo') }}
            </span>
            <span v-else-if="activity.action === 'commented'">
              {{ t('approval.activity.commented') }}
            </span>
          </p>

          <p v-if="activity.comment" class="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2">
            {{ activity.comment }}
          </p>

          <p class="text-xs text-gray-400 mt-1">
            {{ formatDateTime(activity.timestamp) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">{{ t('approval.messages.noComments') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalActivity } from '~/types/approval.type'

interface Props {
  activities: ApprovalActivity[]
}

const props = defineProps<Props>()

const { t, locale } = useI18n()

// Methods
function formatDateTime(date: string): string {
  return new Date(date).toLocaleString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
