// Notifications Service - Centralized Store
// Types: TASK_ASSIGNED | TASK_DEADLINE | TASK_OVERDUE | FORM_ASSIGNED | FORM_DEADLINE | FORM_OVERDUE | GENERAL

let notificationsData = [
  {
    id: 'notif-1',
    type: 'TASK_DEADLINE',
    title: 'Task Due Today',
    message: 'Work item "Implement biometric auth flow" is due today by 6:00 PM.',
    is_read: false,
    created_at: '2 hours ago',
    target_id: 'WI-102',
    target_type: 'task'
  },
  {
    id: 'notif-2',
    type: 'FORM_DEADLINE',
    title: 'Pending Form Reminder',
    message: 'Weekly Progress Report - Week 4 must be submitted before 5:00 PM today.',
    is_read: false,
    created_at: '3 hours ago',
    target_id: 'FORM-01',
    target_type: 'form'
  },
  {
    id: 'notif-3',
    type: 'TASK_OVERDUE',
    title: 'Task Overdue',
    message: 'Bug "Fix Android push notification background bug" was due yesterday and is currently Blocked.',
    is_read: false,
    created_at: '1 day ago',
    target_id: 'WI-104',
    target_type: 'task'
  },
  {
    id: 'notif-4',
    type: 'TASK_ASSIGNED',
    title: 'New Work Item Assigned',
    message: 'Tech Lead Priya Sharma added you to "Build Grade Card responsive modal component".',
    is_read: true,
    created_at: '2 days ago',
    target_id: 'WI-201',
    target_type: 'task'
  },
  {
    id: 'notif-5',
    type: 'GENERAL',
    title: 'New MoM Published',
    message: 'Sarah Mitchell published Minutes of Meeting for "Sprint 2 Retrospective & Blocker Review".',
    is_read: true,
    created_at: '2 days ago',
    target_id: 'MOM-01',
    target_type: 'mom'
  }
];

let listeners = [];
function notifyListeners() {
  listeners.forEach((l) => l([...notificationsData]));
}

export const notificationsService = {
  subscribe: (listener) => {
    listeners.push(listener);
    listener([...notificationsData]);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  getAllNotifications: () => [...notificationsData],

  getUnreadCount: () => notificationsData.filter((n) => !n.is_read).length,

  markAsRead: (id) => {
    notificationsData = notificationsData.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    notifyListeners();
  },

  markAllAsRead: () => {
    notificationsData = notificationsData.map((n) => ({ ...n, is_read: true }));
    notifyListeners();
  }
};
