<script setup lang="ts">
  import activitiesData from '~/data/activities.json';
  import dayjs from 'dayjs';

  // Global translation function
  const { t } = useNuxtApp().$i18n;

  // State
  const searchTerm = ref('');
  const filterType = ref('all');
  const viewMode = ref<'table' | 'card'>('table');
  const activities = ref(activitiesData);

  // Computed
  const filteredActivities = computed(() => {
    return activities.value.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.value.toLowerCase());
      const matchesType = filterType.value === 'all' || activity.type === filterType.value;
      return matchesSearch && matchesType;
    });
  });

  const stats = computed(() => {
    return {
      total: activities.value.length,
      planned: activities.value.filter((a) => a.status === 'planned').length,
      completed: activities.value.filter((a) => a.status === 'completed').length,
      thisWeek: activities.value.filter((a) => {
        const actDate = dayjs(a.scheduledDate);
        const today = dayjs();
        const weekFromNow = today.add(7, 'day');
        return actDate.isAfter(today.subtract(1, 'day')) && actDate.isBefore(weekFromNow);
      }).length,
    };
  });

  const activityTypes = computed(() => [
    { label: t('common.all_types'), value: 'all', icon: undefined },
    { label: t('common.visits'), value: 'visit', icon: 'i-heroicons-map-pin' },
    { label: t('common.meetings'), value: 'meeting', icon: 'i-heroicons-users' },
    { label: t('common.calls'), value: 'call', icon: 'i-heroicons-phone' },
  ]);

  // Helpers
  const getActivityClass = (activity: any) => {
    const colorMap: Record<string, string> = {
      visit: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      call: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      meeting: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      email: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      presentation: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300',
    };
    return (
      colorMap[activity.type] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
    );
  };

  const getActivityTypeLabel = (type: string) => {
    const labelMap: Record<string, string> = {
      visit: t('common.visits'),
      call: t('common.calls'),
      meeting: t('common.meetings'),
      email: 'Email',
      presentation: 'Presentation',
    };
    return labelMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return dayjs(time).format('HH:mm');
  };

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      visit: 'i-heroicons-map-pin',
      call: 'i-heroicons-phone',
      meeting: 'i-heroicons-users',
      email: 'i-heroicons-envelope',
      presentation: 'i-heroicons-computer-desktop',
    };
    return iconMap[type] || 'i-heroicons-clock';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      planned: 'primary',
      confirmed: 'info',
      in_progress: 'orange',
      completed: 'success',
      cancelled: 'error',
      postponed: 'warning',
    };
    return colorMap[status] || 'neutral';
  };

  const getActivityStatusLabel = (status: string) => {
    // Use translations if available, otherwise fallback to title case
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const getOutcomeColor = (outcome: string) => {
    const colorMap: Record<string, string> = {
      deal_closed: 'green',
      quotation_requested: 'blue',
      follow_up_scheduled: 'cyan',
      information_provided: 'green',
      no_interest: 'orange',
    };
    return colorMap[outcome] || 'gray';
  };

  const getOutcomeLabel = (outcome: string) => {
    return t(`activities.outcome.${outcome}`);
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('D MMM YYYY');
  };

  const getCustomerName = (customerId: string) => {
    const customers: Record<string, string> = {
      cust_001: 'CP Foods',
      cust_002: 'Unilever Thailand',
      cust_003: 'Toyota Thailand',
    };
    return customers[customerId] || customerId;
  };
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('activities.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">{{ t('activities.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <CommonButton
          icon="i-heroicons-funnel"
          color="white"
          variant="solid"
          :label="t('common.filter')"
        />
        <CommonButton
          icon="i-heroicons-plus"
          color="primary"
          variant="solid"
          :label="t('activities.new_activity')"
          @click="console.log('Add Activity')"
        />
      </div>
    </div>

    <!-- Dashboard Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <CommonCard v-for="(stat, index) in stats" :key="index">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
          </div>
          <div :class="`p-2 rounded-lg ${stat.color}`">
            <CommonIcon :name="stat.icon" size="w-6 h-6" color="text-white" />
          </div>
        </div>
        <div class="mt-2 flex items-center text-sm">
          <span
            :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
            class="flex items-center"
          >
            <CommonIcon
              :name="
                stat.trend > 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'
              "
              size="w-4 h-4"
              class="mr-1"
            />
            {{ Math.abs(stat.trend) }}%
          </span>
          <span class="text-gray-400 ml-1">vs last month</span>
        </div>
      </CommonCard>
    </div>

    <!-- Main Content -->
    <CommonCard body="p-0">
      <template #header>
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="relative w-full sm:w-64">
              <CommonIcon
                name="i-heroicons-magnifying-glass"
                size="w-5 h-5"
                color="text-gray-400"
                class="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                v-model="searchTerm"
                type="text"
                :placeholder="t('common.search') + '...'"
                class="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <!-- View Toggle -->
            <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <CommonButton
                icon="i-heroicons-table-cells"
                color="neutral"
                variant="ghost"
                size="xs"
                :class="{ '!bg-white dark:!bg-gray-700 shadow-sm': viewMode === 'table' }"
                @click="viewMode = 'table'"
              />
              <CommonButton
                icon="i-heroicons-squares-2x2"
                color="neutral"
                variant="ghost"
                size="xs"
                :class="{ '!bg-white dark:!bg-gray-700 shadow-sm': viewMode === 'card' }"
                @click="viewMode = 'card'"
              />
            </div>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <CommonButton
              v-for="type in activityTypes"
              :key="type.value"
              :label="type.label"
              size="xs"
              :variant="filterType === type.value ? 'solid' : 'ghost'"
              :color="filterType === type.value ? 'primary' : 'gray'"
              @click="filterType = type.value"
            />
          </div>
        </div>
      </template>

      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
            >
              <th class="px-6 py-3 font-medium">{{ t('common.activity') }}</th>
              <th class="px-6 py-3 font-medium">{{ t('common.customer') }}</th>
              <th class="px-6 py-3 font-medium">{{ t('common.date_time') }}</th>
              <th class="px-6 py-3 font-medium">{{ t('common.status') }}</th>
              <th class="px-6 py-3 font-medium">{{ t('common.outcome') }}</th>
              <th class="px-6 py-3 font-medium text-right">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="activity in filteredActivities"
              :key="activity.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div :class="`p-2 rounded-lg ${getActivityClass(activity)} bg-opacity-10`">
                    <CommonIcon
                      :name="getActivityIcon(activity.type)"
                      size="w-5 h-5"
                      :class="getActivityClass(activity)"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ getActivityTypeLabel(activity.type) }}
                    </div>
                    <div class="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                      {{ activity.title }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ activity.customer }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ formatDate(activity.date) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(activity.startTime) }} - {{ formatTime(activity.endTime) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <CommonBadge :color="getStatusColor(activity.status)" variant="subtle" size="xs">
                  {{ getActivityStatusLabel(activity.status) }}
                </CommonBadge>
              </td>
              <td class="px-6 py-4">
                <CommonBadge
                  v-if="activity.outcome"
                  :color="getOutcomeColor(activity.outcome)"
                  variant="outline"
                  size="xs"
                >
                  {{ getOutcomeLabel(activity.outcome) }}
                </CommonBadge>
                <span v-else class="text-xs text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 text-right">
                <CommonButton
                  icon="i-heroicons-ellipsis-vertical"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card View -->
      <div v-else class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CommonCard
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div :class="`p-2 rounded-lg ${getActivityClass(activity)} bg-opacity-10`">
                <CommonIcon
                  :name="getActivityIcon(activity.type)"
                  size="w-5 h-5"
                  :class="getActivityClass(activity)"
                />
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ getActivityTypeLabel(activity.type) }}
                </h3>
                <p class="text-xs text-gray-500">{{ formatDate(activity.date) }}</p>
              </div>
            </div>
            <CommonBadge :color="getStatusColor(activity.status)" variant="subtle" size="xs">
              {{ getActivityStatusLabel(activity.status) }}
            </CommonBadge>
          </div>

          <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 line-clamp-1">
            {{ activity.title }}
          </h4>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CommonIcon name="i-heroicons-building-office-2" size="w-4 h-4" />
              <span class="truncate">{{ activity.customer }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CommonIcon name="i-heroicons-clock" size="w-4 h-4" />
              <span>{{ formatTime(activity.startTime) }} - {{ formatTime(activity.endTime) }}</span>
            </div>
          </div>

          <div
            class="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center"
            v-if="activity.outcome"
          >
            <span class="text-xs text-gray-500">{{ t('common.outcome') }}:</span>
            <CommonBadge
              :color="getOutcomeColor(activity.outcome)"
              variant="subtle"
              size="xs"
              class="w-full justify-center"
            >
              {{ getOutcomeLabel(activity.outcome) }}
            </CommonBadge>
          </div>
        </CommonCard>
      </div>
    </CommonCard>
  </div>
</template>
