import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { formsService } from '../../services/forms.service';

export default function CreateFormModal({ form, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    target_roles: ['INTERN']
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (form) {
      setFormData({
        title: form.title || '',
        description: form.description || '',
        deadline: form.deadline ? new Date(form.deadline).toISOString().slice(0, 16) : '',
        target_roles: form.target_roles || ['INTERN']
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        target_roles: ['INTERN']
      });
    }
  }, [form]);

  const isEditMode = Boolean(form && form.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return setError('Title is required');
    
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
      };

      if (isEditMode) {
        await formsService.updateForm(form.id, payload);
      } else {
        await formsService.createForm(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || (isEditMode ? 'Failed to update form' : 'Failed to create form'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            {isEditMode ? 'Update Form' : 'Create New Form'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Form Title *</label>
            <input
              autoFocus
              type="text"
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              placeholder="e.g. Weekly Cohort Evaluation"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 min-h-[80px]"
              placeholder="Brief instructions for respondents..."
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Submission Deadline</label>
            <input
              type="datetime-local"
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              value={formData.deadline}
              onChange={e => setFormData(p => ({ ...p, deadline: e.target.value }))}
            />
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading 
                ? (isEditMode ? 'Updating...' : 'Creating...') 
                : (isEditMode ? 'Update Form' : 'Create Form')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
