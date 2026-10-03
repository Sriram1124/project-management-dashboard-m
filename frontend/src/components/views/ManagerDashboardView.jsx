import React, { useState, useEffect } from 'react';
import MetricCards from '../dashboard/MetricCards';
import BroadcastAlert from '../dashboard/BroadcastAlert';
import TeamsChannelWidget from '../dashboard/TeamsChannelWidget';
import ProjectHealth from '../dashboard/ProjectHealth';
import UpcomingDeadlines from '../dashboard/UpcomingDeadlines';
import TaskStatusOverview from '../dashboard/TaskStatusOverview';
import InternAttendance from '../dashboard/InternAttendance';
import RecentActivity from '../dashboard/RecentActivity';
import { projectsService } from '../../services/projects.service';
import { workItemsService } from '../../services/workItems.service';

export default function ManagerDashboardView({ 
  onNavigate, 
  onOpenAlertModal, 
  onOpenExceptionModal,
  onSendAlertMessage,
  channelForms = [],
  onPostForm,
  onSubmitResponse,
  onToast
}) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      projectsService.getProjects().catch(() => ({ projects: [] })),
      projectsService.getUsers().catch(() => ({ users: [] })),
      workItemsService.listWorkItems().catch(() => [])
    ]).then(([projData, userData, workData]) => {
      if (isMounted) {
        setProjects(Array.isArray(projData) ? projData : (projData?.projects || []));
        const loadedUsers = Array.isArray(userData) ? userData : (userData?.users || []);
        setUsers(loadedUsers);
        setWorkItems(Array.isArray(workData) ? workData : []);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeProjectsCount = projects.filter((p) => p.status === 'ACTIVE' || p.status === 'PLANNED').length;
  const completedTasks = workItems.filter((w) => w.status === 'COMPLETED').length;
  const overdueTasks = workItems.filter((w) => workItemsService.isOverdue(w)).length;
  const activeUsersCount = users.filter((u) => u.is_active !== false).length;

  const dynamicMetrics = {
    totalInterns: {
      value: users.length,
      change: `${activeUsersCount} Active Members`,
    },
    activeProjects: {
      value: projects.length,
      subtitle: `${activeProjectsCount} In Progress / Planned`,
    },
    tasksCompleted: {
      value: completedTasks,
      change: `${completedTasks} of ${workItems.length} Total Tasks`,
    },
    overdueTasks: {
      value: overdueTasks,
      subtitle: overdueTasks > 0 ? `${overdueTasks} Tasks Require Attention` : 'All Tasks on Schedule',
    },
  };

  const dynamicProjectHealth = projects.map((proj) => {
    const ownerName = proj.owner ? (proj.owner.name || proj.owner.email) : 'Unassigned';
    const memberCount = proj._count?.members ?? (proj.members?.length ?? 0);
    return {
      id: proj.id,
      name: proj.name,
      lead: ownerName,
      section: proj.status,
      internsCount: memberCount,
      progress: proj.status === 'COMPLETED' ? 100 : (proj.status === 'ACTIVE' ? 50 : 10),
      status: proj.status,
      statusType: proj.status === 'ACTIVE' ? 'success' : (proj.status === 'PLANNED' ? 'warning' : 'default'),
    };
  });

  // Calculate upcoming deadlines from live work items
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999);

  const dueItems = workItems.filter((w) => w.status !== 'COMPLETED' && w.due_date);
  const todayItems = [];
  const weekItems = [];
  const upcomingItems = [];

  dueItems.forEach((w) => {
    const due = new Date(w.due_date);
    const projName = w.project?.name || 'Personal / General';
    const assigneeName = w.assignees?.map((a) => a.name || a.email).join(', ') || 'Assigned Team';
    const itemData = {
      id: w.id,
      title: w.title,
      subtitle: `${projName} • Assignee: ${assigneeName}`,
      tag: w.priority || 'NORMAL',
      tagType: w.priority === 'HIGH' || w.priority === 'URGENT' ? 'danger' : 'purple',
      dueTime: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    if (due <= endOfToday) {
      todayItems.push(itemData);
    } else if (due <= endOfWeek) {
      weekItems.push(itemData);
    } else {
      upcomingItems.push(itemData);
    }
  });

  const dynamicDeadlines = [
    ...(todayItems.length > 0 ? [{ group: 'TODAY', items: todayItems }] : []),
    ...(weekItems.length > 0 ? [{ group: 'THIS WEEK', items: weekItems }] : []),
    ...(upcomingItems.length > 0 ? [{ group: 'UPCOMING', items: upcomingItems }] : []),
  ];

  // Calculate live task status breakdown for donut chart
  const totalTasks = workItems.length;
  const statusCounts = {
    COMPLETED: workItems.filter((w) => w.status === 'COMPLETED').length,
    IN_PROGRESS: workItems.filter((w) => w.status === 'IN_PROGRESS').length,
    IN_REVIEW: workItems.filter((w) => w.status === 'IN_REVIEW').length,
    TODO: workItems.filter((w) => w.status === 'TODO').length,
    BLOCKED: workItems.filter((w) => w.status === 'BLOCKED').length,
  };

  const dynamicTaskData = totalTasks > 0 ? {
    total: totalTasks,
    segments: [
      { label: 'Completed', count: statusCounts.COMPLETED, percentage: Math.round((statusCounts.COMPLETED / totalTasks) * 100), color: '#10B981' },
      { label: 'In Progress', count: statusCounts.IN_PROGRESS, percentage: Math.round((statusCounts.IN_PROGRESS / totalTasks) * 100), color: '#7C3AED' },
      { label: 'In Review', count: statusCounts.IN_REVIEW, percentage: Math.round((statusCounts.IN_REVIEW / totalTasks) * 100), color: '#3B82F6' },
      { label: 'To Do', count: statusCounts.TODO + statusCounts.BLOCKED, percentage: Math.max(0, 100 - (Math.round((statusCounts.COMPLETED / totalTasks) * 100) + Math.round((statusCounts.IN_PROGRESS / totalTasks) * 100) + Math.round((statusCounts.IN_REVIEW / totalTasks) * 100))), color: '#94A3B8' },
    ],
  } : null;

  return (
    <div className="space-y-6">
      {/* Primary 4 Metric Cards */}
      <MetricCards 
        metrics={dynamicMetrics} 
        onCardClick={(type) => {
          if (type === 'interns') onNavigate('interns');
          else if (type === 'projects') onNavigate('projects');
          else if (type === 'tasks' || type === 'tasks-overdue') onNavigate('tasks');
        }}
      />

      {/* Main Grid: Left Column (2/3) and Right Column (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Admin Broadcast Alert Panel */}
          <BroadcastAlert 
            onSendAlert={onSendAlertMessage}
            onPreview={onOpenAlertModal}
            users={users}
          />

          {/* Teams Channel: Active Forms */}
          <TeamsChannelWidget 
            forms={channelForms}
            onPostForm={onPostForm}
            onSubmitResponse={onSubmitResponse}
            onNavigateToChannel={() => onNavigate('channels')}
            onToast={onToast}
          />

          {/* Project Health Card (Real Projects) */}
          <ProjectHealth 
            projects={dynamicProjectHealth}
            onViewAll={() => onNavigate('projects')}
          />

          {/* Upcoming Deadlines Card */}
          <UpcomingDeadlines 
            deadlines={dynamicDeadlines}
            onViewAll={() => onNavigate('tasks')}
          />
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Task Status Overview Donut */}
          <TaskStatusOverview 
            taskData={dynamicTaskData}
          />

          {/* Intern Attendance Gauge */}
          <InternAttendance 
            attendanceData={null}
            onDrilldown={() => onNavigate('reports')}
          />

          {/* Recent Activity Timeline */}
          <RecentActivity 
            activities={[]}
            onViewAll={() => onNavigate('reports')}
          />
        </div>
      </div>
    </div>
  );
}
