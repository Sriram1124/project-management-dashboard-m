import React from 'react';
import MetricCards from '../dashboard/MetricCards';
import BroadcastAlert from '../dashboard/BroadcastAlert';
import TeamsChannelWidget from '../dashboard/TeamsChannelWidget';
import ProjectHealth from '../dashboard/ProjectHealth';
import UpcomingDeadlines from '../dashboard/UpcomingDeadlines';
import TaskStatusOverview from '../dashboard/TaskStatusOverview';
import InternAttendance from '../dashboard/InternAttendance';
import RecentActivity from '../dashboard/RecentActivity';
import { mockDashboardData } from '../../data/mockData';

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
  return (
    <div className="space-y-6">
      {/* Primary 4 Metric Cards */}
      <MetricCards 
        metrics={mockDashboardData.metrics} 
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
            stats={{ pending: 8, overdue: 3, recipients: 11 }}
          />

          {/* Teams Channel: Active Forms (replacing 6 exception cards) */}
          <TeamsChannelWidget 
            forms={channelForms}
            onPostForm={onPostForm}
            onSubmitResponse={onSubmitResponse}
            onNavigateToChannel={() => onNavigate('channels')}
            onToast={onToast}
          />

          {/* Project Health Card */}
          <ProjectHealth 
            projects={mockDashboardData.projectHealth}
            onViewAll={() => onNavigate('projects')}
          />

          {/* Upcoming Deadlines Card */}
          <UpcomingDeadlines 
            deadlines={mockDashboardData.upcomingDeadlines}
            onViewAll={() => onNavigate('tasks')}
          />
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Task Status Overview Donut */}
          <TaskStatusOverview 
            taskData={mockDashboardData.taskStatus}
          />

          {/* Intern Attendance Gauge */}
          <InternAttendance 
            attendanceData={mockDashboardData.attendance}
            onDrilldown={() => onNavigate('reports')}
          />

          {/* Recent Activity Timeline */}
          <RecentActivity 
            activities={mockDashboardData.recentActivity}
            onViewAll={() => onNavigate('reports')}
          />
        </div>
      </div>
    </div>
  );
}
