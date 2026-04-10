<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <!-- Action Required Banner -->
    <div class="bg-blue-600 px-5 py-3 flex items-center gap-2">
      <UIcon name="i-heroicons-bell-alert" class="w-5 h-5 text-white shrink-0" />
      <div>
        <p class="text-sm font-semibold text-white">{{ t('approval.detail.actions.actionRequired') }}</p>
        <p class="text-xs text-blue-100">{{ t('approval.detail.actions.reviewingAs') }} <span class="font-medium text-white">{{ currentUserRole }}</span></p>
      </div>
    </div>

    <div class="p-5">
      <!-- Comment Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {{ t('approval.detail.actions.comment') }}
        </label>
        <textarea
          v-model="comment"
          :placeholder="t('approval.detail.actions.commentPlaceholder')"
          rows="3"
          maxlength="500"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">{{ comment.length }}/500</p>
      </div>

      <!-- File Attachments -->
      <div class="mb-5">
        <!-- File List -->
        <div v-if="attachments.length > 0" class="space-y-2 mb-2">
          <div
            v-for="(file, index) in attachments"
            :key="index"
            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center gap-2 min-w-0">
              <UIcon name="i-heroicons-document" class="w-4 h-4 text-gray-400 shrink-0" />
              <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ file.name }}</span>
              <span class="text-xs text-gray-400 shrink-0">({{ formatFileSize(file.size) }})</span>
            </div>
            <button
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              @click="removeAttachment(index)"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Attach Button -->
        <button
          class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          @click="openFilePicker"
        >
          <UIcon name="i-heroicons-paper-clip" class="w-4 h-4" />
          {{ t('approval.detail.actions.attachDocument') }}
        </button>
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          @change="handleFileSelect"
        />
      </div>

      <!-- Stacked Action Buttons -->
      <div class="space-y-2.5">
        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          :class="loading === 'approve' ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'"
          :disabled="!!loading"
          @click="handleApprove"
        >
          <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
          {{ t('approval.detail.actions.approve') }}
        </button>

        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          :class="loading === 'reject' ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'"
          :disabled="!!loading"
          @click="handleReject"
        >
          <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
          {{ t('approval.detail.actions.reject') }}
        </button>

        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          :class="loading === 'requestMoreInfo' ? 'opacity-50 cursor-not-allowed' : ''"
          :disabled="!!loading"
          @click="handleRequestMoreInfo"
        >
          <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5" />
          {{ t('approval.detail.actions.requestMoreInfo') }}
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showConfirmModal = false" />
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon
              :name="confirmAction === 'approve' ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
              :class="confirmAction === 'approve' ? 'text-emerald-500' : 'text-red-500'"
              class="w-6 h-6"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ confirmTitle }}</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ confirmMessage }}</p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors text-sm"
              @click="showConfirmModal = false"
            >
              {{ t('approval.actions.cancel') }}
            </button>
            <button
              class="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium"
              :class="confirmAction === 'approve' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'"
              @click="executeAction"
            >
              {{ t('approval.actions.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentUserRole: string
  loading?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: null,
})

const emit = defineEmits<{
  (e: 'approve', data: { comment: string; attachments: File[] }): void
  (e: 'reject', data: { comment: string; attachments: File[] }): void
  (e: 'requestMoreInfo', data: { comment: string; attachments: File[] }): void
}>()

const { t } = useI18n()

const comment = ref('')
const attachments = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const showConfirmModal = ref(false)
const confirmAction = ref<'approve' | 'reject' | 'requestMoreInfo' | null>(null)

const confirmTitle = computed(() => {
  switch (confirmAction.value) {
    case 'approve': return t('approval.messages.confirmApprove')
    case 'reject': return t('approval.messages.confirmReject')
    default: return t('approval.actions.confirm')
  }
})

const confirmMessage = computed(() => {
  switch (confirmAction.value) {
    case 'approve': return t('approval.messages.confirmApproveMessage')
    case 'reject': return t('approval.messages.confirmRejectMessage')
    default: return ''
  }
})

function openFilePicker() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(t('approval.messages.fileTooLarge', { name: file.name }))
        return false
      }
      return true
    })
    attachments.value.push(...validFiles)
  }
  input.value = ''
}

function removeAttachment(index: number) {
  attachments.value.splice(index, 1)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function handleApprove() {
  confirmAction.value = 'approve'
  showConfirmModal.value = true
}

function handleReject() {
  confirmAction.value = 'reject'
  showConfirmModal.value = true
}

function handleRequestMoreInfo() {
  confirmAction.value = 'requestMoreInfo'
  executeAction()
}

function executeAction() {
  showConfirmModal.value = false
  const data = { comment: comment.value, attachments: attachments.value }
  switch (confirmAction.value) {
    case 'approve': emit('approve', data); break
    case 'reject': emit('reject', data); break
    case 'requestMoreInfo': emit('requestMoreInfo', data); break
  }
  comment.value = ''
  attachments.value = []
}
</script>
