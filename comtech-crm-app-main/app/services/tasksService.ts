import { useApi } from '~/composables/useApi';

const PREFIX = 'tasks';

const mockTasks: any[] = [
  {
    id: 1,
    taskName: 'ติดตามลูกค้า Global Freight Solutions',
    taskType: 'Follow-up',
    relatedCustomer: 'Global Freight Solutions Inc.',
    relatedDeal: 'Contract Renewal',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-02-19T12:00:00',
    ownerId: 101,
    assignee: 'สมชาย วงศ์สกุล',
    reminder: '2026-02-19T09:00:00',
    notes: 'หารือเรื่องการต่ออายุสัญญาและปรับราคา',
  },
  {
    id: 2,
    taskName: 'ตรวจสอบใบเสนอราคาสำหรับ TransContinental Logistics',
    taskType: 'Review',
    relatedCustomer: 'TransContinental Logistics',
    relatedDeal: 'Quotation #Q-2026-001',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-02-19T14:00:00',
    ownerId: 102,
    assignee: 'อนุชา ศรีสวัสดิ์',
    notes: 'ตรวจสอบราคาและขอบเขตบริการก่อนส่งให้ลูกค้า',
  },
  {
    id: 3,
    taskName: 'เตรียมสัญญาแก้ไขสำหรับ Pacific Distribution',
    taskType: 'Document Prep',
    relatedCustomer: 'Pacific Distribution Co.',
    relatedDeal: 'Amendment Agreement',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2026-02-20T15:00:00',
    ownerId: 101,
    assignee: 'สมชาย วงศ์สกุล',
    notes: 'อัปเดตระดับการให้บริการและเพิ่มศูนย์กระจายสินค้าใหม่',
  },
];

export const tasksService = {
  getTasks: async (force: boolean) => {
    // Return mock data for now as backend is not ready
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockTasks });
      }, 500);
    });
  },

  updateTasks: async (task: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockTasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          mockTasks[index] = { ...mockTasks[index], ...task };
        }
        resolve({ data: task });
      }, 500);
    });
  },

  createTask: async (task: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          ...task,
          id: Math.floor(Math.random() * 10000), // Mock ID
        };
        mockTasks.push(newTask);
        resolve({ data: newTask });
      }, 500);
    });
  },
};
