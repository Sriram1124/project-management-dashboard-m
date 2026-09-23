import React from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Clock, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { notificationsService } from '../services/notificationsService';

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications = [],
  onOpenTarget,
  onToast
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAll = () => {
    notificationsService.markAllAsRead();
    onToast?.('All notifications marked as read');
  };

  const handleNotificationClick = (notif) => {
    notificationsService.markAsRead(notif.id);
    onOpenTarget?.(notif);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TASK_DEADLINE':
      case 'FORM_DEADLINE':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'TASK_OVERDUE':
      case 'FORM_OVERDUE':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'TASK_ASSIGNED':
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
      case 'FORM_ASSIGNED':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Notifications & Alerts
            </h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-600 text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-[11px] font-semibold text-purple-600 hover:text-purple-800"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">No notifications right now</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                  !n.is_read ? 'bg-purple-50/40' : 'bg-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4
                      className={`text-xs ${
                        !n.is_read
                          ? 'font-bold text-slate-900'
                          : 'font-semibold text-slate-700'
                      }`}
                    >
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {n.created_at}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {!n.is_read && (
                  <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-[11px] text-slate-400">
          Centralized notifications for deadlines, task assignments, and forms
        </div>
      </div>
    </div>
  );
}
