<script setup lang="ts">
  import { ref } from 'vue';

  // Global translation function
  const { t } = useNuxtApp().$i18n;
  const router = useRouter();

  // Mock Data (Single Customer Detail for My Customer view)
  // In a real app, this would fetch the logged-in user's customer details or list
  const customerId = 'CUST-001';

  // Using the same component structure as Customer Detail but tailored for "My Customer" view
  // Since we don't have the full CustomerDetailHCPV2 implementation, we'll redirect or show a simplified version
  // For this task, I'll implement a placeholder that mimics the structure

  const onBack = () => {
    router.push('/customers/customers');
  };
</script>

<template>
  <div class="p-4">
    <div class="flex items-center gap-2 mb-4">
      <UButton variant="ghost" icon="i-heroicons-chevron-left" @click="onBack">Back</UButton>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Customer Detail</h1>
    </div>

    <UCard>
      <div class="text-center py-12">
        <div class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-full inline-block mb-4">
          <UIcon
            name="i-heroicons-user-circle"
            class="w-12 h-12 text-primary-600 dark:text-primary-400"
          />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">My Customer View</h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          This page represents the "My Customer Detail" view (HCP V2). It typically shows detailed
          information for a specific customer assigned to the logged-in user.
        </p>
        <div class="mt-6">
          <UButton
            color="primary"
            label="Go to Customer Detail"
            @click="router.push(`/visits/customers/${customerId}`)"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
