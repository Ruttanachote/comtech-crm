<script setup lang="ts">
import { ref, computed } from 'vue';

// Global translation function
const { t } = useNuxtApp().$i18n;
const router = useRouter();

// Mock Data
const mockLeads = ref([
  {
    id: "LEAD-2024-001",
    name: "Digital Commerce Solutions",
    leadType: "Cold Call",
    industry: "Electronics",
    supplyChainRole: "Distributor",
    businessGroup: "B2B2C",
    email: "contact@digitalcommerce.com",
    phone: "+1 (555) 123-4567",
    estimatedValue: "$850,000",
    stage: "Contact",
    priority: "High",
  },
  {
    id: "LEAD-2024-002",
    name: "Green Energy Corp",
    leadType: "Existing Customer",
    industry: "Energy",
    supplyChainRole: "Manufacturer",
    businessGroup: "Commodity",
    email: "info@greenenergy.com",
    phone: "+1 (555) 234-5678",
    estimatedValue: "$1,200,000",
    stage: "Needs Analysis",
    priority: "High",
  },
  {
    id: "LEAD-2024-003",
    name: "Fresh Foods Distribution",
    leadType: "Marketing Group",
    industry: "Food & FMCG",
    supplyChainRole: "Distributor",
    businessGroup: "Healthcare & Pharma",
    email: "sales@freshfoods.com",
    phone: "+1 (555) 345-6789",
    estimatedValue: "$650,000",
    stage: "Contact",
    priority: "Medium",
  },
  {
    id: "LEAD-2024-004",
    name: "AutoParts Plus",
    leadType: "Cold Call",
    industry: "Automotive",
    supplyChainRole: "Wholesaler / Retailer",
    businessGroup: "Freight / 3PL / 4PL",
    email: "inquiries@autopartsplus.com",
    phone: "+1 (555) 456-7890",
    estimatedValue: "$420,000",
    stage: "Lead",
    priority: "Medium",
  },
  {
    id: "LEAD-2024-005",
    name: "BuildRight Materials",
    leadType: "Management",
    industry: "Construction",
    supplyChainRole: "Manufacturer",
    businessGroup: "Commodity",
    email: "contact@buildright.com",
    phone: "+1 (555) 567-8901",
    estimatedValue: "$980,000",
    stage: "Needs Analysis",
    priority: "High",
  },
  {
    id: "LEAD-2024-006",
    name: "Fashion Forward Inc",
    leadType: "Other",
    industry: "Fashion",
    supplyChainRole: "Importer",
    businessGroup: "B2B2C",
    email: "hello@fashionforward.com",
    phone: "+1 (555) 678-9012",
    estimatedValue: "$310,000",
    stage: "Lead",
    priority: "Low",
  },
]);

// State
const searchTerm = ref('');
const filterStage = ref('all');
const filterPriority = ref('all');
const filterIndustry = ref('all');

// Computed
const filteredLeads = computed(() => {
  return mockLeads.value.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchesStage = filterStage.value === 'all' || lead.stage === filterStage.value;
    const matchesPriority = filterPriority.value === 'all' || lead.priority === filterPriority.value;
    const matchesIndustry = filterIndustry.value === 'all' || lead.industry === filterIndustry.value;

    return matchesSearch && matchesStage && matchesPriority && matchesIndustry;
  });
});

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'gray';
  }
};

const onLeadClick = (leadId: string) => {
  // router.push(`/customers/leads/${leadId}`);
  console.log('Navigate to lead:', leadId);
};
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
        <p class="text-gray-500 dark:text-gray-400">Manage and track your sales leads</p>
      </div>
      <div class="flex gap-2">
        <UButton icon="i-heroicons-arrow-up-tray" color="white" label="Import" />
        <UButton icon="i-heroicons-plus" color="primary" label="Add Lead" />
      </div>
    </div>

    <!-- Filters -->
    <UCard :ui="{ body: { padding: 'p-4' } }">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-1">
          <UInput
            v-model="searchTerm"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search leads..."
          />
        </div>
        <USelect
          v-model="filterStage"
          :options="['all', 'Lead', 'Contact', 'Needs Analysis']"
          placeholder="Filter by Stage"
        />
        <USelect
          v-model="filterPriority"
          :options="['all', 'High', 'Medium', 'Low']"
          placeholder="Filter by Priority"
        />
        <USelect
          v-model="filterIndustry"
          :options="['all', 'Electronics', 'Energy', 'Food & FMCG', 'Automotive', 'Construction', 'Fashion']"
          placeholder="Filter by Industry"
        />
      </div>
    </UCard>

    <!-- Leads Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="lead in filteredLeads"
        :key="lead.id"
        class="cursor-pointer hover:shadow-md transition-shadow"
        @click="onLeadClick(lead.id)"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ lead.name }}</h3>
            <p class="text-xs text-gray-500">{{ lead.id }}</p>
          </div>
          <UBadge :color="getPriorityColor(lead.priority)" variant="subtle">{{ lead.priority }}</UBadge>
        </div>
        
        <div class="space-y-2 mt-4">
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <UIcon name="i-heroicons-briefcase" class="w-4 h-4 text-gray-400" />
            <span>{{ lead.industry }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 text-gray-400" />
            <span>{{ lead.estimatedValue }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <UIcon name="i-heroicons-tag" class="w-4 h-4 text-gray-400" />
            <span>{{ lead.stage }}</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div class="flex -space-x-2">
            <UAvatar :alt="lead.name" size="xs" class="ring-2 ring-white dark:ring-gray-900" />
          </div>
          <UButton
            v-if="lead.email"
            icon="i-lucide-mail"
            color="neutral"
            variant="ghost"
            size="xs"
            @click.stop="window.open(`mailto:${lead.email}`)"
          />
          <UButton
            v-if="lead.phone"
            icon="i-lucide-phone"
            color="neutral"
            variant="ghost"
            size="xs"
            @click.stop="window.open(`tel:${lead.phone}`)"
          />
          <span class="text-xs text-gray-500">{{ lead.leadType }}</span>
        </div>
      </UCard>
    </div>
  </div>
</template>
