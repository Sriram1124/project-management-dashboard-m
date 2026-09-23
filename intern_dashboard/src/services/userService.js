// Authenticated User Service
export const currentUser = {
  id: 'INT-01',
  name: 'Aarav Patel',
  email: 'aarav.p@internhub.dev',
  name: 'Sriram',
  email: 'sriram@internhub.dev',
  role: 'Intern',
  title: 'Frontend & Mobile Engineering Intern',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  initials: 'AP',
  initials: 'SR',
  cohort: 'Fall 2025 Cohort',
  projectIds: ['PROJ-MAD-2025', 'PROJ-SMS-2025'],
  primaryProjectId: 'PROJ-MAD-2025',
  primaryProjectName: 'Mobile App Development',
  lead: {
    id: 'TL-3',
    name: 'Rohan Singh',
    role: 'Tech Lead',
    email: 'rohan.s@internhub.dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  },
  joinedDate: 'Oct 10, 2025',
  duration: '6 Months (Ends Apr 10, 2026)',
  university: 'National Institute of Technology',
  degree: 'B.Tech in Computer Science & Engineering',
  stats: {
    tasksCompleted: 14,
    hoursLogged: '162h',
    attendanceRate: '92%',
    formsSubmitted: 8
  },
  permissions: {
    can_create_task: true, // Allowed for personal tasks and subtasks
    can_assign_task: false,
    can_create_form: false,
    can_publish_form: false,
    can_send_alert: false,
    can_submit_form: true,
    can_log_work: true,
    can_comment: true,
    can_upload_attachment: true
  }
};

export const userService = {
  getCurrentUser: () => ({ ...currentUser }),
  hasPermission: (permissionKey) => Boolean(currentUser.permissions[permissionKey])
};
