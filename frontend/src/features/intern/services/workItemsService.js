// Work Items Service - Unified Backend Model
// Types: EPIC | STORY | TASK | SUBTASK | BUG
// Statuses: TODO | IN_PROGRESS | IN_REVIEW | COMPLETED | BLOCKED
// Priorities: LOW | MEDIUM | HIGH | URGENT
// Notice: OVERDUE is NOT a stored status. It is dynamically derived:
// isOverdue = new Date(due_date) < new Date() && status !== 'COMPLETED'

const CURRENT_USER_ID = 'INT-01';

const now = new Date();
const todayISO = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0).toISOString();
const yesterdayISO = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
const tomorrowISO = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
const nextWeekISO = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString();

let initialWorkItems = [];

// In-memory subscribers for real-time reactivity
let listeners = [];
function notifyListeners() {
  listeners.forEach((listener) => listener([...initialWorkItems]));
}

export const workItemsService = {
  subscribe: (listener) => {
    listeners.push(listener);
    listener([...initialWorkItems]);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  getAllWorkItems: () => [...initialWorkItems],

  // Returns only items assigned to specific user
  getWorkItemsForUser: (userId = CURRENT_USER_ID) => {
    return initialWorkItems.filter((item) =>
      item.work_item_assignees?.some((a) => a.id === userId)
    );
  },

  // Returns personal tasks (project_id === null)
  getPersonalTasks: (userId = CURRENT_USER_ID) => {
    return initialWorkItems.filter(
      (item) => item.project_id === null && item.work_item_assignees?.some((a) => a.id === userId)
    );
  },

  // Returns project tasks (project_id !== null)
  getProjectTasks: (userId = CURRENT_USER_ID) => {
    return initialWorkItems.filter(
      (item) => item.project_id !== null && item.work_item_assignees?.some((a) => a.id === userId)
    );
  },

  getWorkItemById: (id) => {
    return initialWorkItems.find((item) => item.id === id) || null;
  },

  getChildWorkItems: (parentId) => {
    return initialWorkItems.filter((item) => item.parent_id === parentId);
  },

  // Dynamic Overdue Evaluation (Rule: due_date < now && status !== 'COMPLETED')
  isOverdue: (item) => {
    if (!item.due_date || item.status === 'COMPLETED') return false;
    return new Date(item.due_date) < new Date();
  },

  // Dynamic Due Today Evaluation
  isDueToday: (item) => {
    if (!item.due_date || item.status === 'COMPLETED') return false;
    const due = new Date(item.due_date);
    const curr = new Date();
    return (
      due.getFullYear() === curr.getFullYear() &&
      due.getMonth() === curr.getMonth() &&
      due.getDate() === curr.getDate()
    );
  },

  // Mutations
  updateWorkItem: (id, updates) => {
    initialWorkItems = initialWorkItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          activity_history: [
            {
              id: `act-${Date.now()}`,
              user: 'Aarav Patel',
              action: 'Updated details',
              timestamp: 'Just now',
              details: updates.status ? `Status changed to ${updates.status}` : 'Updated work item'
            },
            ...(item.activity_history || [])
          ]
        };
      }
      return item;
    });
    notifyListeners();
  },

  toggleComplete: (id) => {
    initialWorkItems = initialWorkItems.map((item) => {
      if (item.id === id) {
        const nextStatus = item.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        return {
          ...item,
          status: nextStatus,
          activity_history: [
            {
              id: `act-${Date.now()}`,
              user: 'Aarav Patel',
              action: nextStatus === 'COMPLETED' ? 'Marked Completed' : 'Reopened task',
              timestamp: 'Just now',
              details: `Task status updated to ${nextStatus}`
            },
            ...(item.activity_history || [])
          ]
        };
      }
      return item;
    });
    notifyListeners();
  },

  createPersonalTask: ({ title, description, priority = 'MEDIUM', dueDate }) => {
    const newTask = {
      id: `WI-P${Date.now().toString().slice(-4)}`,
      type: 'TASK',
      project_id: null, // STRICTLY NULL FOR PERSONAL TASKS
      project_name: 'Personal Tasks',
      parent_id: null,
      title: title.trim(),
      description: description?.trim() || '',
      status: 'TODO',
      priority,
      start_date: new Date().toISOString(),
      due_date: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      work_item_assignees: [
        { id: CURRENT_USER_ID, name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
      ],
      attachments: [],
      activity_history: [
        { id: `act-${Date.now()}`, user: 'Aarav Patel', action: 'Created Personal Task', timestamp: 'Just now', details: 'Added to personal tasks backlog' }
      ],
      comments: []
    };
    initialWorkItems = [newTask, ...initialWorkItems];
    notifyListeners();
    return newTask;
  },

  addAttachment: (workItemId, fileData) => {
    initialWorkItems = initialWorkItems.map((item) => {
      if (item.id === workItemId) {
        const newAtt = {
          id: `att-${Date.now()}`,
          name: fileData.name,
          size: fileData.size || '1.2 MB',
          type: fileData.type || 'file',
          uploaded_at: new Date().toISOString().split('T')[0]
        };
        return {
          ...item,
          attachments: [...(item.attachments || []), newAtt],
          activity_history: [
            { id: `act-${Date.now()}`, user: 'Aarav Patel', action: 'Uploaded Attachment', timestamp: 'Just now', details: `Added ${fileData.name}` },
            ...(item.activity_history || [])
          ]
        };
      }
      return item;
    });
    notifyListeners();
  },

  addComment: (workItemId, text) => {
    if (!text.trim()) return;
    initialWorkItems = initialWorkItems.map((item) => {
      if (item.id === workItemId) {
        const commentObj = {
          id: `c-${Date.now()}`,
          author: 'Aarav Patel',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          time: 'Just now',
          text: text.trim()
        };
        return {
          ...item,
          comments: [...(item.comments || []), commentObj]
        };
      }
      return item;
    });
    notifyListeners();
  }
};
