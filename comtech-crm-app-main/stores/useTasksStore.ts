import { defineStore } from 'pinia';
import { tasksService } from '~~/app/services/tasksService';

export interface Task {
  id: number;
  taskName: string;
  taskType?: string;
  relatedCustomer?: string;
  relatedDeal?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  ownerId?: number;
  reminder?: string;
  notes?: string;
  
  // Detail fields (optional or separate interface?)
  activityLog?: string;
  attachment?: string;
  comment?: string;
  
  // Legacy/UI fields (mapped or kept for compatibility if needed)
  assignee?: string; // Display name for owner
  description?: string; // Alias for notes?
  
  // Standard
  isActive?: number;
  isDelete?: number;
  createdDate?: string;
  updatedDate?: string;
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as any,
  }),
  actions: {
    async fetchTasks(force = false) {
      this.loading = true;
      try {
        const response = await tasksService.getTasks(force);
        // Ensure data is an array
        if (Array.isArray(response.data)) {
          this.tasks = response.data;
        } else {
          console.warn('API returned non-array data, using empty array:', response.data);
          this.tasks = [];
        }
      } catch (err) {
        this.error = err;
        console.error('Failed to fetch tasks:', err);
      } finally {
        this.loading = false;
      }
    },
    async updateTask(task: Partial<Task>) {
      this.loading = true;
      try {
        await tasksService.updateTasks(task);
        // After update, fetch tasks again to get the latest state
        await this.fetchTasks(true);
      } catch (err) {
        this.error = err;
        console.error('Failed to update task:', err);
        throw err; // Re-throw to handle in component if needed
      } finally {
        this.loading = false;
      }
    },
    async createTask(task: Omit<Task, 'id'>) {
      this.loading = true;
      try {
        await tasksService.createTask(task);
        await this.fetchTasks(true);
      } catch (err) {
        this.error = err;
        console.error('Failed to create task:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
