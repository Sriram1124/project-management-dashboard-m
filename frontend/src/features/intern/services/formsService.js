// Forms Service - Dynamic Question Renderer Support & Submissions
// Supported Question Types:
// SHORT_TEXT | LONG_TEXT | NUMBER | DROPDOWN | MULTIPLE_CHOICE | CHECKBOX | DATE | FILE_UPLOAD | YES_NO
// Submission statuses: PENDING | SUBMITTED
// Overdue is derived: new Date(deadline) < new Date() && status !== 'SUBMITTED'

const CURRENT_USER_ID = 'INT-01';

const now = new Date();
const todayEvening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0).toISOString();
const yesterdayEvening = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
const nextWeekDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

let formsData = [
  {
    id: 'FORM-01',
    title: 'Weekly Progress Report - Week 4',
    description: 'Mandatory sprint progress update covering key git commits, blockers encountered, and targets for the upcoming milestone.',
    category: 'Weekly Report',
    target: 'All Interns',
    deadline: todayEvening, // Due Today 5:00 PM
    assignedTo: ['INT-01', 'INT-02', 'INT-03', 'INT-04'],
    submission_status: 'PENDING',
    submitted_at: null,
    answers: null,
    questions: [
      {
        id: 'q-1',
        type: 'SHORT_TEXT',
        label: 'Primary Feature Branch Name',
        placeholder: 'e.g. feat/biometric-auth-flow',
        required: true,
        helpText: 'The active Git branch you worked on this week'
      },
      {
        id: 'q-2',
        type: 'LONG_TEXT',
        label: 'Summary of Work Completed & Blockers',
        placeholder: 'Detail your key commits, PRs, and any external dependencies holding you up...',
        required: true
      },
      {
        id: 'q-3',
        type: 'NUMBER',
        label: 'Hours Spent on Active Development',
        min: 1,
        max: 60,
        required: true,
        helpText: 'Total hours logged toward sprint tickets'
      },
      {
        id: 'q-4',
        type: 'DROPDOWN',
        label: 'Sprint Health Assessment',
        options: ['Ahead of Schedule', 'On Track', 'Slightly Behind', 'Severely Blocked'],
        required: true
      },
      {
        id: 'q-5',
        type: 'MULTIPLE_CHOICE',
        label: 'Do you require an escalation to your Tech Lead?',
        options: ['No, progressing smoothly', 'Yes, need code review assistance', 'Yes, need requirements clarification'],
        required: true
      },
      {
        id: 'q-6',
        type: 'YES_NO',
        label: 'Have all local tests passed before push?',
        required: true
      },
      {
        id: 'q-7',
        type: 'FILE_UPLOAD',
        label: 'Upload Work Output / Test Coverage Screenshot',
        required: false,
        helpText: 'PNG, JPG, or PDF file up to 5MB'
      }
    ]
  },
  {
    id: 'FORM-02',
    title: 'Sprint 2 Retrospective & Blocker Survey',
    description: 'Retrospective feedback analyzing team communication, tooling bottlenecks, and standup effectiveness.',
    category: 'Retrospective',
    target: 'Mobile App & SMS Cohort',
    deadline: yesterdayEvening, // OVERDUE!
    assignedTo: ['INT-01', 'INT-04'],
    submission_status: 'PENDING',
    submitted_at: null,
    answers: null,
    questions: [
      {
        id: 'q-201',
        type: 'CHECKBOX',
        label: 'What challenges did you face during this sprint? (Select all that apply)',
        options: [
          'Vague user story acceptance criteria',
          'Slow PR code review turnaround',
          'Environment or Docker configuration errors',
          'IT permissions / API key delays'
        ],
        required: true
      },
      {
        id: 'q-202',
        type: 'LONG_TEXT',
        label: 'What one thing should the team stop, start, or continue doing?',
        placeholder: 'Your candid thoughts to improve sprint velocity...',
        required: true
      },
      {
        id: 'q-203',
        type: 'DATE',
        label: 'Proposed Date for 1:1 Sprint Checkpoint',
        required: true
      }
    ]
  },
  {
    id: 'FORM-03',
    title: 'Mid-term Internship Experience Survey',
    description: 'Comprehensive mid-term evaluation covering mentorship quality, team culture, and learning curve satisfaction.',
    category: 'Program Survey',
    target: 'All Cohorts',
    deadline: nextWeekDate,
    assignedTo: ['INT-01'],
    submission_status: 'SUBMITTED',
    submitted_at: '2025-11-14T14:20:00Z',
    answers: {
      'q-301': '5',
      'q-302': 'Exceptional mentorship from Rohan Singh. The code reviews are very educational.'
    },
    questions: [
      {
        id: 'q-301',
        type: 'NUMBER',
        label: 'Rate your overall learning growth from 1 to 5',
        min: 1,
        max: 5,
        required: true
      },
      {
        id: 'q-302',
        type: 'LONG_TEXT',
        label: 'Feedback on technical mentorship & team support',
        required: true
      }
    ]
  }
];

let listeners = [];
function notifyListeners() {
  listeners.forEach((listener) => listener([...formsData]));
}

export const formsService = {
  subscribe: (listener) => {
    listeners.push(listener);
    listener([...formsData]);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  getAssignedForms: (userId = CURRENT_USER_ID) => {
    return formsData.filter((f) => f.assignedTo?.includes(userId));
  },

  getFormById: (id) => {
    return formsData.find((f) => f.id === id) || null;
  },

  isOverdue: (form) => {
    if (form.submission_status === 'SUBMITTED' || !form.deadline) return false;
    return new Date(form.deadline) < new Date();
  },

  isDueSoon: (form) => {
    if (form.submission_status === 'SUBMITTED' || !form.deadline) return false;
    const diffHours = (new Date(form.deadline) - new Date()) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 24;
  },

  hasSubmitted: (formId, userId = CURRENT_USER_ID) => {
    const f = formsData.find((item) => item.id === formId);
    return f?.submission_status === 'SUBMITTED';
  },

  submitForm: (formId, answers) => {
    const form = formsData.find((f) => f.id === formId);
    if (!form) throw new Error('Form not found');
    if (form.submission_status === 'SUBMITTED') {
      throw new Error('Duplicate submission prevented. You have already submitted this form.');
    }

    formsData = formsData.map((f) => {
      if (f.id === formId) {
        return {
          ...f,
          submission_status: 'SUBMITTED',
          submitted_at: new Date().toISOString(),
          answers
        };
      }
      return f;
    });

    notifyListeners();
    return true;
  }
};
