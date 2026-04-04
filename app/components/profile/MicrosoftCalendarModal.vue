<template>
  <UModal v-model="isOpen" :ui="{ 
    width: 'sm:max-w-md',
    overlay: { background: 'bg-gray-900/50' }
  }">
    <div class="bg-white rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-heroicons-arrow-left"
          class="p-1"
          @click="close"
        />
        <h1 class="text-base font-semibold text-gray-900">Microsoft Sync</h1>
      </div>

      <!-- Content -->
      <div class="p-4 bg-white">
        <!-- Outlook / Office 365 Card -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-blue-500" />
              </div>
              <div class="min-w-0">
                <h2 class="text-sm font-semibold text-gray-900">Outlook / Office 365</h2>
                <p class="text-xs text-gray-500">Connect to sync your events</p>
              </div>
            </div>
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </div>

        <!-- Description -->
        <div class="text-center py-2">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
          </div>
          <p class="text-gray-600 text-xs max-w-[240px] mx-auto leading-relaxed">
            Sync your Microsoft Outlook or Office 365 calendar events with our internal system automatically.
          </p>
        </div>

        <!-- Connect Button -->
        <div class="flex justify-center mt-6">
          <UButton
            class="bg-gray-800 hover:bg-gray-700 text-white text-sm px-5 py-2.5 rounded-lg flex items-center gap-2"
            :loading="isConnecting"
            @click="handleConnect"
          >
            <UIcon name="i-mdi-microsoft" class="w-4 h-4" />
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
