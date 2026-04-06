<script setup lang="ts">
import { ref, computed } from 'vue';

// Global translation function
const { t } = useNuxtApp().$i18n;
const router = useRouter();

// Mock Customers Data (based on customer-list-screen-v2.tsx)
const customers = ref([
  {
    id: "CUST-001",
    companyName: "องค์การเภสัชกรรม",
    companyNameEn: "Government Pharmaceutical Organization",
    industry: "Healthcare & Pharmaceutical",
    bu: "HCP",
    pic: "somchai.wong@onelink.co.th",
    picInitials: "สว",
    revenue: "22,191,450",
    status: "Active",
    activeDeals: 2,
    tags: ["KA", "Government", "VIP"],
  },
  {
    id: "CUST-002",
    companyName: "สภากาชาดไทย",
    companyNameEn: "Thai Red Cross Society",
    industry: "Healthcare & Pharmaceutical",
    bu: "HCP",
    pic: "surasak.wong@onelink.co.th",
    picInitials: "สว",
    revenue: "1,170,306",
    status: "Active",
    activeDeals: 1,
    tags: ["Government", "VIP"],
  },
  {
    id: "CUST-003",
    companyName: "สถาบันวิจัยจุฬาภรณ์",
    companyNameEn: "Chulabhorn Research Institute",
    industry: "Healthcare & Pharmaceutical",
    bu: "HCP",
    pic: "somsak.charoen@onelink.co.th",
    picInitials: "สจ",
    revenue: "248,050",
    status: "Active",
    activeDeals: 1,
    tags: ["Government"],
  },
  {
    id: "CUST-018",
    companyName: "บริษัท ไทยยูเนี่ยน โฟรเซ่น โปรดักส์ จำกัด (มหาชน)",
    companyNameEn: "Thai Union Frozen Products PCL",
    industry: "Food & Beverage",
    bu: "F&B",
    pic: "sombat.jindapol@onelink.co.th",
    picInitials: "สจ",
    revenue: "45,250,000",
    status: "Active",
    activeDeals: 8,
    tags: ["KA", "Corporate", "VIP"],
  },
]);

// State
const searchTerm = ref('');
const filterIndustry = ref('all');
const filterBU = ref('all');

// Computed
const filteredCustomers = computed(() => {
  return customers.value.filter((cust) => {
    const matchesSearch =
      cust.companyName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      cust.companyNameEn.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      cust.id.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchesIndustry = filterIndustry.value === 'all' || cust.industry === filterIndustry.value;
    const matchesBU = filterBU.value === 'all' || cust.bu === filterBU.value;

    return matchesSearch && matchesIndustry && matchesBU;
  });
});

const getTagColor = (tag: string) => {
  switch (tag.toLowerCase()) {
    case 'ka': return 'error';
    case 'vip': return 'orange';
    case 'government': return 'primary';
    case 'corporate': return 'purple';
    default: return 'neutral';
  }
};

const onCustomerClick = (customerId: string) => {
  router.push(`/visits/customers/${customerId}`);
};
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">All Customers</h1>
        <p class="text-gray-500 dark:text-gray-400">View and manage all customer accounts</p>
      </div>
      <div class="flex gap-2">
        <UButton icon="i-heroicons-arrow-up-tray" color="white" label="Import" />
        <UButton icon="i-heroicons-plus" color="primary" label="Add Customer" />
      </div>
    </div>

    <!-- Filters -->
    <UCard :ui="{ body: { padding: 'p-4' } }">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <UInput
            v-model="searchTerm"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search customers..."
          />
        </div>
        <USelect
          v-model="filterIndustry"
          :options="['all', 'Healthcare & Pharmaceutical', 'Food & Beverage']"
          placeholder="Filter by Industry"
        />
        <USelect
          v-model="filterBU"
          :options="['all', 'HCP', 'F&B']"
          placeholder="Filter by BU"
        />
      </div>
    </UCard>

    <!-- Customers Table -->
    <UCard :ui="{ body: { padding: 'p-0' } }">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <tr>
            <th class="p-4 font-medium text-gray-500">Customer Name</th>
            <th class="p-4 font-medium text-gray-500">Industry</th>
            <th class="p-4 font-medium text-gray-500">BU</th>
            <th class="p-4 font-medium text-gray-500 text-right">Revenue</th>
            <th class="p-4 font-medium text-gray-500 text-center">Status</th>
            <th class="p-4 font-medium text-gray-500">Tags</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr
            v-for="cust in filteredCustomers"
            :key="cust.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
            @click="onCustomerClick(cust.id)"
          >
            <td class="p-4">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ cust.companyName }}</p>
                <p class="text-xs text-gray-500">{{ cust.companyNameEn }}</p>
              </div>
            </td>
            <td class="p-4 text-gray-600 dark:text-gray-300">{{ cust.industry }}</td>
            <td class="p-4 text-gray-600 dark:text-gray-300">{{ cust.bu }}</td>
            <td class="p-4 text-right font-medium text-gray-900 dark:text-white">{{ cust.revenue }}</td>
            <td class="p-4 text-center">
              <UBadge color="green" variant="subtle" size="xs">{{ cust.status }}</UBadge>
            </td>
            <td class="p-4">
              <div class="flex gap-1 flex-wrap">
                <UBadge
                  v-for="tag in cust.tags"
                  :key="tag"
                  :color="getTagColor(tag)"
                  variant="subtle"
                  size="xs"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </UCard>
  </div>
</template>
