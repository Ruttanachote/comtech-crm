<script setup lang="ts">
  import type { Task } from '~~/stores/useTasksStore';
  import { useTasksStore } from '~~/stores/useTasksStore';

  const props = defineProps<{
    openModal: boolean;
    task?: Task;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'saved'): void;
  }>();

  const { t } = useI18n();
  const tasksStore = useTasksStore();
  const toast = useToast();

  const isEdit = computed(() => !!props.task);

  const form = reactive({
    taskName: '',
    taskType: '',
    relatedCustomer: '',
    relatedDeal: '',
    priority: 'Medium',
    dueDate: '',
    reminder: '',
    notes: '',
    ownerId: undefined as number | undefined,
  });

  const errors = reactive({
    taskName: false,
    taskType: false,
    priority: false,
    ownerId: false,
    dueDate: false,
  });

  // Options
  const priorities = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  const assignees = [
    { label: 'สมชาย วงศ์สกุล', value: 101 },
    { label: 'อนุชา ศรีสวัสดิ์', value: 102 },
    { label: 'วิภาวี จันทร์เจริญ', value: 103 },
    { label: 'ธนพล รัตนพงษ์', value: 104 },
  ];

  const taskTypes = [
    { label: 'Follow-up', value: 'Follow-up' },
    { label: 'Meeting', value: 'Meeting' },
    { label: 'Document Prep', value: 'Document Prep' },
    { label: 'Review', value: 'Review' },
  ];

  watch(
    () => props.openModal,
    (isOpen) => {
      if (isOpen) {
        if (props.task) {
          form.taskName = props.task.taskName;
          form.taskType = props.task.taskType || '';
          form.relatedCustomer = props.task.relatedCustomer || '';
          form.relatedDeal = props.task.relatedDeal || '';
          form.priority = props.task.priority || 'Medium';
          // Handle Date parsing if needed, assuming ISO string
          form.dueDate = props.task.dueDate ? props.task.dueDate.split('T')[0] : '';
          form.reminder = props.task.reminder ? props.task.reminder : '';
          form.notes = props.task.notes || '';
          form.ownerId = props.task.ownerId;
        } else {
          // Reset form
          form.taskName = '';
          form.taskType = '';
          form.relatedCustomer = '';
          form.relatedDeal = '';
          form.priority = 'Medium';
          form.dueDate = '';
          form.reminder = '';
          form.notes = '';
          form.ownerId = undefined;
        }
        // Reset errors
        Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = false));
      }
    },
    { immediate: true }
  );

  const validate = () => {
    let isValid = true;
    errors.taskName = !form.taskName;
    errors.taskType = !form.taskType;
    errors.priority = !form.priority;
    errors.ownerId = !form.ownerId;
    errors.dueDate = !form.dueDate;

    if (errors.taskName || errors.taskType || errors.priority || errors.ownerId || errors.dueDate) {
      isValid = false;
    }
    return isValid;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.add({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        color: 'warning',
      });
      return;
    }

    try {
      const taskData = {
        ...form,
        // Format dates properly for API if needed
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        reminder: form.reminder ? new Date(form.reminder).toISOString() : undefined,
        status: props.task?.status || 'Todo',
      };

      if (isEdit.value && props.task) {
        await tasksStore.updateTask({ ...taskData, id: props.task.id });
        toast.add({ title: 'Success', description: 'Task updated successfully.' });
      } else {
        await tasksStore.createTask(taskData as any);
        toast.add({ title: 'Success', description: 'Task created successfully.' });
      }
      emit('saved');
      emit('close');
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to save task.',
        color: 'error',
      });
    }
  };

  const onClose = () => {
    emit('close');
  };
</script>

<template>
  <UModal :open="props.openModal" :close="{ onClick: onClose }" :ui="{ content: 'sm:max-w-2xl' }">
    <template #header>
      <div class="flex items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isEdit ? 'แก้ไข To do' : 'สร้าง To do ใหม่' }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ isEdit ? 'แก้ไขรายละเอียด To do ของคุณ' : 'กรอกรายละเอียด To do ใหม่ของคุณ' }}
          </p>
        </div>
        <CommonButton
          icon="i-lucide-x"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="emit('close')"
        />
      </div>
    </template>

    <template #body>
      <div class="p-4 sm:px-6 space-y-4">
        <!-- Task Name -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
            หัวข้อ To do (Task Name)
            <span class="text-red-500">*</span>
          </label>
          <UInput
            v-model="form.taskName"
            placeholder="Follow up customer"
            :color="errors.taskName ? 'warning' : 'neutral'"
          />
          <span v-if="errors.taskName" class="text-xs text-red-500">Required</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <!-- Task Type -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              ประเภทงาน (Task Type)
              <span class="text-red-500">*</span>
            </label>
             <CommonSelection
              v-model:value="form.taskType"
              :items="taskTypes"
              placeholder="Select Type"
              :color="errors.taskType ? 'warning' : 'neutral'"
            />
            <span v-if="errors.taskType" class="text-xs text-red-500">Required</span>
          </div>

           <!-- Priority -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              ความสำคัญ (Priority)
              <span class="text-red-500">*</span>
            </label>
            <CommonSelection
              v-model:value="form.priority"
              :items="priorities"
              placeholder="Select priority"
              :color="errors.priority ? 'warning' : 'neutral'"
            />
            <span v-if="errors.priority" class="text-xs text-red-500">Required</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Related Customer -->
          <div class="space-y-1">
             <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              ลูกค้าที่เกี่ยวข้อง (Related Customer)
            </label>
             <UInput
              v-model="form.relatedCustomer"
              placeholder="Customer Name"
            />
          </div>

           <!-- Related Deal -->
          <div class="space-y-1">
             <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              ดีลที่เกี่ยวข้อง (Related Deal)
            </label>
             <UInput
              v-model="form.relatedDeal"
              placeholder="Deal Name/ID"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Due Date -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              กำหนดเสร็จ (Due Date)
              <span class="text-red-500">*</span>
            </label>
            <UInput
              type="date"
              v-model="form.dueDate"
              :color="errors.dueDate ? 'warning' : 'neutral'"
            />
            <span v-if="errors.dueDate" class="text-xs text-red-500">Required</span>
          </div>
          
           <!-- Reminder -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              แจ้งเตือน (Reminder)
            </label>
            <UInput
              type="datetime-local"
              v-model="form.reminder"
            />
          </div>
        </div>

        <!-- Owner -->
        <div class="space-y-1">
           <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              ผู้รับผิดชอบ (Owner)
              <span class="text-red-500">*</span>
            </label>
            <CommonSelection
              v-model:value="form.ownerId"
              :items="assignees"
              placeholder="Select Owner"
              :color="errors.ownerId ? 'warning' : 'neutral'"
            />
            <span v-if="errors.ownerId" class="text-xs text-red-500">Required</span>
        </div>

        <!-- Notes -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">หมายเหตุ (Notes)</label>
          <UTextarea v-model="form.notes" placeholder="กรอกรายละเอียดเพิ่มเติม" :rows="3" />
        </div>

      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 px-4 py-4 sm:px-6">
        <CommonButton label="ยกเลิก" variant="outline" color="neutral" @click="emit('close')" />
        <CommonButton
          label="บันทึก"
          color="matcha"
          @click="handleSave"
          :loading="tasksStore.loading"
        />
      </div>
    </template>
  </UModal>
</template>
