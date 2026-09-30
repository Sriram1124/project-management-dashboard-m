import React, { useState, useEffect, useCallback } from 'react';
import MyTasksTab from '../../features/intern/components/MyTasksTab';
import TaskDetailModal from '../kanban/TaskDetailModal';
import CreatePersonalTaskModal from '../../features/intern/components/CreatePersonalTaskModal';
import { workItemsService } from '../../services/workItems.service';

export default function ManagerMyTasksView({ onToast }) {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreatePersonalOpen, setIsCreatePersonalOpen] = useState(false);

  const loadWorkItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await workItemsService.listWorkItems({ assigned_to_me: true });
      setWorkItems(items || []);
    } catch (err) {
      console.error('Failed to load manager tasks:', err);
      onToast?.(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    loadWorkItems();
  }, [loadWorkItems]);

  const handleToggleTask = async (taskId) => {
    const item = workItems.find((w) => w.id === taskId);
    if (!item) return;
    try {
      const updated = await workItemsService.toggleComplete(item);
      setWorkItems((prev) => prev.map((w) => (w.id === taskId ? updated : w)));
      onToast?.(
        updated.status === 'COMPLETED'
          ? `Marked "${updated.title}" completed!`
          : `Reopened "${updated.title}"`
      );
    } catch (err) {
      onToast?.(err.message || 'Failed to update task status');
    }
  };

  return (
    <div className="space-y-4">
      <MyTasksTab
        workItems={workItems}
        loading={loading}
        onReload={loadWorkItems}
        onOpenTaskModal={(task) => setSelectedTask(task)}
        onOpenCreatePersonalTask={() => setIsCreatePersonalOpen(true)}
        onToggleTask={handleToggleTask}
        onToast={onToast}
      />

      {/* Task Details Modal (Manager can edit, delete, assign) */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onTaskUpdated={() => {
          loadWorkItems();
        }}
        onTaskDeleted={() => {
          setSelectedTask(null);
          loadWorkItems();
          onToast?.('Task deleted successfully');
        }}
        onToast={onToast}
      />

      {/* Personal Task Creation Modal */}
      <CreatePersonalTaskModal
        isOpen={isCreatePersonalOpen}
        onClose={() => setIsCreatePersonalOpen(false)}
        onTaskCreated={() => {
          loadWorkItems();
        }}
        onToast={onToast}
      />
    </div>
  );
}
