<script setup lang="ts">
  import { ref, computed } from 'vue';
  import dayjs from 'dayjs';

  // Global translation function
  const { t } = useNuxtApp().$i18n;
  const router = useRouter();

  // Mock Customer Data (Simulating structure from Figma)
  const customer = ref({
    id: 'CUST-2024-0892',
    companyName: 'Global Freight Solutions Inc.',
    industry: 'Logistics & Transportation',
    taxId: '0105558123456',
    parentCompany: 'Global Shipping Alliance',
    serviceModel: 'International Freight',
    salesChannel: 'Direct Sales',
    status: 'Active',
    accountOwner: 'Sarah Chen',
    contacts: [
      {
        id: 1,
        name: 'John Davidson',
        title: 'Operations Director',
        email: 'john.d@globalfreight.com',
        phone: '+1 (555) 123-4567',
        isPrimary: true,
      },
      {
        id: 2,
        name: 'Sarah Chen',
        title: 'Senior Account Manager',
        email: 'sarah.chen@newuscrm.com',
        phone: '+1 (555) 234-5678',
        isPrimary: false,
      },
      {
        id: 3,
        name: 'Michael Torres',
        title: 'Finance Manager',
        email: 'm.torres@globalfreight.com',
        phone: '+1 (555) 345-6789',
        isPrimary: false,
      },
    ],
    addresses: [
      {
        id: 1,
        type: 'Billing Address',
        street: '450 Market Street, Suite 2100',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94111',
        country: 'United States',
        isPrimary: true,
      },
      {
        id: 2,
        type: 'Shipping Address',
        street: '1250 Warehouse Blvd',
        city: 'Oakland',
        state: 'CA',
        zipCode: '94607',
        country: 'United States',
        isPrimary: false,
      },
      {
        id: 3,
        type: 'Corporate Office',
        street: '88 Broadway Ave, Floor 15',
        city: 'New York',
        state: 'NY',
        zipCode: '10004',
        country: 'United States',
        isPrimary: false,
      },
    ],
  });

  // Mock Service Revenue Data
  const serviceRevenue = ref([
    { id: '01', name: 'Freight', value: null, type: null },
    { id: '02', name: 'Customs', value: null, type: null },
    { id: '03', name: 'Warehouse', value: '1,800,000.00', type: 'ยอดขาย' },
    { id: '04', name: 'Transportation', value: null, type: null },
    { id: '05', name: 'Cross Border', value: null, type: null },
    { id: '06', name: 'Trading', value: null, type: null },
    { id: '07', name: 'Service', value: 'Opp', type: 'Opportunity' },
    { id: '08', name: 'IT', value: 'Opp', type: 'Opportunity' },
    { id: '09', name: 'Telematics', value: null, type: null },
    { id: '10', name: 'Other', value: null, type: null },
    { id: '11', name: 'Unknown', value: null, type: null },
  ]);

  // Mock Activity History
  const activityHistory = ref([
    {
      id: '1',
      action: 'created',
      entity: 'Customer',
      user: 'Sarah Chen',
      timestamp: '2024-11-20T09:00:00Z',
      description: "Created customer account 'Global Freight Solutions Inc.'",
    },
  ]);

  // State for Tabs
  const items = [
    { label: 'Overview', slot: 'overview', icon: 'i-heroicons-information-circle' },
    { label: 'Contacts', slot: 'contacts', icon: 'i-heroicons-users' },
    { label: 'Addresses', slot: 'addresses', icon: 'i-heroicons-map-pin' },
    { label: 'Activities', slot: 'activities', icon: 'i-heroicons-clock' },
  ];

  const selectedTab = ref(0);

  const onBack = () => {
    router.push('/visits/customers');
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('DD MMM YYYY HH:mm');
  };
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Back Button -->
    <UButton variant="ghost" icon="i-heroicons-chevron-left" class="mb-2" @click="onBack">
      {{ t('common.back_to_list') || 'Back to Customer List' }}
    </UButton>

    <!-- Header Card -->
    <UCard class="mb-4">
      <div class="flex justify-between items-start">
        <div class="flex gap-4">
          <div class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <UIcon
              name="i-heroicons-building-office-2"
              class="w-8 h-8 text-primary-600 dark:text-primary-400"
            />
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ customer.companyName }}
              </h1>
              <UBadge color="green" variant="subtle">{{ customer.status }}</UBadge>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-identification" class="w-4 h-4" />
                <span>{{ customer.id }}</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-briefcase" class="w-4 h-4" />
                <span>{{ customer.industry }}</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-user" class="w-4 h-4" />
                <span>{{ customer.accountOwner }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <UButton icon="i-heroicons-pencil-square" color="gray" variant="ghost" label="Edit" />
          <UButton icon="i-heroicons-plus" color="primary" label="New Activity" />
        </div>
      </div>
    </UCard>

    <!-- Tabs -->
    <UTabs :items="items" class="w-full">
      <template #overview="{ item }">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Company Info -->
          <UCard class="md:col-span-2">
            <template #header>
              <h3 class="font-semibold text-gray-900 dark:text-white">Company Information</h3>
            </template>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Tax ID</p>
                <p class="font-medium">{{ customer.taxId }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Parent Company</p>
                <p class="font-medium">{{ customer.parentCompany }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Service Model</p>
                <p class="font-medium">{{ customer.serviceModel }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Sales Channel</p>
                <p class="font-medium">{{ customer.salesChannel }}</p>
              </div>
            </div>
          </UCard>

          <!-- Service Revenue -->
          <UCard>
            <template #header>
              <h3 class="font-semibold text-gray-900 dark:text-white">Service Revenue</h3>
            </template>
            <div class="space-y-3">
              <div
                v-for="service in serviceRevenue"
                :key="service.id"
                class="flex justify-between items-center text-sm"
              >
                <span class="text-gray-600 dark:text-gray-300">{{ service.name }}</span>
                <div v-if="service.value" class="text-right">
                  <span class="font-medium block">{{ service.value }}</span>
                  <span class="text-xs text-gray-400">{{ service.type }}</span>
                </div>
                <span v-else class="text-gray-400">-</span>
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <template #contacts="{ item }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <UCard v-for="contact in customer.contacts" :key="contact.id">
            <div class="flex items-start justify-between">
              <div class="flex gap-3">
                <UAvatar :alt="contact.name" size="md" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ contact.name }}</p>
                  <p class="text-sm text-gray-500">{{ contact.title }}</p>
                </div>
              </div>
              <UBadge v-if="contact.isPrimary" color="primary" variant="subtle" size="xs">
                Primary
              </UBadge>
            </div>
            <div class="mt-4 space-y-2 text-sm">
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                <span>{{ contact.email }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <UIcon name="i-heroicons-phone" class="w-4 h-4" />
                <span>{{ contact.phone }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <template #addresses="{ item }">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <UCard v-for="addr in customer.addresses" :key="addr.id">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ addr.type }}</h4>
              <UBadge v-if="addr.isPrimary" color="primary" variant="subtle" size="xs">
                Primary
              </UBadge>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>{{ addr.street }}</p>
              <p>{{ addr.city }}, {{ addr.state }} {{ addr.zipCode }}</p>
              <p>{{ addr.country }}</p>
            </div>
          </UCard>
        </div>
      </template>

      <template #activities="{ item }">
        <div class="mt-4">
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="font-semibold text-gray-900 dark:text-white">Activity History</h3>
              </div>
            </template>
            <div class="space-y-4">
              <div
                v-for="activity in activityHistory"
                :key="activity.id"
                class="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
              >
                <div class="mt-1">
                  <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    <span class="font-bold">{{ activity.user }}</span>
                    {{ activity.action }} {{ activity.entity }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </UTabs>
  </div>
</template>
