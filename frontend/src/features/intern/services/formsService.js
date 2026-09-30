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

let formsData = [];

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
