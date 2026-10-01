import { formsService as centralFormsService } from '../../../services/forms.service';

export const formsService = {
  ...centralFormsService,
  
  // Backwards compatibility for InternApp
  getAssignedForms: () => {
    return []; // Handled by loadForms now in InternApp
  },
  
  subscribe: (callback) => {
    // Basic polling or mock implementation to prevent crash
    let active = true;
    const load = async () => {
      try {
        const forms = await centralFormsService.getForms();
        if (active) callback(forms);
      } catch (e) { }
    };
    load();
    return () => { active = false; };
  }
};
