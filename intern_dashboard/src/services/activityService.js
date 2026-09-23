// Activity Service - Relevant Activity Feed

const activityRecords = [
  {
    id: 'act-1',
    timestamp: 'Today, 11:20 AM',
    user: 'Rohan Singh',
    userRole: 'Tech Lead',
    action: 'Task status changed to In Review',
    target: 'Build Grade Card responsive modal component',
    project: 'Student Management System',
    type: 'status_change',
    badge: 'Review'
  },
  {
    id: 'act-2',
    timestamp: 'Today, 10:45 AM',
    user: 'Rohan Singh',
    userRole: 'Tech Lead',
    action: 'Assigned you and Rohan Verma',
    target: 'Implement biometric auth flow',
    project: 'Mobile App Development',
    type: 'assignment',
    badge: 'Assignment'
  },
  {
    id: 'act-3',
    timestamp: 'Today, 09:15 AM',
    user: 'Sarah Mitchell',
    userRole: 'Program Manager',
    action: 'Published form to cohort',
    target: 'Weekly Progress Report - Week 4',
    project: 'All Tracks',
    type: 'form',
    badge: 'Form'
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday, 4:30 PM',
    user: 'Aarav Patel',
    userRole: 'Intern (You)',
    action: 'Uploaded attachment',
    target: 'crash_log_android_14.txt to Bug WI-104',
    project: 'Mobile App Development',
    type: 'upload',
    badge: 'Attachment'
  },
  {
    id: 'act-5',
    timestamp: 'Yesterday, 2:15 PM',
    user: 'Sarah Mitchell',
    userRole: 'Program Manager',
    action: 'Published MoM',
    target: 'Sprint 2 Retrospective & Blocker Review',
    project: 'All Tracks',
    type: 'mom',
    badge: 'MoM'
  },
  {
    id: 'act-6',
    timestamp: '2 days ago',
    user: 'Aarav Patel',
    userRole: 'Intern (You)',
    action: 'Completed task',
    target: 'Update README with setup instructions',
    project: 'Mobile App Development',
    type: 'complete',
    badge: 'Completed'
  }
];

export const activityService = {
  getActivityFeed: () => [...activityRecords]
};
