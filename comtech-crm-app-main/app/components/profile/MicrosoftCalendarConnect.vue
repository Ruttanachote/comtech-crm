<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-md' }">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <UIcon name="i-mdi-microsoft" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Microsoft Calendar</h3>
            <p class="text-sm text-gray-500">Connect your calendar</p>
          </div>
        </div>
        <UButton
          variant="ghost"
          color="gray"
          icon="i-heroicons-x-mark"
          @click="close"
        />
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <!-- Status -->
        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div class="w-2 h-2 rounded-full bg-red-500" />
          <span class="text-sm text-gray-600">Not connected</span>
        </div>

        <!-- Benefits -->
        <div class="space-y-3">
          <p class="text-sm font-medium text-gray-700">What you'll get:</p>
          <ul class="space-y-2">
            <li class="flex items-start gap-2 text-sm text-gray-600">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Sync meetings and appointments</span>
            </li>
            <li class="flex items-start gap-2 text-sm text-gray-600">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Get reminders for scheduled tasks</span>
            </li>
            <li class="flex items-start gap-2 text-sm text-gray-600">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Block time for customer visits</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6">
        <UButton
          variant="ghost"
          color="gray"
          class="flex-1"
          @click="close"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          class="flex-1"
          :loading="isConnecting"
          @click="handleConnect"
        >
          <template #leading>
            <UIcon name="i-mdi-microsoft" class="w-5 h-5" />
          </template>
          Connect with Microsoft
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  connect: []
}>()

const isConnecting = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const close = () => {
  isOpen.value = false
}

const handleConnect = async () => {
  isConnecting.value = true
  
  // Simulate connection process
  setTimeout(() => {
    isConnecting.value = false
    emit('connect')
    close()
  }, 1500)
}
</script>
