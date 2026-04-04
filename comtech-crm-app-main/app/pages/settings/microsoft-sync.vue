<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <UButton
            variant="ghost"
            color="gray"
            icon="i-heroicons-arrow-left"
            @click="goBack"
          />
          <h1 class="text-xl font-semibold text-gray-900">Microsoft Sync</h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-4 py-8">
      <!-- Outlook / Office 365 Card -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-gray-900">Outlook / Office 365</h2>
              <p class="text-sm text-gray-500">Connect to sync your events</p>
            </div>
          </div>
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <!-- Description -->
      <div class="text-center py-8">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-envelope" class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-600 max-w-md mx-auto">
          Sync your Microsoft Outlook or Office 365 calendar events with our internal system automatically.
        </p>
      </div>

      <!-- Connect Button -->
      <div class="flex justify-center mt-8">
        <UButton
          color="gray"
          size="lg"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isConnecting = ref(false)

const goBack = () => {
  router.back()
}

const handleConnect = async () => {
  isConnecting.value = true
  
  // Simulate connection process
  setTimeout(() => {
    isConnecting.value = false
    // TODO: Implement actual Microsoft OAuth flow
    alert('Microsoft OAuth connection would start here')
  }, 1500)
}
</script>
