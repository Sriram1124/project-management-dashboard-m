import React, { useState } from 'react';
import FilterBar from './FilterBar';
import KanbanColumn from './KanbanColumn';
import AddTaskModal from './AddTaskModal';
import TaskDetailModal from './TaskDetailModal';
import LogWorkModal from './LogWorkModal';
import CompleteSprintModal from './CompleteSprintModal';
import { Plus, Clock, Check } from 'lucide-react';
import { 
  COLUMNS_CONFIG, 
  INITIAL_KANBAN_TASKS, 
  KANBAN_STATUSES, 
  KANBAN_PRIORITIES 
} from '../../constants/kanban';

export default function KanbanBoard({ onToast }) {
  const [tasks, setTasks] = useState(INITIAL_KANBAN_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSprint, setSelectedSprint] = useState('Sprint 04 / Active Sprint');
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [quickFilterMyTasks, setQuickFilterMyTasks] = useState(false);
  const [quickFilterOverdue, setQuickFilterOverdue] = useState(false);
  const [quickFilterBlocked, setQuickFilterBlocked] = useState(false);

  // Modal States
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addTaskColumnId, setAddTaskColumnId] = useState(KANBAN_STATUSES.TODO);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLogWorkOpen, setIsLogWorkOpen] = useState(false);
  const [isCompleteSprintOpen, setIsCompleteSprintOpen] = useState(false);

  // Sprint Metrics State
  const [hoursLoggedMinutes, setHoursLoggedMinutes] = useState(45 * 60 + 20); // 45h 20m
  const [isSprintCompleted, setIsSprintCompleted] = useState(false);

  const hoursLoggedFormatted = `${Math.floor(hoursLoggedMinutes / 60)}h ${hoursLoggedMinutes % 60}m`;

  // Drag and drop handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDropTask = (taskId, targetColumnId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isTargetCompleted = targetColumnId === KANBAN_STATUSES.COMPLETED;
          const isTargetBlocked = targetColumnId === KANBAN_STATUSES.BLOCKED;
          return {
            ...t,
            status: targetColumnId,
            priority: isTargetBlocked
              ? KANBAN_PRIORITIES.BLOCKED
              : isTargetCompleted
              ? KANBAN_PRIORITIES.COMPLETED
              : t.priority === KANBAN_PRIORITIES.BLOCKED || t.priority === KANBAN_PRIORITIES.COMPLETED
              ? KANBAN_PRIORITIES.MEDIUM
              : t.priority,
          };
        }
        return t;
      })
    );

    const movedTask = tasks.find((t) => t.id === taskId);
    const targetCol = COLUMNS_CONFIG.find((c) => c.id === targetColumnId);
    onToast?.(`Moved ${movedTask?.id || 'task'} to ${targetCol?.title || targetColumnId}`);
  };

  // Add Task
  const handleOpenAddTask = (columnId) => {
    setAddTaskColumnId(columnId || KANBAN_STATUSES.TODO);
    setIsAddTaskOpen(true);
  };

  const handleSaveTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    onToast?.(`Created task ${newTask.id}: ${newTask.title}`);
  };

  // Task Details / Update / Delete
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setSelectedTask(updatedTask);
    onToast?.(`Updated ${updatedTask.id}`);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    onToast?.(`Deleted task ${taskId}`);
  };

  // Log Work
  const handleSaveLog = ({ hours, minutes, description, taskId }) => {
    const totalAdded = hours * 60 + minutes;
    setHoursLoggedMinutes((prev) => prev + totalAdded);

    if (taskId) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              timeLogged: `${hours}h ${minutes}m`,
            };
          }
          return t;
        })
      );
    }

    onToast?.(`Logged ${hours}h ${minutes}m to ${selectedSprint}`);
  };

  // Complete Sprint
  const handleConfirmCompleteSprint = (moveDestination) => {
    setIsSprintCompleted(true);
    onToast?.(`${selectedSprint} completed! Open tasks moved to ${moveDestination === 'next-sprint' ? 'Sprint 05' : 'Backlog'}.`);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedAssignee(null);
    setSelectedPriority(null);
    setSelectedEpic(null);
    setQuickFilterMyTasks(false);
    setQuickFilterOverdue(false);
    setQuickFilterBlocked(false);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = task.id.toLowerCase().includes(q);
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchEpic = task.epic?.toLowerCase().includes(q);
      const matchAssignee = task.assignee?.name?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchDesc && !matchEpic && !matchAssignee) {
        return false;
      }
    }

    if (selectedAssignee && task.assignee?.id !== selectedAssignee.id) {
      return false;
    }

    if (selectedPriority && task.priority !== selectedPriority) {
      return false;
    }

    if (selectedEpic && selectedEpic !== 'All Epics' && task.epic !== selectedEpic) {
      return false;
    }

    if (selectedSprint && task.sprint && task.sprint !== selectedSprint) {
      return false;
    }

    if (quickFilterMyTasks) {
      if (!task.assignee || (task.assignee.name !== 'Priya Sharma' && task.assignee.name !== 'Sarah Mitchell')) {
        return false;
      }
    }

    if (quickFilterOverdue && !task.isOverdue) {
      return false;
    }

    if (quickFilterBlocked && task.status !== KANBAN_STATUSES.BLOCKED && task.priority !== KANBAN_PRIORITIES.BLOCKED) {
      return false;
    }

    return true;
  });

  const completedTasks = tasks.filter((t) => t.status === KANBAN_STATUSES.COMPLETED);
  const completedCount = completedTasks.length;
  const blockedCount = tasks.filter((t) => t.status === KANBAN_STATUSES.BLOCKED).length;
  const incompleteCount = tasks.length - completedCount;

  return (
    <div className="space-y-3">
      {/* 9. RESTRAINED KANBAN BOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-md border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Kanban Board
            </h2>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-purple-700">Sprint 04</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Dec 1 – Dec 14</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
            <span>{tasks.length} tasks</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{completedCount} completed</span>
            <span>•</span>
            <span className="text-rose-700 font-semibold">{blockedCount} blocked</span>
            <span>•</span>
            <span>{hoursLoggedFormatted} logged</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsLogWorkOpen(true)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Log Work</span>
          </button>

          <button
            onClick={() => setIsCompleteSprintOpen(true)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-slate-500" />
            <span>Complete Sprint</span>
          </button>

          <button
            onClick={() => handleOpenAddTask(KANBAN_STATUSES.TODO)}
            className="px-3 py-1.5 rounded-md bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAssignee={selectedAssignee}
        onSelectAssignee={setSelectedAssignee}
        selectedPriority={selectedPriority}
        onSelectPriority={setSelectedPriority}
        selectedEpic={selectedEpic}
        onSelectEpic={setSelectedEpic}
        selectedSprint={selectedSprint}
        onSelectSprint={setSelectedSprint}
        quickFilterMyTasks={quickFilterMyTasks}
        onToggleMyTasks={() => setQuickFilterMyTasks(!quickFilterMyTasks)}
        quickFilterOverdue={quickFilterOverdue}
        onToggleOverdue={() => setQuickFilterOverdue(!quickFilterOverdue)}
        quickFilterBlocked={quickFilterBlocked}
        onToggleBlocked={() => setQuickFilterBlocked(!quickFilterBlocked)}
        onClearFilters={handleClearFilters}
      />

      {/* KANBAN BOARD COLUMNS (HERO ELEMENT) */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="flex gap-3 min-w-[1380px]">
          {COLUMNS_CONFIG.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={colTasks}
                onAddTask={handleOpenAddTask}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDropTask={handleDropTask}
              />
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        initialStatus={addTaskColumnId}
        onSaveTask={handleSaveTask}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <LogWorkModal
        isOpen={isLogWorkOpen}
        onClose={() => setIsLogWorkOpen(false)}
        tasks={tasks}
        onSaveLog={handleSaveLog}
      />

      <CompleteSprintModal
        isOpen={isCompleteSprintOpen}
        onClose={() => setIsCompleteSprintOpen(false)}
        completedCount={completedCount}
        incompleteCount={incompleteCount}
        onConfirmComplete={handleConfirmCompleteSprint}
      />
    </div>
  );
}
