// Minutes of Meeting (MoM) Service - Modular Published Records per Project

const CURRENT_USER_ID = 'INT-01';

let listeners = [];

let publishedMoMs = [];

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

  getActionItemsForUser: (userName = '') => {
    const items = [];
    publishedMoMs.forEach((m) => {
      m.actionItems?.forEach((a) => {
        if (a.isCurrentUser || (userName && a.assignee?.includes(userName)) || a.assignee?.includes('All')) {
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
    organizer = 'Intern',
    summary = '',
    decisions = [],
    actionItems = [],
    attendees = 1
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
      attendees: Number(attendees) || 1,
      summary: summary.trim(),
      decisions: decisions.filter((d) => d && d.trim().length > 0),
      actionItems: actionItems.map((item, index) => ({
        id: `act-${Date.now()}-${index}`,
        text: item.text?.trim() || 'Action item',
        assignee: item.assignee?.trim() || 'Intern',
        due: item.due?.trim() || 'Next Sprint',
        status: item.status || 'Pending',
        isCurrentUser: true
      }))
    };

    publishedMoMs = [newMoM, ...publishedMoMs];
    notifyListeners();
    return newMoM;
  }
};
