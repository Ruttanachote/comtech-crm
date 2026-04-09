<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">
      {{ t('approval.detail.actions.title') }}
    </h3>
    <p class="text-sm text-gray-500 mb-6">
      {{ t('approval.detail.actions.subtitle') }} <span class="font-medium text-gray-700">{{ currentUserRole }}</span>
    </p>

    <!-- Comment Input -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ t('approval.detail.actions.comment') }}
      </label>
      <UTextarea
        v-model="comment"
        :placeholder="t('approval.detail.actions.commentPlaceholder')"
        rows="3"
        maxlength="500"
      />
      <p class="text-xs text-gray-400 mt-1 text-right">
        {{ comment.length }}/500
      </p>
    </div>

    <!-- File Attachments -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ t('approval.detail.actions.attachments') }}
      </label>
      
      <!-- File List -->
      <div v-if="attachments.length > 0" class="space-y-2 mb-3">
        <div
          v-for="(file, index) in attachments"
          :key="index"
          class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document" class="w-4 h-4 text-gray-400" />
            <span class="text-sm text-gray-700">{{ file.name }}</span>
            <span class="text-xs text-gray-400">({{ formatFileSize(file.size) }})</span>
          </div>
          <UButton
            color="red"
            variant="ghost"
            size="xs"
            @click="removeAttachment(index)"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </UButton>
        </div>
      </div>

      <!-- Add File Button -->
      <UButton
        color="gray"
        variant="soft"
        size="sm"
        @click="openFilePicker"
      >
        <UIcon name="i-heroicons-paper-clip" class="w-4 h-4 mr-2" />
        {{ t('approval.detail.actions.attachDocument') }}
      </UButton>
      <input
        ref="fileInput"
        type="file"
        multiple
        class="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        @change="handleFileSelect"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap items-center gap-3">
      <UButton
        color="emerald"
        variant="solid"
        size="lg"
        :loading="loading === 'approve'"
        :disabled="!!loading"
        class="flex-1 min-w-[120px]"
        @click="handleApprove"
      >
        <UIcon name="i-heroicons-check" class="w-5 h-5 mr-2" />
        {{ t('approval.detail.actions.approve') }}
      </UButton>

      <UButton
        color="red"
        variant="soft"
        size="lg"
        :loading="loading === 'reject'"
        :disabled="!!loading"
        class="flex-1 min-w-[120px]"
        @click="handleReject"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5 mr-2" />
        {{ t('approval.detail.actions.reject') }}
      </UButton>

      <UButton
        color="amber"
        variant="soft"
        size="lg"
        :loading="loading === 'requestMoreInfo'"
        :disabled="!!loading"
        class="flex-1 min-w-[120px]"
        @click="handleRequestMoreInfo"
      >
        <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 mr-2" />
        {{ t('approval.detail.actions.requestMoreInfo') }}
      </UButton>
    </div>

    <!-- Confirmation Modal -->
    <UModal v-model="showConfirmModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              :name="confirmAction === 'approve' ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
              :class="confirmAction === 'approve' ? 'text-emerald-500' : 'text-red-500'"
              class="w-6 h-6"
            />
            <h3 class="text-lg font-semibold">
              {{ confirmTitle }}
            </h3>
          </div>
        </template>

        <p class="text-gray-600">
          {{ confirmMessage }}
        </p>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              @click="showConfirmModal = false"
            >
              {{ t('common.cancel') }}
            </UButton>
            <UButton
              :color="confirmAction === 'approve' ? 'emerald' : 'red'"
              @click="executeAction"
            >
              {{ t('common.confirm') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
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

// State
const comment = ref('')
const attachments = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const showConfirmModal = ref(false)
const confirmAction = ref<'approve' | 'reject' | 'requestMoreInfo' | null>(null)

// Computed
const confirmTitle = computed(() => {
  switch (confirmAction.value) {
    case 'approve':
      return t('approval.messages.confirmApprove')
    case 'reject':
      return t('approval.messages.confirmReject')
    default:
      return t('common.confirm')
  }
})

const confirmMessage = computed(() => {
  switch (confirmAction.value) {
    case 'approve':
      return t('approval.messages.confirmApproveMessage')
    case 'reject':
      return t('approval.messages.confirmRejectMessage')
    default:
      return ''
  }
})

// Methods
function openFilePicker() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    // Check file size (max 10MB)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(t('approval.messages.fileTooLarge', { name: file.name }))
        return false
      }
      return true
    })
    attachments.value.push(...validFiles)
  }
  // Reset input
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
  
  const data = {
    comment: comment.value,
    attachments: attachments.value,
  }

  switch (confirmAction.value) {
    case 'approve':
      emit('approve', data)
      break
    case 'reject':
      emit('reject', data)
      break
    case 'requestMoreInfo':
      emit('requestMoreInfo', data)
      break
  }

  // Reset form
  comment.value = ''
  attachments.value = []
}
</script>
