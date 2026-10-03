import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Megaphone,
  User,
  Filter
} from 'lucide-react';
import { notificationsService } from '../services/notificationsService';

export default function AlertsTab({ notifications = [], onToast }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const filteredNotifs = filter === 'UNREAD' 
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  const handleMarkRead = async (id) => {
    await notificationsService.markAsRead(id);
    onToast?.('Notification marked as read');
  };

  const handleMarkAllRead = async () => {
    await notificationsService.markAllAsRead();
    onToast?.('All notifications marked as read');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'BROADCAST':
        return <Megaphone className="w-5 h-5 text-purple-600" />;
      case 'TASK_DEADLINE':
      case 'FORM_DEADLINE':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'TASK_OVERDUE':
      case 'FORM_OVERDUE':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'TASK_ASSIGNED':
        return <CheckCircle2 className="w-5 h-5 text-indigo-600" />;
      case 'FORM_ASSIGNED':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Tab Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Organization Alerts & Announcements
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Official notices, manager broadcasts, and operational updates.
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read ({unreadCount})</span>
            </button>
          )}

          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('UNREAD')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === 'UNREAD'
                  ? 'bg-white text-purple-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No Alerts Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filter === 'UNREAD'
                ? 'You have caught up with all notifications and announcements.'
                : 'There are currently no broadcast announcements or alerts dispatched to you.'}
            </p>
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const senderName = notif.raw?.sender?.name || notif.sender?.name || 'Management';
            const isBroadcast = notif.type === 'BROADCAST';

            return (
              <div
                key={notif.id}
                className={`p-5 rounded-2xl border transition-all ${
                  !notif.is_read
                    ? 'bg-purple-50/40 border-purple-200 shadow-xs ring-1 ring-purple-100'
                    : 'bg-white border-slate-200/90 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-xl shrink-0 border ${
                    !notif.is_read
                      ? 'bg-purple-100/80 border-purple-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm ${!notif.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {notif.title}
                        </h3>
                        {isBroadcast && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                            Broadcast
                          </span>
                        )}
                        {!notif.is_read && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            New Alert
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {notif.created_at}
                      </span>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                      {notif.message}
                    </p>

                    {/* Metadata & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>From: <strong className="text-slate-600 font-semibold">{senderName}</strong></span>
                      </div>

                      {!notif.is_read ? (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(notif.id)}
                          className="flex items-center gap-1 text-purple-700 font-bold hover:text-purple-900 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark as Read</span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Read</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
