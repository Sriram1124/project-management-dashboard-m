import React from 'react';
import { 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  FolderPlus, 
  FileText, 
  MessageSquare, 
  Bell 
} from 'lucide-react';

export default function RecentActivity({ activities, onViewAll }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'UserPlus':
        return <UserPlus className="w-3.5 h-3.5 text-purple-600" />;
      case 'Clock':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'FolderPlus':
        return <FolderPlus className="w-3.5 h-3.5 text-purple-600" />;
      case 'FileText':
        return <FileText className="w-3.5 h-3.5 text-rose-500" />;
      case 'MessageSquare':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-600" />;
      case 'Bell':
        return <Bell className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Recent Activity
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Activity Timeline list */}
      <div className="space-y-3.5">
        {(!activities || activities.length === 0) ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No Recent Activity</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Platform activity and audit logs will appear here in V2.</p>
          </div>
        ) : (
          activities.map((act) => (
          <div key={act.id} className="flex items-start gap-3 group">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${act.color} border border-black/5`}>
              {getIcon(act.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-purple-700 transition-colors">
                {act.title}
              </p>
              <span className="text-[10px] font-medium text-slate-400">
                {act.time}
              </span>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

