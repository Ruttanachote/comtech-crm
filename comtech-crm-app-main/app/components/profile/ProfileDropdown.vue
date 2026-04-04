<template>
  <div class="relative">
    <!-- Profile Button Trigger -->
    <button
      class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-100': isOpen }"
      @click="toggleDropdown"
    >
      <!-- Role/Department Badge -->
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <UIcon name="i-heroicons-globe-alt" class="w-4 h-4" />
        <span>{{ userRole }}</span>
      </div>
      
      <!-- Avatar -->
      <div 
        class="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
        :style="{ backgroundColor: avatarColor }"
      >
        {{ userInitials }}
      </div>
    </button>

    <!-- Dropdown Panel -->
    <div
      v-show="isOpen"
      class="absolute top-full right-0 mt-2 w-72 h-105 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col z-50 overflow-hidden"
    >
      <div v-if="!openMicrosoft">
      <!-- User Info Header -->
        <div class="flex flex-col items-center py-6 px-4 border-b border-gray-100">
          <!-- Large Avatar -->
          <div 
            class="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-xl mb-3"
            :style="{ backgroundColor: avatarColor }"
          >
            {{ userInitials }}
          </div>
          
          <!-- Name -->
          <h3 class="text-lg font-semibold text-gray-900">
            {{ userName }}
          </h3>
          
          <!-- Email -->
          <p class="text-sm text-gray-500 mb-1">
            {{ userEmail }}
          </p>
          
          <!-- Role Badge -->
          <span class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            {{ userRole }}
          </span>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <!-- Microsoft Calendar -->
          <button
            class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            @click="handleConnectMicrosoft"
          >
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <UIcon name="i-mdi-microsoft" class="w-5 h-5 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Microsoft Calendar</p>
              <p class="text-xs text-gray-500">Not connected</p>
            </div>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
          </button>

          <!-- Divider -->
          <div class="my-2 border-t border-gray-100" />

          <!-- System Settings -->
          <button
            class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            @click="handleSystemSettings"
          >
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-gray-600" />
            </div>
            <span class="flex-1 text-sm font-medium text-gray-900">System Settings</span>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
          </button>

          <!-- Divider -->
          <div class="my-2 border-t border-gray-100" />

          <!-- Sign Out -->
          <button
            class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors group"
            @click="handleSignOut"
          >
            <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100">
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 text-red-500" />
            </div>
            <span class="flex-1 text-sm font-medium text-red-500">Sign out</span>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
      <div v-else>
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
              <h1 class="text-lg font-semibold text-gray-900">Microsoft Sync</h1>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '~/stores/profile.store'
import { mockUserProfile, mockConnections } from '~/data/mock/profile.mock'

const store = useProfileStore()
const router = useRouter()

const isOpen = ref(false)

// Avatar color (based on initials)
const avatarColor = computed(() => {
  const colors = ['#00BC7D', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4']
  const index = userInitials.value.charCodeAt(0) % colors.length
  return colors[index]
})

// User data from store
const userName = computed(() => store.getUserName || 'User')
const userEmail = computed(() => store.getUserEmail || '')
const userInitials = computed(() => store.getUserInitials || 'U')
const userRole = computed(() => store.getUserRole || 'User')

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Close when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdown = document.querySelector('.profile-dropdown')
  if (dropdown && !dropdown.contains(target)) {
    isOpen.value = false
  }
}

const openMicrosoft = ref(false)

const isConnecting = ref(false)

const goBack = () => {
  openMicrosoft.value = false
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


// Handlers
const handleConnectMicrosoft = () => {
  openMicrosoft.value = true 
  // router.push('/settings/microsoft-sync')
  // isOpen.value = false
}

const handleSystemSettings = () => {
  router.push('/settings')
  isOpen.value = false
}

const handleSignOut = () => {
  store.clearProfile()
  router.push('/auth/login')
  isOpen.value = false
}

// Lifecycle
onMounted(() => {
  // Load mock data
  store.setUser(mockUserProfile)
  store.setConnections(mockConnections)
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
