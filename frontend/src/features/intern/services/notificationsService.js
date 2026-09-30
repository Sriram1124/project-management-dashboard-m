// Notifications Service - Centralized Store
// Types: TASK_ASSIGNED | TASK_DEADLINE | TASK_OVERDUE | FORM_ASSIGNED | FORM_DEADLINE | FORM_OVERDUE | GENERAL

let notificationsData = [];

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
