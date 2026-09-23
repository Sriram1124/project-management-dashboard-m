import React, { useState } from 'react';
import IssueRow from './IssueRow';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Check, 
  Play, 
  Calendar,
  MoreHorizontal
} from 'lucide-react';

export default function SprintSection({
  sprint,
  issues = [],
  epics = [],
  selectedIssueId,
  onSelectIssue,
  onDragStart,
  onDragEnd,
  onDropIssue,
  onToggleSubtask,
  onAddSubtask,
  onCreateIssueInSprint,
  onCompleteSprint,
  onStartSprint,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  // Calculate totals
  const totalSP = issues.reduce((acc, curr) => acc + (Number(curr.storyPoints) || 0), 0);
  const completedCount = issues.filter(i => i.status === 'DONE' || i.status === 'COMPLETED').length;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const issueId = e.dataTransfer.getData('text/plain');
    if (issueId) {
      onDropIssue?.(issueId, sprint.id);
    }
  };

  const isBacklog = sprint.id === 'backlog';
  const isActive = sprint.status === 'ACTIVE';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-md border transition-colors select-none ${
        isDragOver
          ? 'border-purple-400 bg-purple-50/30'
          : 'border-slate-200 bg-white'
      }`}
    >
      {/* Sprint Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-50/80 border-b border-slate-200 rounded-t-md text-xs">
        {/* Left: Expander, Name, Badge, Dates, Stats */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-500 hover:text-slate-800 p-0.5 rounded transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          <h3 className="font-bold text-slate-900 tracking-tight">
            {sprint.name}
          </h3>

          {/* Status Badge */}
          {isActive ? (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200/60 uppercase">
              Active Sprint
            </span>
          ) : !isBacklog ? (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-200/70 text-slate-700 uppercase">
              Planned
            </span>
          ) : null}

          {/* Dates */}
          {!isBacklog && sprint.dates && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{sprint.dates}</span>
            </div>
          )}

          {/* Issue Count & Story Points */}
          <span className="text-[11px] text-slate-400">
            · {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
            {totalSP > 0 && ` · ${totalSP} SP`}
            {isActive && completedCount > 0 && ` (${completedCount} done)`}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          {isActive ? (
            <button
              onClick={() => onCompleteSprint?.(sprint.id)}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Complete sprint</span>
            </button>
          ) : !isBacklog ? (
            <button
              onClick={() => onStartSprint?.(sprint.id)}
              className="px-2.5 py-1 rounded-md border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-purple-600 text-purple-600" />
              <span>Start sprint</span>
            </button>
          ) : null}

          <button
            onClick={() => onCreateIssueInSprint?.(sprint.id)}
            className="px-2 py-1 rounded-md text-slate-600 hover:text-purple-700 hover:bg-slate-100 text-xs font-medium transition-colors flex items-center gap-1"
            title={`Add issue to ${sprint.name}`}
          >
            <Plus className="w-3 h-3" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Issues List */}
      {isExpanded && (
        <div className="divide-y divide-slate-100">
          {issues.map((issue) => {
            const issueEpic = epics.find(e => e.id === issue.epicId);
            return (
              <IssueRow
                key={issue.id}
                issue={issue}
                epic={issueEpic}
                isSelected={selectedIssueId === issue.id}
                onSelectIssue={onSelectIssue}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onToggleSubtask={onToggleSubtask}
                onAddSubtask={onAddSubtask}
              />
            );
          })}

          {issues.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-400 border-dashed">
              No issues in {sprint.name}. Drag issues here or{' '}
              <button
                onClick={() => onCreateIssueInSprint?.(sprint.id)}
                className="text-purple-700 font-semibold hover:underline"
              >
                create an issue
              </button>.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

