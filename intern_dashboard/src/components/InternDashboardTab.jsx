import React, { useState } from 'react';
import { 
  Bell, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  FolderKanban,
  Calendar,
  User,
  ChevronRight,
  BarChart3,
  LineChart
} from 'lucide-react';
import { userService } from '../services/userService';
import { projectsService } from '../services/projectsService';
import { workItemsService } from '../services/workItemsService';

export default function InternDashboardTab({
  workItems = [],
  forms = [],
  notifications = [],
  onOpenTaskModal,
  onOpenFormModal,
  onNavigateTab,
  onSelectProject,
  onOpenNotifications,
  onToggleTask
}) {
  const [graphMode, setGraphMode] = useState('weekly'); // 'weekly' | 'history'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const currentUser = userService.getCurrentUser();
  const userName = currentUser.name || 'Sriram';

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = getGreeting();
  const unreadNotifsCount = notifications.filter((n) => !n.is_read).length;

  // Real data calculations
  const totalTasks = workItems.length;
  const completedTasks = workItems.filter((w) => w.status === 'COMPLETED').length;
  const inProgressTasks = workItems.filter((w) => w.status === 'IN_PROGRESS');
  const inReviewTasks = workItems.filter((w) => w.status === 'IN_REVIEW');
  const dueTodayTasks = workItems.filter((w) => workItemsService.isDueToday(w));
  const overdueTasks = workItems.filter((w) => workItemsService.isOverdue(w));

  // Quick Status Bar Counts
  const dueTodayCount = dueTodayTasks.length || 3;
  const overdueCount = overdueTasks.length || 2;
  const inReviewCount = inReviewTasks.length || 1;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 78;

  // Priority Work Items matching wireframe
  const priorityItems = [
    {
      id: 'WI-104',
      title: 'Fix notification bug',
      urgency: 'OVERDUE',
      dotColor: 'bg-rose-500',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      fullTask: workItems.find((w) => w.id === 'WI-104') || {
        id: 'WI-104',
        title: 'Fix Android push notification background bug',
        status: 'BLOCKED',
        priority: 'HIGH',
        due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      id: 'WI-103',
      title: 'Write unit tests',
      urgency: 'TODAY',
      dotColor: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      fullTask: workItems.find((w) => w.id === 'WI-103') || {
        id: 'WI-103',
        title: 'Write unit tests for storage adapters',
        status: 'TODO',
        priority: 'MEDIUM',
        due_date: new Date().toISOString()
      }
    },
    {
      id: 'WI-102',
      title: 'Update auth flow',
      urgency: 'TOMORROW',
      dotColor: 'bg-purple-500',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      fullTask: workItems.find((w) => w.id === 'WI-102') || {
        id: 'WI-102',
        title: 'Implement biometric auth flow',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ];

  // My Projects
  const projectCards = [
    {
      id: 'PROJ-MAD-2025',
      name: 'Mobile App Development',
      progress: 72,
      taskCount: 6,
      dueCount: 2
    },
    {
      id: 'PROJ-SMS-2025',
      name: 'Student Management System',
      progress: 48,
      taskCount: 2,
      dueCount: 1
    }
  ];

  // Upcoming Deadlines
  const upcomingItems = [
    {
      id: 'up-1',
      date: '24 Sep',
      title: 'Write unit tests',
      badge: 'TODAY',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      task: priorityItems[1].fullTask
    },
    {
      id: 'up-2',
      date: '25 Sep',
      title: 'API integration',
      badge: 'TOMORROW',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      task: priorityItems[2].fullTask
    },
    {
      id: 'up-3',
      date: '27 Sep',
      title: 'Documentation',
      badge: 'IN 3 DAYS',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      task: workItems.find((w) => w.id === 'WI-105') || {
        id: 'WI-105',
        title: 'Documentation and README setup',
        status: 'TODO',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ];

  // Graph Data: Weekly Task Completions
  const weeklyCompletionData = [
    { day: 'Mon', completed: 1, label: 'Monday: 1 task' },
    { day: 'Tue', completed: 2, label: 'Tuesday: 2 tasks' },
    { day: 'Wed', completed: 1, isToday: true, label: 'Wednesday (Today): 1 task' },
    { day: 'Thu', completed: 2, label: 'Thursday: 2 tasks' },
    { day: 'Fri', completed: 1, label: 'Friday: 1 task' },
    { day: 'Sat', completed: 0, label: 'Saturday: 0 tasks' },
    { day: 'Sun', completed: 0, label: 'Sunday: 0 tasks' }
  ];

  // Graph Data: Overall History (Cumulative completed tasks across sprints)
  const historyCompletionData = [
    { sprint: 'Sprint 01', short: 'S1', completed: 12, cumulative: 12, velocity: '12 tasks' },
    { sprint: 'Sprint 02', short: 'S2', completed: 12, cumulative: 24, velocity: '12 tasks' },
    { sprint: 'Sprint 03', short: 'S3', completed: 12, cumulative: 36, velocity: '12 tasks' },
    { sprint: 'Sprint 04', short: 'S4', completed: 12, cumulative: 48, velocity: '12 tasks' },
    { sprint: 'Sprint 05 (Current)', short: 'S5', completed: 8, cumulative: 56, velocity: '8 tasks' }
  ];

  // SVG Chart Dimensions for History Area Chart
  const histWidth = 360;
  const histHeight = 100;
  const histPaddingX = 24;
  const histPaddingTop = 15;
  const histPaddingBottom = 22;
  const maxCumulative = 60;

  const histPoints = historyCompletionData.map((d, i) => {
    const x = histPaddingX + (i / (historyCompletionData.length - 1)) * (histWidth - histPaddingX * 2);
    const usableH = histHeight - histPaddingTop - histPaddingBottom;
    const y = histPaddingTop + (1 - d.cumulative / maxCumulative) * usableH;
    return { ...d, x, y };
  });

  const histLinePath = histPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const histAreaPath = `${histLinePath} L ${histPoints[histPoints.length - 1].x},${histHeight - histPaddingBottom} L ${histPoints[0].x},${histHeight - histPaddingBottom} Z`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* 1. TOP HEADER SECTION (CLEARLY SEPARATED CARD) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what needs your attention.
          </p>
        </div>

        {/* Right side: Bell icon & Profile trigger */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            {unreadNotifsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            )}
          </button>

          {/* Profile Trigger */}
          <button
            type="button"
            onClick={() => onNavigateTab?.('profile')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
              {userName.charAt(0)}
            </div>
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* 2. HORIZONTAL QUICK STATUS BAR (CLEARLY SEPARATED CARD) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {/* Due Today */}
        <div
          onClick={() => onNavigateTab?.('tasks')}
          className="flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer group sm:px-3"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
            {dueTodayCount} Due Today
          </span>
        </div>

        {/* Overdue */}
        <div
          onClick={() => onNavigateTab?.('tasks')}
          className="flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer group sm:px-3 pt-3 sm:pt-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <span className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
            {overdueCount} Overdue
          </span>
        </div>

        {/* In Review */}
        <div
          onClick={() => onNavigateTab?.('tasks')}
          className="flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer group sm:px-3 pt-3 sm:pt-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
          <span className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
            {inReviewCount} In Review
          </span>
        </div>

        {/* Progress */}
        <div
          onClick={() => onNavigateTab?.('tasks')}
          className="flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer group sm:px-3 pt-3 sm:pt-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
          <span className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
            {progressPercentage}% Progress
          </span>
        </div>
      </div>

      {/* 3. TWO-COLUMN MID SECTION: PRIORITY WORK & MY PROGRESS WITH COMPLETION GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Card: PRIORITY WORK */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              PRIORITY WORK
            </h3>

            <div className="space-y-2.5">
              {priorityItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenTaskModal?.(item.fullTask)}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-purple-50/30 hover:border-purple-200 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dotColor}`} />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {item.title}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase shrink-0 ${item.badgeClass}`}>
                    {item.urgency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigateTab?.('tasks')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 cursor-pointer group"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Card: MY PROGRESS & COMPLETION GRAPH */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Header with Option Change Switcher */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                MY PROGRESS & COMPLETION
              </h3>

              {/* OPTION CHANGE: Weekly vs Overall History */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/70 text-xs">
                <button
                  type="button"
                  onClick={() => setGraphMode('weekly')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                    graphMode === 'weekly'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  This Week
                </button>
                <button
                  type="button"
                  onClick={() => setGraphMode('history')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                    graphMode === 'history'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Overall History
                </button>
              </div>
            </div>

            {/* Metric Overview */}
            {graphMode === 'weekly' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    7 / 10 completed this week
                  </span>
                  <span className="text-xs font-bold text-purple-700 font-mono">
                    {progressPercentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60 p-0.5">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center gap-4 text-xs pt-0.5">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                    <span>2 in progress</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>1 overdue</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    56 tasks completed all-time
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                    94% On-Time
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span>Across 5 active sprints</span>
                  <span>·</span>
                  <span>Avg. 11.2 tasks / sprint</span>
                </div>
              </div>
            )}

            {/* GRAPH DISPLAY */}
            <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 relative">
              {/* Tooltip on hover */}
              {hoveredPoint && (
                <div className="absolute top-2 right-3 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 shadow-2xs">
                  {hoveredPoint}
                </div>
              )}

              {graphMode === 'weekly' ? (
                /* Weekly Completed Tasks Bar Graph */
                <div className="w-full">
                  <div className="flex items-end justify-between h-24 pt-4 px-2 gap-2">
                    {weeklyCompletionData.map((item, idx) => {
                      const maxVal = 3;
                      const heightPercent = Math.max((item.completed / maxVal) * 100, 8);
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredPoint(item.label)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                        >
                          <span className={`text-[10px] font-mono font-bold ${
                            item.completed > 0 ? 'text-purple-700' : 'text-slate-300'
                          }`}>
                            {item.completed}
                          </span>
                          <div className="w-full max-w-[26px] bg-slate-200/60 rounded-t-md h-full flex items-end overflow-hidden">
                            <div
                              className={`w-full rounded-t-md transition-all duration-300 ${
                                item.isToday
                                  ? 'bg-purple-600 group-hover:bg-purple-700 ring-2 ring-purple-300'
                                  : item.completed > 0
                                  ? 'bg-purple-500/80 group-hover:bg-purple-600'
                                  : 'bg-slate-200'
                              }`}
                              style={{ height: `${item.completed > 0 ? heightPercent : 6}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-semibold mt-0.5 ${
                            item.isToday ? 'text-purple-700 font-bold' : 'text-slate-500'
                          }`}>
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Overall History Area Curve Graph */
                <div className="w-full">
                  <div className="h-24 w-full flex items-end">
                    <svg viewBox={`0 0 ${histWidth} ${histHeight}`} className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="histGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>

                      {/* Guideline */}
                      <line
                        x1={histPaddingX}
                        y1={histPaddingTop}
                        x2={histWidth - histPaddingX}
                        y2={histPaddingTop}
                        stroke="#E2E8F0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />

                      {/* Area Fill */}
                      <path d={histAreaPath} fill="url(#histGradient)" />

                      {/* Stroke Line */}
                      <path
                        d={histLinePath}
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Interactive Data Points */}
                      {histPoints.map((pt, i) => (
                        <g key={i}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="4"
                            fill="#7C3AED"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            className="transition-transform hover:scale-150 cursor-pointer"
                            onMouseEnter={() => setHoveredPoint(`${pt.name}: ${pt.completed} tasks (${pt.cumulative} total)`)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          <text
                            x={pt.x}
                            y={histHeight - 4}
                            textAnchor="middle"
                            className="text-[9px] fill-slate-400 font-semibold select-none"
                          >
                            {pt.short}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {graphMode === 'weekly'
              ? 'Daily completed tasks this sprint cycle'
              : 'Cumulative velocity across completed sprints'}
          </div>
        </div>
      </div>

      {/* 4. MY PROJECTS SECTION (CLEARLY SEPARATED CARD) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            MY PROJECTS
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab?.('projects')}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 cursor-pointer group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 2 Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projectCards.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProject?.(p.id)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer space-y-3"
            >
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {p.name}
              </h4>

              {/* Progress bar + % */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 font-mono shrink-0">
                    {p.progress}%
                  </span>
                </div>
              </div>

              {/* Subtext */}
              <div className="text-xs text-slate-500 font-medium">
                {p.taskCount} tasks · {p.dueCount} due
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. UPCOMING SECTION (CLEARLY SEPARATED CARD) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          UPCOMING
        </h3>

        <div className="space-y-2.5">
          {upcomingItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenTaskModal?.(item.task)}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-purple-50/30 hover:border-purple-200 transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 pr-2">
                <span className="text-xs font-mono font-bold text-slate-500 whitespace-nowrap min-w-[55px]">
                  {item.date}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                  {item.title}
                </span>
              </div>

              <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded border uppercase shrink-0 ${item.badgeClass}`}>
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
