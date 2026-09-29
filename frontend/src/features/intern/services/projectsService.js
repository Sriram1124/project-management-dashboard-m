// Projects Service
// Returns projects where the logged-in intern is an active member
// Supported statuses: PLANNED | ACTIVE | COMPLETED | ARCHIVED

const CURRENT_USER_ID = 'INT-01';

const projects = [
  {
    id: 'PROJ-MAD-2025',
    name: 'Mobile App Development',
    code: 'MAD-2025',
    description: 'Cross-platform React Native client with biometric authentication, background sync, and offline persistence.',
    status: 'ACTIVE', // PLANNED | ACTIVE | COMPLETED | ARCHIVED
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    startDate: 'Oct 10, 2025',
    endDate: 'Jan 15, 2026',
    progress: 74,
    lead: {
      id: 'TL-3',
      name: 'Rohan Singh',
      role: 'Project Tech Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    members: [
      { id: 'TL-3', name: 'Rohan Singh', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
      { id: 'INT-01', name: 'Aarav Patel', role: 'Intern (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
      { id: 'INT-04', name: 'Rohan Verma', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
      { id: 'INT-12', name: 'Varun Rao', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
    ],
    documents: [
      { id: 'doc-1', name: 'Mobile_Architecture_Spec.pdf', type: 'pdf', size: '3.4 MB', updated: 'Nov 12, 2025' },
      { id: 'doc-2', name: 'API_Contract_v2.json', type: 'code', size: '140 KB', updated: 'Nov 15, 2025' },
      { id: 'doc-3', name: 'Sprint_05_Retro_Minutes.pdf', type: 'pdf', size: '890 KB', updated: 'Nov 18, 2025' }
    ],
    assignedWork: {
      total: 6,
      completed: 3,
      inProgress: 2,
      blocked: 1
    },
    recentActivity: [
      { id: 'act-1', text: 'Rohan Singh merged PR #42 (Setup documentation)', time: 'Yesterday' },
      { id: 'act-2', text: 'Aarav Patel opened PR #44 for Biometric Keychain', time: '2 days ago' },
      { id: 'act-3', text: 'Sprint 05 velocity reached 82% of target', time: '3 days ago' }
    ]
  },
  {
    id: 'PROJ-SMS-2025',
    name: 'Student Management System',
    code: 'SMS-2025',
    description: 'Comprehensive student record tracking, project execution, timesheets and performance management dashboard.',
    status: 'ACTIVE',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    startDate: 'Dec 1, 2025',
    endDate: 'Mar 31, 2026',
    progress: 82,
    lead: {
      id: 'TL-1',
      name: 'Priya Sharma',
      role: 'Project Tech Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    members: [
      { id: 'TL-1', name: 'Priya Sharma', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { id: 'INT-01', name: 'Aarav Patel', role: 'Collaborator (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
      { id: 'INT-03', name: 'Rohit Kumar', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
      { id: 'INT-06', name: 'Deepak Joshi', role: 'Intern', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
    ],
    documents: [
      { id: 'doc-4', name: 'Project_Requirements.pdf', type: 'pdf', size: '4.2 MB', updated: 'Dec 01, 2025' },
      { id: 'doc-5', name: 'Database_Schema.xlsx', type: 'xlsx', size: '640 KB', updated: 'Dec 08, 2025' }
    ],
    assignedWork: {
      total: 2,
      completed: 1,
      inProgress: 1,
      blocked: 0
    },
    recentActivity: [
      { id: 'act-4', text: 'Priya Sharma approved Grade Card component spec', time: '1 day ago' },
      { id: 'act-5', text: 'Database migration scripts validated', time: '3 days ago' }
    ]
  }
];

export const projectsService = {
  // Returns only projects the intern belongs to
  getMyProjects: (userId = CURRENT_USER_ID) => {
    return projects.filter((p) => p.members.some((m) => m.id === userId));
  },

  getProjectById: (projectId) => {
    return projects.find((p) => p.id === projectId) || null;
  }
};
