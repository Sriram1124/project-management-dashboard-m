import React, { useState } from 'react';
import { Clock, Lock, CheckCircle2, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { workItemsService } from '../services/workItemsService';

const COLUMNS = [
  { id: 'TODO', title: 'TO DO', dotColor: 'bg-slate-400' },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS', dotColor: 'bg-purple-600' },
  { id: 'IN_REVIEW', title: 'IN REVIEW', dotColor: 'bg-blue-500' },
  { id: 'BLOCKED', title: 'BLOCKED', dotColor: 'bg-rose-500' },
  { id: 'COMPLETED', title: 'DONE', dotColor: 'bg-emerald-500' }
];

export default function PersonalKanbanBoard({
  workItems = [],
  onTaskClick,
  onToast
}) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, taskId) => {
    setDraggedId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = workItems.find((w) => w.id === taskId);
    if (task && task.status !== targetStatus) {
      workItemsService.updateWorkItem(taskId, { status: targetStatus });
      onToast?.(`Moved ${task.id} to ${targetStatus.replace('_', ' ')}`);
    }
  };

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'LOW':
        return 'bg-slate-100 text-slate-600 border border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'EPIC':
        return 'text-purple-700 bg-purple-50';
      case 'STORY':
        return 'text-emerald-700 bg-emerald-50';
      case 'BUG':
        return 'text-rose-700 bg-rose-50';
      default:
        return 'text-blue-700 bg-blue-50';
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 select-none">
      {COLUMNS.map((col) => {
        const columnTasks = workItems.filter((w) => w.status === col.id);
        const isHovered = dragOverCol === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`w-[260px] sm:w-[270px] min-w-[260px] shrink-0 rounded-xl p-3 border transition-colors flex flex-col min-h-[500px] ${
              isHovered
                ? 'bg-purple-50/60 border-purple-400 ring-2 ring-purple-400/20'
                : 'bg-[#F8FAFC] border-slate-200'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${col.dotColor}`} />
                <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                  {col.title}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-full bg-white border border-slate-200">
                {columnTasks.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="flex-1 space-y-2.5 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200/80 rounded-lg text-[11px] text-slate-400 font-medium">
                  No tasks
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isOverdue = workItemsService.isOverdue(task);
                  const isBlocked = task.status === 'BLOCKED';
                  const isCompleted = task.status === 'COMPLETED';

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onTaskClick?.(task)}
                      className={`p-3 rounded-xl bg-white border transition-all cursor-grab active:cursor-grabbing hover:border-purple-300 hover:shadow-xs group ${
                        isBlocked
                          ? 'border-rose-300 bg-rose-50/20'
                          : isCompleted
                          ? 'border-slate-200 opacity-80'
                          : 'border-slate-200 shadow-2xs'
                      }`}
                    >
                      {/* Top Row: Type, ID, Priority */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded font-mono ${getTypeStyle(
                              task.type
                            )}`}
                          >
                            {task.type}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-purple-700 transition-colors">
                            {task.id}
                          </span>
                        </div>

                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${getPriorityBadgeStyle(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Task Title */}
                      <h4
                        className={`text-xs font-semibold leading-snug text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Project / Category */}
                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        {task.project_name || 'Personal Goal'}
                      </div>

                      {/* Divider */}
                      <div className="my-2 border-t border-slate-100" />

                      {/* Footer: Due Date & Assignee Avatar */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Clock
                            className={`w-3 h-3 ${
                              isOverdue ? 'text-rose-600' : 'text-slate-400'
                            }`}
                          />
                          <span
                            className={`text-[10px] font-medium ${
                              isOverdue
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-500'
                            }`}
                          >
                            {isOverdue
                              ? 'Overdue'
                              : new Date(task.due_date).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                          </span>
                        </div>

                        {/* Assignee Avatar */}
                        <div className="flex items-center -space-x-1">
                          {task.work_item_assignees?.map((a) => (
                            <img
                              key={a.id}
                              src={a.avatar}
                              alt={a.name}
                              title={a.name}
                              className="w-5 h-5 rounded-full border border-white object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

