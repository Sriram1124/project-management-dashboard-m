import { notificationsService as apiNotifications } from '../../../services/notifications.service';

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

  loadNotifications: async () => {
    try {
      const data = await apiNotifications.getNotifications();
      notificationsData = (data || []).map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        is_read: n.is_read,
        created_at: n.created_at ? new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now',
        raw: n,
      }));
      notifyListeners();
      return notificationsData;
    } catch (err) {
      console.error('Failed to load notifications from API:', err);
      return notificationsData;
    }
  },

  markAsRead: async (id) => {
    try {
      await apiNotifications.markAsRead(id);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
    notificationsData = notificationsData.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    notifyListeners();
  },

  markAllAsRead: async () => {
    try {
      await apiNotifications.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
    notificationsData = notificationsData.map((n) => ({ ...n, is_read: true }));
    notifyListeners();
  },
};

