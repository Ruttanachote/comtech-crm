<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :ui="{
      width: 'sm:max-w-md',
      padding: 'p-0'
    }"
  >
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center"
          :class="action === 'approve' ? 'bg-green-100' : 'bg-red-100'"
        >
          <UIcon
            :name="action === 'approve' ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
            class="w-5 h-5"
            :class="action === 'approve' ? 'text-green-600' : 'text-red-600'"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ action === 'approve' ? t('approval.confirm.approveTitle') : t('approval.confirm.rejectTitle') }}
          </h3>
        </div>
      </div>

      <!-- Message -->
      <p class="text-sm text-gray-600 mb-4">
        {{ action === 'approve' ? t('approval.confirm.approveMessage') : t('approval.confirm.rejectMessage') }}
      </p>

      <!-- Document Info -->
      <div v-if="document" class="bg-gray-50 rounded-lg p-4 mb-4">
        <p class="text-xs text-gray-500 mb-1">{{ t('approval.card.documentNumber') }}</p>
        <p class="text-sm font-mono text-gray-700 mb-2">{{ document.documentNumber }}</p>
        <p class="text-sm font-medium text-gray-900 line-clamp-2">{{ document.title }}</p>
      </div>

      <!-- Comment Input -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('approval.confirm.comment') }}
        </label>
        <UTextarea
          v-model="comment"
          :placeholder="t('approval.confirm.commentPlaceholder')"
          :ui="{
            rounded: 'rounded-lg'
          }"
          rows="3"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <UButton
          color="gray"
          variant="outline"
          :disabled="isLoading"
          @click="$emit('update:modelValue', false)"
        >
          {{ t('approval.confirm.cancel') }}
        </UButton>
        <UButton
          :color="action === 'approve' ? 'primary' : 'red'"
          :loading="isLoading"
          @click="handleConfirm"
        >
          {{ t('approval.confirm.confirm') }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import type { ApprovalDocument } from '~/types/approval.type'

interface Props {
  modelValue: boolean
  action: 'approve' | 'reject' | null
  document: ApprovalDocument | null
  isLoading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [comment: string]
}>()

const { t } = useI18n()

const comment = ref('')

const handleConfirm = () => {
  emit('confirm', comment.value)
  comment.value = ''
}

// Reset comment when modal opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    comment.value = ''
  }
})
</script>
