<template>
  <UModal v-model="isOpen" :ui="{ 
    width: 'sm:max-w-md',
    overlay: { background: 'bg-gray-900/50' }
  }">
    <div class="bg-white rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-4 px-4 py-4 border-b border-gray-100 bg-white">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-heroicons-arrow-left"
          @click="close"
        />
        <h1 class="text-lg font-semibold text-gray-900">Microsoft Sync</h1>
      </div>

      <!-- Content -->
      <div class="p-6 bg-white">
        <!-- Outlook / Office 365 Card -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-gray-600" />
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-gray-900">Outlook / Office 365</h2>
                <p class="text-sm text-gray-500">Connect to sync your events</p>
              </div>
            </div>
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        </div>

        <!-- Description -->
        <div class="text-center py-4">
          <div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-gray-400" />
          </div>
          <p class="text-gray-600 text-sm max-w-xs mx-auto leading-relaxed">
            Sync your Microsoft Outlook or Office 365 calendar events with our internal system automatically.
          </p>
        </div>

        <!-- Connect Button -->
        <div class="flex justify-center mt-8">
          <UButton
            color="gray"
            size="lg"
            class="bg-gray-900 hover:bg-gray-800 text-white px-6"
            :loading="isConnecting"
            @click="handleConnect"
          >
            <template #leading>
              <UIcon name="i-mdi-microsoft" class="w-5 h-5" />
            </template>
            Connect Microsoft Account
          </UButton>
        </div>
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
