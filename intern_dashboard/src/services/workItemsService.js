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

let initialWorkItems = [
  // --- PROJECT 1: MOBILE APP DEVELOPMENT (PROJ-MAD-2025) ---
  {
    id: 'WI-100',
    type: 'EPIC',
    project_id: 'PROJ-MAD-2025',
    project_name: 'Mobile App Development',
    parent_id: null,
    title: 'Biometric & Multi-Factor Authentication',
    description: 'Implement secure local biometric authentication (FaceID / Fingerprint) and seamless JWT session fallback for mobile clients.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    start_date: '2025-11-01T09:00:00Z',
    due_date: nextWeekISO,
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
      { id: 'TL-3', name: 'Rohan Singh', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [
      { id: 'att-1', name: 'Auth_Flow_Architecture.pdf', size: '2.4 MB', type: 'pdf', uploaded_at: '2025-11-02' }
    ],
    activity_history: [
      { id: 'act-1', user: 'Rohan Singh', action: 'Created Epic', timestamp: '2025-11-01 10:00 AM', details: 'Initialized biometric epic scope' }
    ],
    comments: []
  },
  {
    id: 'WI-101',
    type: 'STORY',
    project_id: 'PROJ-MAD-2025',
    project_name: 'Mobile App Development',
    parent_id: 'WI-100',
    title: 'User Biometric Enrollment & Keychain Storage',
    description: 'Provide an opt-in screen during onboarding to enroll device biometric credentials stored in secure hardware enclave.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    start_date: '2025-11-05T09:00:00Z',
    due_date: todayISO,
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [],
    activity_history: [
      { id: 'act-2', user: 'Aarav Patel', action: 'Status changed', timestamp: 'Yesterday at 3:15 PM', details: 'Changed status to IN_PROGRESS' }
    ],
    comments: []
  },
  {
    id: 'WI-102',
    type: 'TASK',
    project_id: 'PROJ-MAD-2025',
    project_name: 'Mobile App Development',
    parent_id: 'WI-101',
    title: 'Implement biometric auth flow',
    description: 'Wire up LocalAuthentication API with custom fallback passcode modal and device hardware check.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    start_date: '2025-11-10T09:00:00Z',
    due_date: todayISO, // Due Today!
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
      { id: 'INT-04', name: 'Rohan Verma', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [
      { id: 'att-2', name: 'Biometric_Test_Matrix.xlsx', size: '420 KB', type: 'xlsx', uploaded_at: '2025-11-12' },
      { id: 'att-3', name: 'Security_Audit_Checklist.pdf', size: '1.1 MB', type: 'pdf', uploaded_at: '2025-11-14' }
    ],
    activity_history: [
      { id: 'act-3', user: 'Rohan Singh', action: 'Assigned Aarav Patel & Rohan Verma', timestamp: 'Nov 10 10:30 AM', details: 'Task assigned for Sprint 05' },
      { id: 'act-4', user: 'Aarav Patel', action: 'Uploaded attachment', timestamp: 'Nov 12 4:00 PM', details: 'Uploaded Biometric_Test_Matrix.xlsx' }
    ],
    comments: [
      { id: 'c-1', author: 'Rohan Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', time: 'Yesterday at 5:00 PM', text: 'Please ensure Android KeyStore hardware backing is validated when testing on physical devices.' }
    ]
  },
  {
    id: 'WI-103',
    type: 'SUBTASK',
    project_id: 'PROJ-MAD-2025',
    project_name: 'Mobile App Development',
    parent_id: 'WI-102',
    title: 'Write unit tests for storage adapters',
    description: 'Unit test mock Keychain/KeyStore encryption wrappers and error states when hardware is not enrolled.',
    status: 'TODO',
    priority: 'MEDIUM',
    start_date: '2025-11-12T09:00:00Z',
    due_date: tomorrowISO, // Due Tomorrow
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [],
    activity_history: [
      { id: 'act-5', user: 'Aarav Patel', action: 'Created Subtask', timestamp: 'Nov 12 11:00 AM', details: 'Subtask for automated testing' }
    ],
    comments: []
  },
  {
    id: 'WI-104',
    type: 'BUG',
    project_id: 'PROJ-MAD-2025',
    project_name: 'Mobile App Development',
    parent_id: 'WI-100',
    title: 'Fix Android push notification background bug',
    description: 'FCM push notification token refreshes are causing crashes when app is suspended in low-memory background states.',
    status: 'BLOCKED',
    priority: 'HIGH',
    start_date: '2025-11-08T09:00:00Z',
    due_date: yesterdayISO, // OVERDUE!
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [
      { id: 'att-4', name: 'crash_log_android_14.txt', size: '85 KB', type: 'txt', uploaded_at: '2025-11-16' }
    ],
    activity_history: [
      { id: 'act-6', user: 'Aarav Patel', action: 'Status changed to BLOCKED', timestamp: 'Yesterday at 11:20 AM', details: 'Awaiting IT service account credentials' }
    ],
    comments: [
      { id: 'c-2', author: 'Aarav Patel', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', time: 'Yesterday', text: 'Blocked waiting for IT department to provide the production Firebase Cloud Messaging service account JSON.' }
    ]
  },
  {
    id: 'WI-105',
    type: 'TASK',
    project_id: 'PROJ-MAD-2025',
    project_name: 'Mobile App Development',
    parent_id: null,
    title: 'Update README with setup instructions',
    description: 'Document local Android Studio SDK paths, CocoaPods install commands, and local mock API environment variables.',
    status: 'COMPLETED',
    priority: 'LOW',
    start_date: '2025-11-01T09:00:00Z',
    due_date: yesterdayISO,
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [],
    activity_history: [
      { id: 'act-7', user: 'Aarav Patel', action: 'Completed task', timestamp: '2 days ago', details: 'Merged PR #42' }
    ],
    comments: []
  },

  // --- PROJECT 2: STUDENT MANAGEMENT SYSTEM (PROJ-SMS-2025) ---
  {
    id: 'WI-201',
    type: 'TASK',
    project_id: 'PROJ-SMS-2025',
    project_name: 'Student Management System',
    parent_id: null,
    title: 'Build Grade Card responsive modal component',
    description: 'Design and build the reusable Grade Card popover component for semester transcript previews.',
    status: 'IN_REVIEW',
    priority: 'MEDIUM',
    start_date: '2025-11-14T09:00:00Z',
    due_date: nextWeekISO,
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
      { id: 'TL-1', name: 'Priya Sharma', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [
      { id: 'att-5', name: 'Grade_Card_Figma_Spec.png', size: '1.8 MB', type: 'image', uploaded_at: '2025-11-15' }
    ],
    activity_history: [
      { id: 'act-8', user: 'Aarav Patel', action: 'Submitted for Review', timestamp: 'Yesterday at 4:30 PM', details: 'Submitted PR for Priya Sharma review' }
    ],
    comments: []
  },

  // --- PERSONAL TASKS (project_id = null) ---
  {
    id: 'WI-901',
    type: 'TASK',
    project_id: null, // PERSONAL TASK!
    project_name: 'Personal Learning & Development',
    parent_id: null,
    title: 'Complete React Native Deep Dive Certification',
    description: 'Finish Modules 4 and 5 on Advanced State Management (Zustand & Redux Toolkit) and Native Bridge Architecture.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    start_date: '2025-11-01T09:00:00Z',
    due_date: nextWeekISO,
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [],
    activity_history: [
      { id: 'act-9', user: 'Aarav Patel', action: 'Created Personal Task', timestamp: 'Nov 01', details: 'Self-assigned learning goal' }
    ],
    comments: []
  },
  {
    id: 'WI-902',
    type: 'TASK',
    project_id: null, // PERSONAL TASK!
    project_name: 'Personal Learning & Development',
    parent_id: null,
    title: 'Prepare Mid-Cohort Demo Presentation',
    description: 'Draft 5-minute presentation slides highlighting mobile biometric integration and offline caching benchmarks for the all-hands sync.',
    status: 'TODO',
    priority: 'HIGH',
    start_date: '2025-11-15T09:00:00Z',
    due_date: nextWeekISO,
    work_item_assignees: [
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
    ],
    attachments: [],
    activity_history: [],
    comments: []
  }
];

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
