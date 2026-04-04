<template>
  <UModal
    v-model="isOpen"
    :ui="{
      width: 'sm:max-w-md',
      padding: 'p-0'
    }"
  >
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start gap-4 mb-5">
        <div 
          class="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
          :class="action === 'approve' ? 'bg-green-100' : 'bg-red-100'"
        >
          <UIcon
            :name="action === 'approve' ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
            class="w-6 h-6"
            :class="action === 'approve' ? 'text-green-600' : 'text-red-600'"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ action === 'approve' ? t('approval.confirm.approveTitle') : t('approval.confirm.rejectTitle') }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ action === 'approve' ? t('approval.confirm.approveMessage') : t('approval.confirm.rejectMessage') }}
          </p>
        </div>
      </div>

      <!-- Document Info -->
      <div 
        v-if="document"
        class="bg-gray-50 rounded-lg p-4 mb-5"
      >
        <p class="text-xs text-gray-500 mb-1">{{ t('approval.card.documentNumber') }}</p>
        <p class="text-sm font-mono font-medium text-gray-900 mb-2">{{ document.documentNumber }}</p>
        <p class="text-sm text-gray-700 line-clamp-2">{{ document.title }}</p>
        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>{{ document.customerName }}</span>
          <span>|</span>
          <span class="font-medium text-gray-700">{{ formattedValue }}</span>
        </div>
      </div>

      <!-- Comment Input -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('approval.confirm.comment') }}
        </label>
        <UTextarea
          v-model="comment"
          :placeholder="t('approval.confirm.commentPlaceholder')"
          :rows="3"
          size="md"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <UButton
          color="gray"
          variant="outline"
          :disabled="isLoading"
          @click="close"
        >
          {{ t('approval.confirm.cancel') }}
        </UButton>
        <UButton
          :color="action === 'approve' ? 'green' : 'red'"
          :loading="isLoading"
          @click="confirm"
        >
          {{ t('approval.confirm.confirm') }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import type { ApprovalDocument } from '~/types/approval.type'
import { formatCurrency } from '~/data/mock/approval.mock'

interface Props {
  modelValue: boolean
  action: 'approve' | 'reject' | null
  document: ApprovalDocument | null
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [comment: string]
}>()

const { t } = useI18n()

const comment = ref('')

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formattedValue = computed(() => {
  if (!props.document) return ''
  return formatCurrency(props.document.value, props.document.currency)
})

const close = () => {
  isOpen.value = false
  comment.value = ''
}

const confirm = () => {
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
