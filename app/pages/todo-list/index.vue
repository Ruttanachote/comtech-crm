<script setup lang="ts">
  import dayjs from 'dayjs';
  import user from '~/data/user.json';
  import { useTasksStore } from '~~/stores/useTasksStore';
  import type { Task } from '~~/stores/useTasksStore';
  import DetailModal from './component/DetailModal.vue';

  const { locale } = useI18n();
  const toast = useToast();
  const store = useTasksStore();

  // Types
  type SortDirection = 'asc' | 'desc' | null;
  type SortField = 'dueDate' | 'priority' | 'status';

  // State
  const searchQuery = ref('');
  const filterOwner = ref('all');
  const filterActivityType = ref('all');
  const filterDateFrom = ref('');
  const filterDateTo = ref('');
  const sortField = ref<SortField>('dueDate');
  const sortDirection = ref<SortDirection>(null);
  const selectedTab = ref('all');
  const currentMeetingIndex = ref(0);

  const isModalOpen = ref(false);
  const selectedTask = ref<Task | undefined>(undefined);

  // Mock Data
  const teamMembers = ['สมชาย วงศ์สกุล', 'อนุชา ศรีสวัสดิ์', 'วิภาวี จันทร์เจริญ', 'ธนพล รัตนพงษ์'];

  const activityTypeConfig = computed(() => ({
    customer_visit: {
      label: t('tasks.activity_types.customer_visit'),
      icon: 'i-lucide-users',
      color: 'bg-blue-500',
    },
    meeting: {
      label: t('tasks.activity_types.meeting'),
      icon: 'i-lucide-calendar',
      color: 'bg-purple-500',
    },
    follow_up: {
      label: t('tasks.activity_types.follow_up'),
      icon: 'i-lucide-phone',
      color: 'bg-orange-500',
    },
    site_survey: {
      label: t('tasks.activity_types.site_survey'),
      icon: 'i-lucide-map',
      color: 'bg-green-500',
    },
    other: {
      label: t('tasks.activity_types.other'),
      icon: 'i-lucide-clipboard',
      color: 'bg-gray-500',
    },
  }));

  const tasks = computed(() => store.tasks || []);

  // Actions
  const handleCreateTask = () => {
    selectedTask.value = undefined;
    isModalOpen.value = true;
  };

  const handleEditTask = (task: Task) => {
    selectedTask.value = task;
    isModalOpen.value = true;
  };

  const handleDeleteTask = async (task: Task) => {
    // Implement delete logic here if needed
    console.log('Delete task:', task);
  };

  const handleAction = (action: string, task: Task) => {
    if (action === 'update') {
      handleEditTask(task);
    } else if (action === 'delete') {
      handleDeleteTask(task);
    }
  };

  // Mock Meetings
  const meetings = [
    {
      id: 1,
      date: '19 ก.พ. 2026',
      time: '09:00',
      title: 'ประชุมทีมขาย',
    },
    {
      id: 2,
      date: '19 ก.พ. 2026',
      time: '14:00',
      title: 'พบลูกค้า Global Logistics',
    },
    {
      id: 3,
      date: '19 ก.พ. 2026',
      time: '16:00',
      title: 'Review สัญญา Pacific Distribution',
    },
  ];

  // Meeting Carousel Logic
  onMounted(() => {
    store.fetchTasks();
    const timer = setInterval(() => {
      currentMeetingIndex.value = (currentMeetingIndex.value + 1) % meetings.length;
    }, 5000);
    onUnmounted(() => clearInterval(timer));
  });

  const handlePrevMeeting = () => {
    currentMeetingIndex.value = (currentMeetingIndex.value - 1 + meetings.length) % meetings.length;
  };

  const handleNextMeeting = () => {
    currentMeetingIndex.value = (currentMeetingIndex.value + 1) % meetings.length;
  };

  // Computed Properties
  const todoTasks = computed(() => tasks.value.filter((t) => t.status === 'todo' && !t.completed));
  const inProgressTasks = computed(() => tasks.value.filter((t) => t.status === 'in-progress'));
  const completedTasks = computed(() => tasks.value.filter((t) => t.completed));
  const overdueTasks = computed(() =>
    tasks.value.filter((t) => new Date(t.dueDate) < new Date() && !t.completed)
  );

  const filteredTasks = computed(() => {
    let filtered = tasks.value;

    // Search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.customer?.toLowerCase().includes(query) ||
          t.relatedTo?.toLowerCase().includes(query)
      );
    }

    // Filter Owner
    if (filterOwner.value !== 'all') {
      filtered = filtered.filter((t) => t.assignee === filterOwner.value);
    }

    // Filter Activity Type
    if (filterActivityType.value !== 'all') {
      filtered = filtered.filter((t) => t.activityType === filterActivityType.value);
    }

    // Filter Date Range
    if (filterDateFrom.value && filterDateTo.value) {
      const from = new Date(filterDateFrom.value);
      const to = new Date(filterDateTo.value);
      filtered = filtered.filter((t) => {
        const taskDate = new Date(t.dueDate);
        return taskDate >= from && taskDate <= to;
      });
    }

    // Sorting
    if (sortDirection.value) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;

        if (sortField.value === 'dueDate') {
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (sortField.value === 'priority') {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
        } else if (sortField.value === 'status') {
          const statusWeight = { todo: 1, 'in-progress': 2, completed: 3 };
          comparison = statusWeight[a.status] - statusWeight[b.status];
        }

        return sortDirection.value === 'asc' ? comparison : -comparison;
      });
    } else {
      // Default Sort
      const today = new Date().toISOString().split('T')[0];
      filtered = [...filtered].sort((a, b) => {
        const aIsToday = a.dueDate === today;
        const bIsToday = b.dueDate === today;

        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;

        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    return filtered;
  });

  const handleSort = (field: SortField) => {
    if (sortField.value !== field) {
      sortField.value = field;
      sortDirection.value = 'asc';
    } else {
      if (sortDirection.value === null) {
        sortDirection.value = 'asc';
      } else if (sortDirection.value === 'asc') {
        sortDirection.value = 'desc';
      } else {
        sortDirection.value = null;
      }
    }
  };

  const clearFilters = () => {
    searchQuery.value = '';
    filterOwner.value = 'all';
    filterActivityType.value = 'all';
    filterDateFrom.value = '';
    filterDateTo.value = '';
  };

  // UI Helpers
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      case 'todo':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getActivityTypeConfig = (type: string) => {
    return (
      activityTypeConfig.value[type as keyof typeof activityTypeConfig.value] ||
      activityTypeConfig.value.other
    );
  };
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex flex-col gap-1">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ t('tasks.all_tasks_title') }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('tasks.all_tasks_subtitle') }}
          </p>
        </div>
        <CommonButton
          icon="i-lucide-plus"
          size="sm"
          color="primary"
          :label="t('tasks.create_task')"
          class="rounded-full"
          @click="handleCreateTask"
        />
      </div>

      <!-- Meeting Carousel Card -->
      <div
        class="relative overflow-hidden rounded-lg shadow-sm bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-600 dark:to-primary-800 p-4 pb-6"
      >
        <div class="flex items-center justify-between text-white">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <CommonIcon name="i-lucide-calendar" size="w-6 h-6" />
              <span class="font-semibold">{{ meetings?.[currentMeetingIndex]?.date }}</span>
            </div>
            <div class="h-5 w-px bg-white/30"></div>
            <div class="flex items-center gap-2">
              <CommonIcon name="i-lucide-clock" size="w-6 h-6" />
              <span>
                {{ meetings?.[currentMeetingIndex]?.time }} -
                {{ meetings?.[currentMeetingIndex]?.title }}
              </span>
            </div>
          </div>
          <CommonButton
            size="xs"
            variant="solid"
            :label="t('common.update')"
            class="bg-white/20 hover:bg-white/30 text-white border-none"
          />
        </div>

        <!-- Dots Indicator -->
        <div class="flex items-center justify-center gap-2 mt-4">
          <button
            @click="handlePrevMeeting"
            class="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          >
            <CommonIcon name="i-lucide-chevron-left" size="w-4 h-4" color="text-white" />
          </button>
          <div class="flex items-center gap-2">
            <button
              v-for="(_, index) in meetings"
              :key="index"
              @click="currentMeetingIndex = index"
              class="h-2 rounded-full transition-all"
              :class="
                index === currentMeetingIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              "
            />
          </div>
          <button
            @click="handleNextMeeting"
            class="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          >
            <CommonIcon name="i-lucide-chevron-right" size="w-4 h-4" color="text-white" />
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <CommonCard body="p-4">
          <p class="text-xs text-gray-500 font-medium mb-1">{{ t('tasks.todo') }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ todoTasks.length }}</p>
        </CommonCard>
        <CommonCard body="p-4">
          <p class="text-xs text-gray-500 font-medium mb-1">{{ t('tasks.in_progress') }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ inProgressTasks.length }}
          </p>
        </CommonCard>
        <CommonCard body="p-4">
          <p class="text-xs text-gray-500 font-medium mb-1">{{ t('tasks.completed') }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ completedTasks.length }}
          </p>
        </CommonCard>
        <CommonCard body="p-4">
          <p class="text-xs text-gray-500 font-medium mb-1">{{ t('tasks.overdue') }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ overdueTasks.length }}</p>
        </CommonCard>
      </div>

      <!-- Main Content -->
      <CommonCard body="p-0" :ui="{ header: { padding: 'p-0' } }">
        <!-- Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700 px-3">
          <button
            @click="selectedTab = 'all'"
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="
              selectedTab === 'all'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            "
          >
            {{ t('tasks.all_tasks') }} ({{ tasks.length }})
          </button>
        </div>

        <!-- Filters -->
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
          <div class="flex flex-col md:flex-row gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <UInput
                v-model="searchQuery"
                icon="i-lucide-search"
                :placeholder="t('placeholders.search_tasks')"
                class="w-full"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing v-if="searchQuery">
                  <CommonButton
                    color="neutral"
                    variant="link"
                    icon="i-lucide-x"
                    :padded="false"
                    @click="searchQuery = ''"
                  />
                </template>
              </UInput>
            </div>

            <!-- Filters Group -->
            <div class="flex flex-wrap items-center gap-2">
              <USelectMenu
                v-model="filterActivityType"
                :options="[
                  { value: 'all', label: t('tasks.filters.all_activities') },
                  ...Object.keys(activityTypeConfig).map((k) => ({
                    value: k,
                    label: activityTypeConfig[k].label,
                  })),
                ]"
                option-attribute="label"
                value-attribute="value"
                placeholder="Activity Type"
                class="w-40"
              >
                <template #leading>
                  <UIcon name="i-lucide-list" class="w-4 h-4" />
                </template>
              </USelectMenu>

              <div class="flex items-center gap-2">
                <UInput
                  type="date"
                  v-model="filterDateFrom"
                  :placeholder="t('tasks.filters.from')"
                  class="w-36"
                />
                <span class="text-gray-500 text-sm">{{ t('tasks.filters.to') }}</span>
                <UInput
                  type="date"
                  v-model="filterDateTo"
                  :placeholder="t('tasks.filters.to')"
                  class="w-36"
                />
                <UButton
                  v-if="filterDateFrom || filterDateTo"
                  icon="i-lucide-x"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click="
                    filterDateFrom = '';
                    filterDateTo = '';
                  "
                />
              </div>

              <UButton
                icon="i-lucide-arrow-up-down"
                variant="outline"
                color="neutral"
                :class="{
                  'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-900/20':
                    sortDirection,
                }"
                @click="handleSort('dueDate')"
              >
                <span class="hidden sm:inline">
                  {{
                    sortDirection === 'asc'
                      ? t('tasks.sort.date_old_new')
                      : sortDirection === 'desc'
                        ? t('tasks.sort.date_new_old')
                        : t('tasks.sort.sort_by_date')
                  }}
                </span>
              </UButton>

              <UButton
                v-if="
                  filterOwner !== 'all' ||
                  filterActivityType !== 'all' ||
                  filterDateFrom ||
                  filterDateTo ||
                  searchQuery
                "
                icon="i-lucide-filter"
                variant="ghost"
                color="neutral"
                :label="t('tasks.filters.clear')"
                @click="clearFilters"
              />
            </div>
          </div>
        </div>

        <!-- Task List -->
        <div class="p-3 space-y-3 bg-gray-50 dark:bg-gray-800/50 min-h-[400px]">
          <div v-if="filteredTasks.length === 0" class="text-center py-10 text-gray-500">
            No tasks found
          </div>

          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 p-4"
          >
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <!-- Left: Task Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <CommonBadge
                    :color="getPriorityColor(task.priority)"
                    size="xs"
                    variant="subtle"
                    class="capitalize"
                  >
                    {{ task.priority }}
                  </CommonBadge>
                  <CommonBadge
                    :color="getStatusColor(task.status)"
                    size="xs"
                    variant="subtle"
                    class="capitalize"
                  >
                    {{ t(`tasks.${task.status.replace('-', '_')}`) }}
                  </CommonBadge>
                  <span
                    v-if="task.relatedTo"
                    class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full truncate max-w-[150px]"
                  >
                    {{ task.relatedTo }}
                  </span>
                </div>

                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {{ task.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {{ task.description }}
                </p>

                <!-- Footer Info -->
                <div class="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gray-500">
                  <div
                    class="flex items-center gap-1.5"
                    :class="{
                      'text-red-500 font-medium':
                        new Date(task.dueDate) < new Date() && !task.completed,
                    }"
                  >
                    <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                    {{ dayjs(task.dueDate).format('DD MMM YYYY') }}
                    <span v-if="task.dueTime">• {{ task.dueTime }}</span>
                  </div>

                  <div v-if="task.customer" class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-building" class="w-3.5 h-3.5" />
                    <span class="truncate max-w-[150px]">{{ task.customer }}</span>
                  </div>

                  <div v-if="task.activityType" class="flex items-center gap-1.5">
                    <div
                      :class="`w-2 h-2 rounded-full ${getActivityTypeConfig(task.activityType).color}`"
                    ></div>
                    {{ getActivityTypeConfig(task.activityType).label }}
                  </div>
                </div>
              </div>

              <!-- Right: Actions -->
              <div class="flex items-center gap-2 self-start sm:self-center shrink-0">
                <CommonButton
                  v-if="!task.completed"
                  color="primary"
                  variant="soft"
                  size="xs"
                  label="Check-in"
                  icon="i-lucide-map-pin"
                />
                <CommonSelection
                  :items="[
                    { label: t('common.update'), value: 'update' },
                    { label: t('common.delete'), value: 'delete' },
                  ]"
                  placeholder="Actions"
                  @update:value="(val) => handleAction(val, task)"
                  class="w-32"
                />
              </div>
            </div>
          </div>
        </div>
      </CommonCard>
    </div>

    <!-- Modal -->
     <DetailModal
       :open-modal="isModalOpen"
       :task="selectedTask"
       @close="isModalOpen = false"
     />
  </div>
</template>
