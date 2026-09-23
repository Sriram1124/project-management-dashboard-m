import React from 'react';
import { Clock, CheckCircle2, User, Lock } from 'lucide-react';
import { KANBAN_STATUSES, KANBAN_PRIORITIES } from '../../constants/kanban';

export default function TaskCard({
  task,
  onClick,
  onDragStart,
  onDragEnd,
}) {
  const isBlocked = task.status === KANBAN_STATUSES.BLOCKED;
  const isCompleted = task.status === KANBAN_STATUSES.COMPLETED;

  // Restrained enterprise priority badges
  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case KANBAN_PRIORITIES.HIGH:
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case KANBAN_PRIORITIES.MEDIUM:
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case KANBAN_PRIORITIES.LOW:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
      case KANBAN_PRIORITIES.BLOCKED:
        return 'bg-rose-100 text-rose-800 border border-rose-300 font-semibold';
      case KANBAN_PRIORITIES.COMPLETED:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(task)}
      className={`p-2.5 rounded-md bg-white select-none group border transition-colors cursor-grab active:cursor-grabbing ${
        isBlocked
          ? 'border-rose-300 bg-rose-50/20'
          : isCompleted
          ? 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Row: Issue ID (left) and Priority (right) */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="text-[11px] font-mono font-medium text-slate-500 group-hover:text-purple-700 transition-colors">
          {task.id}
        </span>

        <span
          className={`px-1.5 py-0.2 rounded text-[10px] font-medium inline-flex items-center gap-1 ${getPriorityBadgeStyle(
            task.priority
          )}`}
        >
          {isBlocked && <Lock className="w-2.5 h-2.5" />}
          {isCompleted && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
          <span>{task.priority}</span>
        </span>
      </div>

      {/* Task Title */}
      <h4
        className={`text-xs font-semibold leading-snug text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 ${
          isCompleted ? 'text-slate-700' : ''
        }`}
      >
        {task.title}
      </h4>

      {/* Epic & Story Points */}
      <div className="flex items-center text-[11px] text-slate-500 mt-1">
        <span className="truncate max-w-[170px]">{task.epic}</span>
        {task.storyPoints !== undefined && (
          <span className="shrink-0 ml-1">
            · {task.storyPoints} SP
          </span>
        )}
      </div>

      {/* Card Divider */}
      <div className="my-2 border-t border-slate-100" />

      {/* Card Footer: Due Date (left) and Assignee Avatar (right) */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <Clock
            className={`w-3 h-3 ${
              task.isOverdue ? 'text-rose-600' : 'text-slate-400'
            }`}
          />
          <span
            className={`text-[10px] font-medium ${
              task.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Due {task.dueDate}
          </span>
        </div>

        {task.assignee ? (
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            title={task.assignee.name}
            className="w-5 h-5 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div
            title="Unassigned"
            className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200"
          >
            <User className="w-3 h-3 text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
}
