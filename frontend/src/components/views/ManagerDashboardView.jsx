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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      projectsService.getProjects().catch(() => ({ projects: [] })),
      projectsService.getUsers().catch(() => ({ users: [] }))
    ]).then(([projData, userData]) => {
      if (isMounted) {
        setProjects(projData?.projects || []);
        setUsers(userData?.users || []);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeProjectsCount = projects.filter((p) => p.status === 'ACTIVE' || p.status === 'PLANNED').length;

  const dynamicMetrics = {
    totalInterns: {
      value: users.length,
      change: `${users.length} Organization Members`,
    },
    activeProjects: {
      value: projects.length,
      subtitle: `${activeProjectsCount} In Progress / Planned`,
    },
    tasksCompleted: {
      value: '—',
      change: 'Planned for V2',
    },
    overdueTasks: {
      value: '—',
      subtitle: 'Planned for V2',
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
            stats={{ pending: 0, overdue: 0, recipients: users.length }}
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

          {/* Upcoming Deadlines Card (V2 Planned) */}
          <UpcomingDeadlines 
            deadlines={[]}
            onViewAll={() => onNavigate('tasks')}
          />
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Task Status Overview Donut (V2 Planned) */}
          <TaskStatusOverview 
            taskData={null}
          />

          {/* Intern Attendance Gauge (V2 Planned) */}
          <InternAttendance 
            attendanceData={null}
            onDrilldown={() => onNavigate('reports')}
          />

          {/* Recent Activity Timeline (V2 Planned) */}
          <RecentActivity 
            activities={[]}
            onViewAll={() => onNavigate('reports')}
          />
        </div>
      </div>
    </div>
  );
}
