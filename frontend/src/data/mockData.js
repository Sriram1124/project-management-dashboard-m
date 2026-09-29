export const mockDashboardData = {
  user: {
    name: "Sarah Mitchell",
    role: "Program Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    dateDisplay: "Thu, 19 Dec 2025",
  },
  metrics: {
    totalInterns: {
      value: 48,
      change: "+12% from last month",
      trend: "up"
    },
    activeProjects: {
      value: 8,
      subtitle: "4 core tracks active"
    },
    tasksCompleted: {
      value: 156,
      change: "+18% from last month",
      trend: "up"
    },
    overdueTasks: {
      value: 24,
      subtitle: "Requires follow-up",
      isWarning: true
    }
  },
  subMetrics: [
    { id: 'missed-deadlines', value: 12, label: 'Missed Deadlines', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: 'Clock' },
    { id: 'missed-attendance', value: 7, label: 'Missed Attendance', color: 'text-rose-600 bg-rose-50 border-rose-200', icon: 'Calendar' },
    { id: 'active-leads', value: 6, label: 'Active Tech Leads', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: 'ShieldCheck' },
    { id: 'blocked-tasks', value: 9, label: 'Blocked Tasks', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: 'AlertTriangle' },
    { id: 'pending-forms', value: 8, label: 'Pending Forms', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: 'FileText' }
  ],
  attentionExceptions: [
    {
      id: 'overdue-interns',
      title: '4 interns have multiple overdue tasks',
      description: 'Rohan, Vikram, and 2 others are lagging behind schedule.',
      icon: 'AlertCircle',
      theme: 'rose',
      affectedUsers: ['Rohan Verma', 'Vikram Sen', 'Ananya Roy', 'Deepak Joshi'],
      actionLabel: 'View Interns'
    },
    {
      id: 'blocked-tasks',
      title: '3 tasks are blocked',
      description: 'Awaiting external API access keys from IT department.',
      icon: 'Lock',
      theme: 'amber',
      affectedTasks: ['Auth OAuth2 Setup', 'Payment Gateway Stub', 'Elasticsearch Cluster Sync'],
      actionLabel: 'Escalate to IT'
    },
    {
      id: 'forms-overdue',
      title: '6 forms are overdue',
      description: 'Weekly feedback surveys are missing from Section A1.',
      icon: 'FileSpreadsheet',
      theme: 'rose',
      affectedUsers: ['Section A1: 6 Respondents'],
      actionLabel: 'Remind Section'
    },
    {
      id: 'approaching-deadlines',
      title: 'Project Alpha has approaching deadlines',
      description: 'Sprint 2 ends in 48 hours; 3 critical modules remain open.',
      icon: 'Clock',
      theme: 'amber',
      actionLabel: 'Inspect Sprint'
    },
    {
      id: 'pending-work-a1',
      title: 'Section A1 has significant pending work',
      description: '14 total backlog items; highest density across sections.',
      icon: 'Layers',
      theme: 'purple',
      actionLabel: 'Balance Load'
    },
    {
      id: 'priya-bottleneck',
      title: 'Tech Lead Priya has 14 tasks awaiting review',
      description: 'Approval bottlenecks identified; review queue is growing.',
      icon: 'UserCheck',
      theme: 'purple',
      actionLabel: 'Delegate Review'
    }
  ],
  recipientPreview: {
    pending: 8,
    overdue: 3,
    total: 11
  },
  projectHealth: [
    {
      id: 'sms',
      name: 'Student Management System',
      lead: 'Priya Sharma',
      section: 'A1',
      internsCount: 12,
      progress: 80,
      status: 'On Track',
      statusType: 'success'
    },
    {
      id: 'ai-platform',
      name: 'AI Research Platform',
      lead: 'Vikram Joshi',
      section: 'B2',
      internsCount: 8,
      progress: 65,
      status: 'At Risk',
      statusType: 'warning'
    },
    {
      id: 'mobile-app',
      name: 'Mobile App Development',
      lead: 'Rohan Singh',
      section: 'C1',
      internsCount: 10,
      progress: 44,
      status: 'Behind',
      statusType: 'danger'
    }
  ],
  upcomingDeadlines: [
    {
      group: 'TODAY',
      dotColor: 'bg-rose-500',
      items: [
        {
          id: 'd1',
          title: 'API Integration testing',
          subtitle: 'Mobile App • Assignee: Aarav Patel',
          tag: 'High',
          tagType: 'danger'
        },
        {
          id: 'd2',
          title: 'Final UI specifications',
          subtitle: 'Website Redesign • Assignee: Priya Sharma',
          tag: 'High',
          tagType: 'danger'
        }
      ]
    },
    {
      group: 'TOMORROW',
      dotColor: 'bg-amber-500',
      items: [
        {
          id: 'd3',
          title: 'Database migration scripts',
          subtitle: 'Student System • Assignee: Rohit Kumar',
          tag: 'Medium',
          tagType: 'warning'
        }
      ]
    },
    {
      group: 'THIS WEEK',
      dotColor: 'bg-purple-600',
      items: [
        {
          id: 'd4',
          title: 'Model training & validation',
          subtitle: 'AI Platform • Assignee: Sneha Reddy',
          tag: 'Low',
          tagType: 'default'
        },
        {
          id: 'd5',
          title: 'Submit Weekly Feedback Form',
          subtitle: 'All Tracks • Target: All Sections',
          tag: 'Required',
          tagType: 'purple'
        }
      ]
    },
    {
      group: 'NEXT WEEK',
      dotColor: 'bg-slate-400',
      items: [
        {
          id: 'd6',
          title: 'Deploy staging build',
          subtitle: 'Mobile App • Assignee: Vikram Joshi',
          tag: 'Medium',
          tagType: 'warning'
        }
      ]
    }
  ],
  taskStatus: {
    total: 312,
    segments: [
      { label: 'Completed', count: 156, color: '#10B981', percentage: 50 },
      { label: 'In Progress', count: 72, color: '#8B5CF6', percentage: 23 },
      { label: 'Pending', count: 48, color: '#F59E0B', percentage: 15 },
      { label: 'Overdue', count: 24, color: '#EF4444', percentage: 8 }
    ]
  },
  attendance: {
    percentage: 85,
    present: 41,
    absent: 3,
    late: 4
  },
  recentActivity: [
    {
      id: 'a1',
      title: 'Task assigned to Aarav Patel',
      time: '2 hours ago',
      icon: 'UserPlus',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 'a2',
      title: 'Deadline changed for Project Alpha',
      time: '3 hours ago',
      icon: 'Clock',
      color: 'text-amber-600 bg-amber-50'
    },
    {
      id: 'a3',
      title: 'Task completed: API Integrations',
      time: '5 hours ago',
      icon: 'CheckCircle2',
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'a4',
      title: 'Subtask created under Epic-102',
      time: '8 hours ago',
      icon: 'FolderPlus',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 'a5',
      title: 'Form submitted by Section A1',
      time: '1 day ago',
      icon: 'FileText',
      color: 'text-rose-600 bg-rose-50'
    },
    {
      id: 'a6',
      title: 'MoM published for Sprint Retrospective',
      time: '1 day ago',
      icon: 'MessageSquare',
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      id: 'a7',
      title: 'Alert sent to all pending timesheets',
      time: '2 days ago',
      icon: 'Bell',
      color: 'text-purple-600 bg-purple-50'
    }
  ]
};

// Full interns catalog (48 interns) for the Interns Directory view & search
export const mockInterns = [
  { id: 'INT-01', name: 'Aarav Patel', email: 'aarav.p@internhub.dev', project: 'Mobile App Development', section: 'C1', lead: 'Rohan Singh', tasksTotal: 8, tasksDone: 6, overdue: 1, attendance: '92%', status: 'Active' },
  { id: 'INT-02', name: 'Sneha Reddy', email: 'sneha.r@internhub.dev', project: 'AI Research Platform', section: 'B2', lead: 'Vikram Joshi', tasksTotal: 9, tasksDone: 7, overdue: 0, attendance: '96%', status: 'Active' },
  { id: 'INT-03', name: 'Rohit Kumar', email: 'rohit.k@internhub.dev', project: 'Student Management System', section: 'A1', lead: 'Priya Sharma', tasksTotal: 7, tasksDone: 4, overdue: 0, attendance: '88%', status: 'Active' },
  { id: 'INT-04', name: 'Rohan Verma', email: 'rohan.v@internhub.dev', project: 'Mobile App Development', section: 'C1', lead: 'Rohan Singh', tasksTotal: 6, tasksDone: 1, overdue: 3, attendance: '72%', status: 'Lagging' },
  { id: 'INT-05', name: 'Ananya Roy', email: 'ananya.r@internhub.dev', project: 'AI Research Platform', section: 'B2', lead: 'Vikram Joshi', tasksTotal: 8, tasksDone: 3, overdue: 2, attendance: '80%', status: 'Lagging' },
  { id: 'INT-06', name: 'Deepak Joshi', email: 'deepak.j@internhub.dev', project: 'Student Management System', section: 'A1', lead: 'Priya Sharma', tasksTotal: 7, tasksDone: 2, overdue: 2, attendance: '75%', status: 'Lagging' },
  { id: 'INT-07', name: 'Kavya Nair', email: 'kavya.n@internhub.dev', project: 'Cloud DevOps Pipeline', section: 'D1', lead: 'Ananya Sen', tasksTotal: 10, tasksDone: 9, overdue: 0, attendance: '100%', status: 'Active' },
  { id: 'INT-08', name: 'Manish Gupta', email: 'manish.g@internhub.dev', project: 'FinTech Analytics', section: 'E2', lead: 'Kabir Mehta', tasksTotal: 5, tasksDone: 3, overdue: 1, attendance: '85%', status: 'Active' },
  { id: 'INT-09', name: 'Pooja Hegde', email: 'pooja.h@internhub.dev', project: 'Healthcare IoT Suite', section: 'F1', lead: 'Devika Nair', tasksTotal: 6, tasksDone: 2, overdue: 1, attendance: '78%', status: 'Active' },
  { id: 'INT-10', name: 'Aditya Sharma', email: 'aditya.s@internhub.dev', project: 'Student Management System', section: 'A1', lead: 'Priya Sharma', tasksTotal: 8, tasksDone: 7, overdue: 0, attendance: '94%', status: 'Active' },
  { id: 'INT-11', name: 'Meera Iyer', email: 'meera.i@internhub.dev', project: 'AI Research Platform', section: 'B2', lead: 'Vikram Joshi', tasksTotal: 6, tasksDone: 5, overdue: 0, attendance: '90%', status: 'Active' },
  { id: 'INT-12', name: 'Varun Rao', email: 'varun.r@internhub.dev', project: 'Mobile App Development', section: 'C1', lead: 'Rohan Singh', tasksTotal: 7, tasksDone: 5, overdue: 1, attendance: '86%', status: 'Active' },
  ...Array.from({ length: 36 }, (_, i) => ({
    id: `INT-${i + 13}`,
    name: `Intern Candidate ${i + 13}`,
    email: `intern${i + 13}@internhub.dev`,
    project: ['Student Management System', 'AI Research Platform', 'Mobile App Development', 'Cloud DevOps Pipeline'][i % 4],
    section: ['A1', 'B2', 'C1', 'D1'][i % 4],
    lead: ['Priya Sharma', 'Vikram Joshi', 'Rohan Singh', 'Ananya Sen'][i % 4],
    tasksTotal: 6 + (i % 4),
    tasksDone: 4 + (i % 3),
    overdue: i % 7 === 0 ? 1 : 0,
    attendance: `${80 + (i % 20)}%`,
    status: i % 9 === 0 ? 'Lagging' : 'Active'
  }))
];

// All 8 Projects
export const mockProjects = [
  { id: 'P-1', name: 'Student Management System', lead: 'Priya Sharma', section: 'A1', internsCount: 12, progress: 80, status: 'On Track', statusType: 'success', description: 'Central student records, grading portal and admission workflows.' },
  { id: 'P-2', name: 'AI Research Platform', lead: 'Vikram Joshi', section: 'B2', internsCount: 8, progress: 65, status: 'At Risk', statusType: 'warning', description: 'LLM fine-tuning, benchmark evaluation pipelines, and research documentation.' },
  { id: 'P-3', name: 'Mobile App Development', lead: 'Rohan Singh', section: 'C1', internsCount: 10, progress: 44, status: 'Behind', statusType: 'danger', description: 'Cross-platform mobile application with offline sync and push alerts.' },
  { id: 'P-4', name: 'Cloud DevOps Pipeline', lead: 'Ananya Sen', section: 'D1', internsCount: 6, progress: 92, status: 'On Track', statusType: 'success', description: 'CI/CD automation, Kubernetes deployment templates, and Terraform scripts.' },
  { id: 'P-5', name: 'FinTech Analytics Engine', lead: 'Kabir Mehta', section: 'E2', internsCount: 5, progress: 55, status: 'At Risk', statusType: 'warning', description: 'High-frequency transaction streaming and fraud detection models.' },
  { id: 'P-6', name: 'Healthcare IoT Suite', lead: 'Devika Nair', section: 'F1', internsCount: 7, progress: 38, status: 'Behind', statusType: 'danger', description: 'Real-time vital monitors bridge with FHIR-compliant backend service.' },
  { id: 'P-7', name: 'Internal Developer Tools', lead: 'Priya Sharma', section: 'A2', internsCount: 4, progress: 75, status: 'On Track', statusType: 'success', description: 'CLI utilities, code generators, and telemetry dashboard.' },
  { id: 'P-8', name: 'Website Redesign & Brand Hub', lead: 'Rohan Singh', section: 'C2', internsCount: 6, progress: 84, status: 'On Track', statusType: 'success', description: 'Design system tokens, responsive landing pages, and component docs.' },
];

// Tech Leads list
export const mockTechLeads = [
  { id: 'TL-1', name: 'Priya Sharma', email: 'priya.s@internhub.dev', assignedSections: ['A1', 'A2'], projects: ['Student Management System', 'Internal Developer Tools'], internsCount: 16, pendingReviews: 14, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 'TL-2', name: 'Vikram Joshi', email: 'vikram.j@internhub.dev', assignedSections: ['B2'], projects: ['AI Research Platform'], internsCount: 8, pendingReviews: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 'TL-3', name: 'Rohan Singh', email: 'rohan.s@internhub.dev', assignedSections: ['C1', 'C2'], projects: ['Mobile App Development', 'Website Redesign & Brand Hub'], internsCount: 16, pendingReviews: 8, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { id: 'TL-4', name: 'Ananya Sen', email: 'ananya.s@internhub.dev', assignedSections: ['D1'], projects: ['Cloud DevOps Pipeline'], internsCount: 6, pendingReviews: 2, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { id: 'TL-5', name: 'Kabir Mehta', email: 'kabir.m@internhub.dev', assignedSections: ['E2'], projects: ['FinTech Analytics Engine'], internsCount: 5, pendingReviews: 4, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80' },
  { id: 'TL-6', name: 'Devika Nair', email: 'devika.n@internhub.dev', assignedSections: ['F1'], projects: ['Healthcare IoT Suite'], internsCount: 7, pendingReviews: 6, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }
];

// Tasks list
export const mockTasks = [
  { id: 'TSK-101', title: 'API Integration testing', project: 'Mobile App Development', section: 'C1', assignee: 'Aarav Patel', lead: 'Rohan Singh', priority: 'High', status: 'In Progress', due: 'Today', progress: 70 },
  { id: 'TSK-102', title: 'Final UI specifications', project: 'Website Redesign', section: 'C2', assignee: 'Priya Sharma', lead: 'Rohan Singh', priority: 'High', status: 'In Review', due: 'Today', progress: 95 },
  { id: 'TSK-103', title: 'Database migration scripts', project: 'Student Management System', section: 'A1', assignee: 'Rohit Kumar', lead: 'Priya Sharma', priority: 'Medium', status: 'To Do', due: 'Tomorrow', progress: 20 },
  { id: 'TSK-104', title: 'Model training & validation', project: 'AI Research Platform', section: 'B2', assignee: 'Sneha Reddy', lead: 'Vikram Joshi', priority: 'Low', status: 'In Progress', due: 'This Week', progress: 45 },
  { id: 'TSK-105', title: 'Deploy staging build', project: 'Mobile App Development', section: 'C1', assignee: 'Vikram Joshi', lead: 'Rohan Singh', priority: 'Medium', status: 'To Do', due: 'Next Week', progress: 10 },
  { id: 'TSK-106', title: 'Auth OAuth2 Setup', project: 'Student Management System', section: 'A1', assignee: 'Rohan Verma', lead: 'Priya Sharma', priority: 'High', status: 'Blocked', due: 'Overdue (2d)', progress: 15 },
  { id: 'TSK-107', title: 'Payment Gateway Stub', project: 'FinTech Analytics Engine', section: 'E2', assignee: 'Manish Gupta', lead: 'Kabir Mehta', priority: 'High', status: 'Blocked', due: 'Overdue (3d)', progress: 30 },
  { id: 'TSK-108', title: 'Elasticsearch Cluster Sync', project: 'Cloud DevOps Pipeline', section: 'D1', assignee: 'Kavya Nair', lead: 'Ananya Sen', priority: 'Medium', status: 'Blocked', due: 'Overdue (1d)', progress: 50 },
  { id: 'TSK-109', title: 'GraphQL schema federation', project: 'Student Management System', section: 'A1', assignee: 'Aditya Sharma', lead: 'Priya Sharma', priority: 'Medium', status: 'Completed', due: 'Yesterday', progress: 100 },
  { id: 'TSK-110', title: 'Weekly progress report consolidation', project: 'All Tracks', section: 'All', assignee: 'Sarah Mitchell', lead: 'Manager', priority: 'High', status: 'Completed', due: 'Yesterday', progress: 100 }
];

// Forms tracking
export const mockForms = [
  { id: 'FORM-01', title: 'Weekly Progress Report - Week 4', target: 'All Sections', assigned: 48, submitted: 37, pending: 8, overdue: 3, deadline: 'Fri, 20 Dec 2025' },
  { id: 'FORM-02', title: 'Sprint 2 Retrospective Feedback', target: 'Section A1 & B2', assigned: 20, submitted: 14, pending: 4, overdue: 2, deadline: 'Thu, 19 Dec 2025' },
  { id: 'FORM-03', title: 'Mid-term Internship Survey', target: 'All Sections', assigned: 48, submitted: 45, pending: 3, overdue: 0, deadline: '28 Dec 2025' },
  { id: 'FORM-04', title: 'Device & Cloud Resource Requisition', target: 'New Cohort', assigned: 15, submitted: 15, pending: 0, overdue: 0, deadline: 'Completed' }
];

// MoM (Minutes of Meeting)
export const mockMoMs = [
  { id: 'MOM-01', title: 'Sprint 2 Retrospective & Blocker Review', date: '18 Dec 2025', time: '4:00 PM - 5:00 PM', organizer: 'Sarah Mitchell', project: 'All Tracks', attendees: 18, keyDecisions: ['Accelerate Mobile API completion by Dec 22', 'IT ticket raised for OAuth2 keys', 'Pair programming assigned for Section C1'] },
  { id: 'MOM-02', title: 'Architecture Review: Data Pipelines', date: '16 Dec 2025', time: '2:30 PM - 3:30 PM', organizer: 'Vikram Joshi', project: 'AI Research Platform', attendees: 9, keyDecisions: ['Adopt Parquet format for vector datasets', 'Weekly checkpoints on Friday mornings'] },
  { id: 'MOM-03', title: 'Tech Lead Sync & Evaluation Criteria', date: '14 Dec 2025', time: '11:00 AM - 12:00 PM', organizer: 'Sarah Mitchell', project: 'General Operations', attendees: 7, keyDecisions: ['Standardized code review turnaround to under 24 hours', 'Section A1 workload redistribution'] }
];

