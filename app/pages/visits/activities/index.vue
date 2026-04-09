<script setup lang="ts">
  import dayjs from 'dayjs';
  import weekday from 'dayjs/plugin/weekday';
  import isoWeek from 'dayjs/plugin/isoWeek';

  dayjs.extend(weekday);
  dayjs.extend(isoWeek);

  // Global translation function
  const { t } = useNuxtApp().$i18n;

  // State
  const currentDate = ref(dayjs());
  const displayMode = ref<'month' | 'week' | 'day' | 'list'>('month');
  const searchTerm = ref('');

  // Types
  type ActivityType =
    | 'customer_visit'
    | 'sales_meeting'
    | 'site_survey'
    | 'internal_meeting'
    | 'follow_up_call'
    | 'task_reminder';
  type ActivityStatus = 'planned' | 'completed' | 'cancelled';

  interface Activity {
    id: string;
    title: string;
    type: ActivityType;
    status: ActivityStatus;
    startTime: Date;
    endTime: Date;
    location?: string;
    customer?: string;
    assignedTo: string;
    notes?: string;
  }

  // Mock Data (replicated from Figma source)
  const activities = ref<Activity[]>([
    {
      id: 'ACT-001',
      title: 'New Year Sales Review Meeting',
      type: 'internal_meeting',
      status: 'completed',
      startTime: new Date(2026, 1, 2, 9, 0),
      endTime: new Date(2026, 1, 2, 11, 0),
      location: 'Conference Room A',
      assignedTo: 'You',
      notes: 'Q4 2025 performance review',
    },
    {
      id: 'ACT-002',
      title: 'Site Visit - ABC Logistics',
      type: 'customer_visit',
      status: 'completed',
      startTime: new Date(2026, 1, 3, 10, 0),
      endTime: new Date(2026, 1, 3, 12, 0),
      location: 'Ladkrabang Industrial Estate',
      customer: 'ABC Logistics Co., Ltd.',
      assignedTo: 'You',
    },
    {
      id: 'ACT-003',
      title: 'Contract Negotiation - DHL',
      type: 'sales_meeting',
      status: 'completed',
      startTime: new Date(2026, 1, 4, 14, 0),
      endTime: new Date(2026, 1, 4, 16, 0),
      location: 'DHL Office - Sathorn',
      customer: 'DHL Supply Chain Thailand',
      assignedTo: 'Sarah Chen',
    },
    {
      id: 'ACT-004',
      title: 'Warehouse Survey - New Facility',
      type: 'site_survey',
      status: 'completed',
      startTime: new Date(2026, 1, 5, 9, 0),
      endTime: new Date(2026, 1, 5, 12, 0),
      location: 'Samut Prakan',
      customer: 'Thai Cold Storage',
      assignedTo: 'Michael Park',
    },
    {
      id: 'ACT-005',
      title: 'Follow-up: Q1 Pricing Proposal',
      type: 'follow_up_call',
      status: 'completed',
      startTime: new Date(2026, 1, 6, 10, 30),
      endTime: new Date(2026, 1, 6, 11, 0),
      customer: 'Kerry Express',
      assignedTo: 'You',
    },
    {
      id: 'ACT-006',
      title: 'Team Weekly Sync',
      type: 'internal_meeting',
      status: 'completed',
      startTime: new Date(2026, 1, 6, 15, 0),
      endTime: new Date(2026, 1, 6, 16, 0),
      location: 'Virtual - Teams',
      assignedTo: 'You',
    },
    // Add some activities for current month (dynamic)
    {
      id: 'ACT-CURR-1',
      title: 'Project Kickoff',
      type: 'internal_meeting',
      status: 'planned',
      startTime: dayjs().hour(10).minute(0).toDate(),
      endTime: dayjs().hour(11).minute(30).toDate(),
      location: 'Meeting Room 1',
      assignedTo: 'You',
    },
    {
      id: 'ACT-CURR-2',
      title: 'Client Lunch',
      type: 'customer_visit',
      status: 'planned',
      startTime: dayjs().add(1, 'day').hour(12).minute(0).toDate(),
      endTime: dayjs().add(1, 'day').hour(13).minute(30).toDate(),
      customer: 'Siam Piwat',
      assignedTo: 'You',
    },
    {
      id: 'ACT-CURR-3',
      title: 'Weekly Review',
      type: 'internal_meeting',
      status: 'planned',
      startTime: dayjs().startOf('week').add(4, 'day').hour(15).minute(0).toDate(), // Friday
      endTime: dayjs().startOf('week').add(4, 'day').hour(16).minute(0).toDate(),
      assignedTo: 'Team',
    },
  ]);

  // Computed
  const currentPeriodLabel = computed(() => {
    if (displayMode.value === 'month') {
      return currentDate.value.format('MMMM YYYY');
    } else if (displayMode.value === 'week') {
      const startOfWeek = currentDate.value.startOf('week');
      const endOfWeek = currentDate.value.endOf('week');
      if (startOfWeek.month() === endOfWeek.month()) {
        return `${startOfWeek.format('D')} - ${endOfWeek.format('D MMM YYYY')}`;
      }
      return `${startOfWeek.format('D MMM')} - ${endOfWeek.format('D MMM YYYY')}`;
    } else if (displayMode.value === 'day') {
      return currentDate.value.format('D MMMM YYYY');
    } else {
      return t('activities.all_activities');
    }
  });

  const displayModes = [
    { label: 'Month', value: 'month' },
    { label: 'Week', value: 'week' },
    { label: 'Day', value: 'day' },
    { label: 'List', value: 'list' },
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthDays = computed(() => {
    const startOfMonth = currentDate.value.startOf('month');
    const endOfMonth = currentDate.value.endOf('month');
    const startDayOfWeek = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

    const days = [];

    // Previous month days
    for (let i = startDayOfWeek; i > 0; i--) {
      const date = startOfMonth.subtract(i, 'day');
      days.push({
        date: date.toDate(),
        isCurrentMonth: false,
        isToday: date.isSame(dayjs(), 'day'),
      });
    }

    // Current month days
    for (let i = 0; i < endOfMonth.date(); i++) {
      const date = startOfMonth.add(i, 'day');
      days.push({
        date: date.toDate(),
        isCurrentMonth: true,
        isToday: date.isSame(dayjs(), 'day'),
      });
    }

    // Next month days to fill grid (42 cells total for 6 rows)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = endOfMonth.add(i, 'day');
      days.push({
        date: date.toDate(),
        isCurrentMonth: false,
        isToday: date.isSame(dayjs(), 'day'),
      });
    }

    return days;
  });

  const weekViewDays = computed(() => {
    const startOfWeek = currentDate.value.startOf('week');
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push({
        date: startOfWeek.add(i, 'day').toDate(),
      });
    }
    return days;
  });

  const sortedActivities = computed(() => {
    return [...activities.value].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  // Methods
  const navigate = (direction: 'prev' | 'next') => {
    const unit =
      displayMode.value === 'month' ? 'month' : displayMode.value === 'week' ? 'week' : 'day';
    if (direction === 'prev') {
      currentDate.value = currentDate.value.subtract(1, unit);
    } else {
      currentDate.value = currentDate.value.add(1, unit);
    }
  };

  const goToToday = () => {
    currentDate.value = dayjs();
  };

  const isToday = (date: Date) => {
    return dayjs(date).isSame(dayjs(), 'day');
  };

  const getActivitiesForDate = (date: Date) => {
    return activities.value
      .filter(
        (activity) =>
          dayjs(activity.startTime).isSame(dayjs(date), 'day') &&
          (searchTerm.value === '' ||
            activity.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
      )
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  // Styling Helpers
  const getActivityIcon = (type: ActivityType) => {
    const iconMap: Record<string, string> = {
      customer_visit: 'i-heroicons-users',
      sales_meeting: 'i-heroicons-document-text',
      site_survey: 'i-heroicons-map-pin',
      internal_meeting: 'i-heroicons-building-office-2',
      follow_up_call: 'i-heroicons-phone',
      task_reminder: 'i-heroicons-clock',
    };
    return iconMap[type] || 'i-heroicons-calendar';
  };

  const getActivityClass = (activity: Activity) => {
    const baseClasses = 'border-l-2';
    const colorClasses: Record<string, string> = {
      customer_visit:
        'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300',
      sales_meeting:
        'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300',
      site_survey:
        'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300',
      internal_meeting:
        'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-300',
      follow_up_call:
        'bg-pink-50 dark:bg-pink-900/20 border-pink-500 text-pink-700 dark:text-pink-300',
      task_reminder:
        'bg-gray-50 dark:bg-gray-900/20 border-gray-500 text-gray-700 dark:text-gray-300',
    };
    return `${baseClasses} ${colorClasses[activity.type] || colorClasses.task_reminder}`;
  };

  const getActivityBorderColor = (type: ActivityType) => {
    const colorClasses: Record<string, string> = {
      customer_visit: 'border-blue-500',
      sales_meeting: 'border-emerald-500',
      site_survey: 'border-purple-500',
      internal_meeting: 'border-orange-500',
      follow_up_call: 'border-pink-500',
      task_reminder: 'border-gray-500',
    };
    return colorClasses[type] || 'border-gray-500';
  };

  const getActivityColorName = (type: ActivityType) => {
    const map: Record<string, string> = {
      customer_visit: 'blue',
      sales_meeting: 'emerald',
      site_survey: 'purple',
      internal_meeting: 'orange',
      follow_up_call: 'pink',
      task_reminder: 'gray',
    };
    return map[type] || 'gray';
  };

  const getStatusColor = (status: ActivityStatus) => {
    const map: Record<string, string> = {
      planned: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return map[status] || 'gray';
  };

  const getActivityTypeLabel = (type: ActivityType) => {
    return t(`activities.types.${type}`);
  };

  // Thai Holidays
  const holidays: Record<string, { name: string; type: string }> = {
    '2026-01-01': { name: 'วันขึ้นปีใหม่', type: 'holiday' },
    '2026-02-11': { name: 'วันมาฆบูชา', type: 'holiday' },
    '2026-04-06': { name: 'วันจักรี', type: 'holiday' },
    '2026-04-13': { name: 'วันสงกรานต์', type: 'holiday' },
    '2026-04-14': { name: 'วันสงกรานต์', type: 'holiday' },
    '2026-04-15': { name: 'วันสงกรานต์', type: 'holiday' },
    '2026-05-01': { name: 'วันแรงงานแห่งชาติ', type: 'holiday' },
    // Add more as needed
  };

  const getHoliday = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    return holidays[dateStr];
  };
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('calendar.title') }}</h1>
        <p class="text-gray-500 dark:text-gray-400">{{ t('calendar.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <CommonButton
          icon="i-heroicons-plus"
          color="primary"
          variant="solid"
          :label="t('activities.new_activity')"
          @click="console.log('New Activity')"
        />
      </div>
    </div>

    <!-- Calendar Controls -->
    <div
      class="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div class="flex items-center gap-2">
        <CommonButton
          icon="i-heroicons-chevron-left"
          color="neutral"
          variant="ghost"
          @click="navigate('prev')"
        />
        <CommonButton :label="t('calendar.today')" color="neutral" variant="ghost" @click="goToToday" />
        <CommonButton
          icon="i-heroicons-chevron-right"
          color="neutral"
          variant="ghost"
          @click="navigate('next')"
        />
        <span class="text-lg font-semibold text-gray-900 dark:text-white min-w-[150px] text-center">
          {{ currentPeriodLabel }}
        </span>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <div
          class="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-gray-50 dark:bg-gray-800"
        >
          <CommonButton
            v-for="mode in displayModes"
            :key="mode.value"
            :label="mode.label"
            :variant="displayMode === mode.value ? 'solid' : 'ghost'"
            :color="displayMode === mode.value ? 'primary' : 'gray'"
            size="xs"
            @click="displayMode = mode.value"
          />
        </div>

        <UInput
          v-model="searchTerm"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('common.search_placeholder')"
          class="w-full md:w-48"
        />
      </div>
    </div>

    <!-- Calendar Grid (Month View) -->
    <div
      v-if="displayMode === 'month'"
      class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <!-- Weekday Headers -->
      <div
        class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400"
        >
          {{ day }}
        </div>
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 auto-rows-fr">
        <div
          v-for="(day, index) in monthDays"
          :key="index"
          class="min-h-[120px] border-b border-r border-gray-200 dark:border-gray-700 p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          :class="{
            'bg-gray-50/50 dark:bg-gray-800/30': !day.isCurrentMonth,
            'bg-blue-50/30 dark:bg-blue-900/10': day.isToday,
          }"
          @click="console.log('Day clicked', day.date)"
        >
          <div class="flex justify-between items-start mb-1">
            <span
              class="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full"
              :class="{
                'bg-primary-600 text-white': day.isToday,
                'text-gray-900 dark:text-white': !day.isToday && day.isCurrentMonth,
                'text-gray-400 dark:text-gray-600': !day.isCurrentMonth,
              }"
            >
              {{ dayjs(day.date).date() }}
            </span>
            <div
              v-if="getHoliday(day.date)"
              class="text-[10px] text-red-500 font-medium text-right leading-tight max-w-[70%]"
            >
              {{ getHoliday(day.date)?.name }}
            </div>
          </div>

          <div class="space-y-1">
            <div
              v-for="activity in getActivitiesForDate(day.date)"
              :key="activity.id"
              class="px-1.5 py-0.5 text-xs rounded border truncate cursor-pointer transition-colors"
              :class="getActivityClass(activity)"
              @click.stop="console.log('Activity clicked', activity.id)"
            >
              <div class="flex items-center gap-1">
                <CommonIcon :name="getActivityIcon(activity.type)" size="w-3 h-3" class="flex-shrink-0" />
                <span class="truncate font-medium">{{ activity.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Week View -->
    <div
      v-else-if="displayMode === 'week'"
      class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div
        class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <div
          v-for="day in weekViewDays"
          :key="day.date.toString()"
          class="py-2 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
        >
          <div class="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {{ dayjs(day.date).format('ddd') }}
          </div>
          <div
            class="text-sm font-semibold inline-flex items-center justify-center w-7 h-7 rounded-full mt-1"
            :class="{
              'bg-primary-600 text-white': isToday(day.date),
              'text-gray-900 dark:text-white': !isToday(day.date),
            }"
          >
            {{ dayjs(day.date).date() }}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-7 min-h-[500px] divide-x divide-gray-200 dark:divide-gray-700">
        <div
          v-for="day in weekViewDays"
          :key="day.date.toString()"
          class="p-2 space-y-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          <div
            v-for="activity in getActivitiesForDate(day.date)"
            :key="activity.id"
            class="p-2 text-xs rounded border cursor-pointer transition-colors shadow-sm"
            :class="getActivityClass(activity)"
            @click.stop="console.log('Activity clicked', activity.id)"
          >
            <div class="flex items-center gap-1 mb-1">
              <CommonIcon :name="getActivityIcon(activity.type)" size="w-3 h-3" class="flex-shrink-0" />
              <span class="font-bold">{{ dayjs(activity.startTime).format('HH:mm') }}</span>
            </div>
            <div class="truncate font-medium">{{ activity.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day View -->
    <div
      v-else-if="displayMode === 'day'"
      class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 min-h-[500px]"
    >
      <div class="space-y-4">
        <div
          v-for="activity in getActivitiesForDate(currentDate.toDate())"
          :key="activity.id"
          class="flex gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800"
        >
          <div
            class="flex flex-col items-center justify-center min-w-[80px] text-gray-500 dark:text-gray-400"
          >
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              {{ dayjs(activity.startTime).format('HH:mm') }}
            </span>
            <span class="text-xs">{{ dayjs(activity.endTime).format('HH:mm') }}</span>
          </div>
          <div class="flex-1 border-l-4 pl-4" :class="getActivityBorderColor(activity.type)">
            <div class="flex items-center gap-2 mb-1">
              <CommonBadge :color="getActivityColorName(activity.type)" variant="subtle" size="xs">
                {{ getActivityTypeLabel(activity.type) }}
              </CommonBadge>
              <CommonBadge :color="getStatusColor(activity.status)" variant="outline" size="xs">
                {{ activity.status }}
              </CommonBadge>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ activity.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <CommonIcon name="i-heroicons-user" size="w-4 h-4" />
              {{ activity.assignedTo }}
              <span v-if="activity.customer">• {{ activity.customer }}</span>
              <span v-if="activity.location">• {{ activity.location }}</span>
            </p>
          </div>
        </div>
        <div
          v-if="getActivitiesForDate(currentDate.toDate()).length === 0"
          class="text-center py-10 text-gray-500"
        >
          {{ t('calendar.no_activities_day') }}
        </div>
      </div>
    </div>

    <!-- List View -->
    <div
      v-else-if="displayMode === 'list'"
      class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Time
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Activity
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Assigned To
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="activity in sortedActivities"
            :key="activity.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ dayjs(activity.startTime).format('D MMM YYYY') }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ dayjs(activity.startTime).format('HH:mm') }} -
              {{ dayjs(activity.endTime).format('HH:mm') }}
            </td>
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ activity.title }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400" v-if="activity.customer">
                {{ activity.customer }}
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <UBadge :color="getActivityColorName(activity.type)" variant="subtle" size="xs">
                {{ getActivityTypeLabel(activity.type) }}
              </UBadge>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <UBadge :color="getStatusColor(activity.status)" variant="outline" size="xs">
                {{ activity.status }}
              </UBadge>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ activity.assignedTo }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
