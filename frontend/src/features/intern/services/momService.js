// Minutes of Meeting (MoM) Service - Modular Published Records per Project

const CURRENT_USER_ID = 'INT-01';

let listeners = [];

let publishedMoMs = [
  // --- PROJECT: MOBILE APP DEVELOPMENT (PROJ-MAD-2025) ---
  {
    id: 'MOM-MAD-01',
    project_id: 'PROJ-MAD-2025',
    project_code: 'MAD-2025',
    project: 'Mobile App Development',
    title: 'Sprint 05 Kickoff & Biometric Integration',
    date: 'Dec 18, 2025',
    time: '4:00 PM - 5:00 PM',
    organizer: 'Rohan Singh (Tech Lead)',
    attendees: 5,
    summary: 'Reviewed sprint backlog for biometric authentication, native hardware enclave storage on Android/iOS, and agreed on pairing sessions for mobile native bridge issues.',
    decisions: [
      'Accelerate Mobile LocalAuthentication API integration for Sprint 05',
      'IT ticket raised for Firebase Cloud Messaging service account credentials',
      'Use secure Android Keystore with fallback passcode verification'
    ],
    actionItems: [
      { id: 'act-1', text: 'Aarav Patel to deliver Keychain encryption test matrix', assignee: 'Aarav Patel', due: 'Dec 20', status: 'In Progress', isCurrentUser: true },
      { id: 'act-2', text: 'Rohan Singh to review Mobile API contracts with Backend team', assignee: 'Rohan Singh', due: 'Dec 21', status: 'Pending', isCurrentUser: false },
      { id: 'act-3', text: 'Aarav Patel to write unit tests for storage adapters', assignee: 'Aarav Patel', due: 'Dec 22', status: 'Pending', isCurrentUser: true }
    ]
  },
  {
    id: 'MOM-MAD-02',
    project_id: 'PROJ-MAD-2025',
    project_code: 'MAD-2025',
    project: 'Mobile App Development',
    title: 'Mobile Architecture Spec & Secure Enclave Sync',
    date: 'Dec 11, 2025',
    time: '2:00 PM - 3:00 PM',
    organizer: 'Rohan Singh (Tech Lead)',
    attendees: 4,
    summary: 'Reviewed mobile architecture spec (v2.1), offline caching strategy with SQLite, and background sync worker lifecycle.',
    decisions: [
      'Enforce SQLite encryption with SQLCipher for local client cache',
      'Network retry exponential backoff set to max 3 attempts'
    ],
    actionItems: [
      { id: 'act-7', text: 'Varun Rao to review SQLCipher build dependencies', assignee: 'Varun Rao', due: 'Dec 15', status: 'Completed', isCurrentUser: false },
      { id: 'act-8', text: 'Aarav Patel to prepare LocalAuthentication fallback flow diagram', assignee: 'Aarav Patel', due: 'Dec 14', status: 'Completed', isCurrentUser: true }
    ]
  },

  // --- PROJECT: STUDENT MANAGEMENT SYSTEM (PROJ-SMS-2025) ---
  {
    id: 'MOM-SMS-01',
    project_id: 'PROJ-SMS-2025',
    project_code: 'SMS-2025',
    project: 'Student Management System',
    title: 'Architecture Review: Data Pipelines & Schema',
    date: 'Dec 16, 2025',
    time: '2:30 PM - 3:30 PM',
    organizer: 'Priya Sharma (Tech Lead)',
    project: 'Student Management System',
    attendees: 6,
    summary: 'Evaluated database schema normalization, transaction boundaries for student records, and grade card indexing performance.',
    decisions: [
      'Adopt JSONB for dynamic evaluation form answer stores',
      'Enforce strict foreign key cascade rules on user deletion',
      'Grade card modal to consume cached semester summaries'
    ],
    actionItems: [
      { id: 'act-4', text: 'Rohit Kumar to finalize migration rollback scripts', assignee: 'Rohit Kumar', due: 'Dec 19', status: 'Completed', isCurrentUser: false },
      { id: 'act-5', text: 'Aarav Patel to review Grade Card modal responsiveness', assignee: 'Aarav Patel', due: 'Dec 22', status: 'In Progress', isCurrentUser: true }
    ]
  },
  {
    id: 'MOM-SMS-02',
    project_id: 'PROJ-SMS-2025',
    project_code: 'SMS-2025',
    project: 'Student Management System',
    title: 'Grade Card & Evaluation Modal Review',
    date: 'Dec 09, 2025',
    time: '11:00 AM - 12:00 PM',
    organizer: 'Priya Sharma (Tech Lead)',
    project: 'Student Management System',
    attendees: 5,
    summary: 'Discussed UX and data contracts for grade report cards, semester GPA calculation routines, and PDF export specifications.',
    decisions: [
      'Add print stylesheet optimization for grade card reports',
      'Use server-side calculation for semester GPA to prevent discrepancies'
    ],
    actionItems: [
      { id: 'act-9', text: 'Deepak Joshi to verify GPA aggregation query performance', assignee: 'Deepak Joshi', due: 'Dec 12', status: 'Completed', isCurrentUser: false },
      { id: 'act-10', text: 'Aarav Patel to test mobile viewport layout for student tables', assignee: 'Aarav Patel', due: 'Dec 13', status: 'Completed', isCurrentUser: true }
    ]
  }
];

const notifyListeners = () => {
  listeners.forEach((fn) => fn([...publishedMoMs]));
};

export const momService = {
  subscribe: (fn) => {
    listeners.push(fn);
    fn([...publishedMoMs]);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },

  getPublishedMoMs: () => [...publishedMoMs],

  getMoMsByProject: (projectId) => {
    return publishedMoMs.filter(
      (m) => m.project_id === projectId || m.project?.toLowerCase().includes(projectId.toLowerCase())
    );
  },

  getMoMById: (id) => publishedMoMs.find((m) => m.id === id) || null,

  getActionItemsForUser: (userName = 'Aarav Patel') => {
    const items = [];
    publishedMoMs.forEach((m) => {
      m.actionItems?.forEach((a) => {
        if (a.isCurrentUser || a.assignee?.includes(userName) || a.assignee?.includes('All')) {
          items.push({ 
            ...a, 
            momTitle: m.title, 
            momId: m.id,
            projectId: m.project_id,
            projectCode: m.project_code || 'PROJ'
          });
        }
      });
    });
    return items;
  },

  // Add a new meeting note specifically for a project
  addMeetingNote: ({
    projectId,
    projectCode = 'PROJ',
    projectName = 'Project',
    title,
    date,
    time = '10:00 AM - 11:00 AM',
    organizer = 'Aarav Patel (Intern)',
    summary = '',
    decisions = [],
    actionItems = [],
    attendees = 4
  }) => {
    const codePrefix = projectCode.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'MOM';
    const newMoM = {
      id: `MOM-${codePrefix}-${Date.now().toString().slice(-4)}`,
      project_id: projectId,
      project_code: projectCode,
      project: projectName,
      title: title.trim(),
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: time.trim(),
      organizer: organizer.trim(),
      attendees: Number(attendees) || 4,
      summary: summary.trim(),
      decisions: decisions.filter((d) => d && d.trim().length > 0),
      actionItems: actionItems.map((item, index) => ({
        id: `act-${Date.now()}-${index}`,
        text: item.text?.trim() || 'Action item',
        assignee: item.assignee?.trim() || 'Aarav Patel',
        due: item.due?.trim() || 'Next Sprint',
        status: item.status || 'Pending',
        isCurrentUser: (item.assignee || '').includes('Aarav') || (item.assignee || '').includes('You')
      }))
    };

    publishedMoMs = [newMoM, ...publishedMoMs];
    notifyListeners();
    return newMoM;
  }
};
