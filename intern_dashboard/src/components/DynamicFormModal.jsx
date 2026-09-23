import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Send, 
  Clock, 
  Calendar, 
  UploadCloud, 
  AlertCircle,
  FileCheck,
  Check
} from 'lucide-react';
import { formsService } from '../services/formsService';

export default function DynamicFormModal({
  form,
  isOpen,
  onClose,
  onSubmitSuccess,
  onToast
}) {
  if (!isOpen || !form) return null;

  const isAlreadySubmitted = form.submission_status === 'SUBMITTED';
  const isOverdue = formsService.isOverdue(form);

  // Initialize answer state from existing answers or defaults
  const [answers, setAnswers] = useState(() => {
    if (form.answers) return { ...form.answers };
    const initial = {};
    form.questions?.forEach((q) => {
      if (q.type === 'CHECKBOX') {
        initial[q.id] = [];
      } else if (q.type === 'YES_NO') {
        initial[q.id] = 'Yes';
      } else {
        initial[q.id] = '';
      }
    });
    return initial;
  });

  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxToggle = (questionId, option) => {
    setAnswers((prev) => {
      const currentList = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const exists = currentList.includes(option);
      const nextList = exists
        ? currentList.filter((item) => item !== option)
        : [...currentList, option];
      return { ...prev, [questionId]: nextList };
    });
  };

  const handleFileChange = (questionId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [questionId]: file.name }));
      handleInputChange(questionId, file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isAlreadySubmitted) {
      setErrorMsg('This form has already been submitted.');
      return;
    }

    // Validate required questions
    for (const q of form.questions || []) {
      if (q.required) {
        const val = answers[q.id];
        if (
          val === undefined ||
          val === '' ||
          (Array.isArray(val) && val.length === 0)
        ) {
          setErrorMsg(`Please answer required question: "${q.label}"`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        formsService.submitForm(form.id, answers);
        setIsSubmitting(false);
        onToast?.(`Form "${form.title}" submitted successfully!`);
        onSubmitSuccess?.(form.id);
        onClose();
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg(err.message || 'Error submitting form');
      }
    }, 500);
  };

  // Render question field dynamically based on type
  const renderField = (q) => {
    const value = answers[q.id];

    switch (q.type) {
      case 'SHORT_TEXT':
        return (
          <input
            type="text"
            disabled={isAlreadySubmitted}
            placeholder={q.placeholder || 'Your response...'}
            value={value || ''}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-600 disabled:bg-slate-50 disabled:text-slate-500"
          />
        );

      case 'LONG_TEXT':
        return (
          <textarea
            rows={3}
            disabled={isAlreadySubmitted}
            placeholder={q.placeholder || 'Type your detailed answer here...'}
            value={value || ''}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-600 disabled:bg-slate-50 disabled:text-slate-500 resize-none"
          />
        );

      case 'NUMBER':
        return (
          <input
            type="number"
            disabled={isAlreadySubmitted}
            min={q.min}
            max={q.max}
            placeholder={q.min !== undefined ? `${q.min} - ${q.max}` : '0'}
            value={value || ''}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
            className="w-48 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-600 disabled:bg-slate-50 disabled:text-slate-500"
          />
        );

      case 'DROPDOWN':
        return (
          <select
            disabled={isAlreadySubmitted}
            value={value || ''}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-600 disabled:bg-slate-50 disabled:text-slate-500"
          >
            <option value="">-- Select an option --</option>
            {q.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-2 mt-1">
            {q.options?.map((opt) => {
              const isChecked = value === opt;
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                    isChecked
                      ? 'bg-purple-50/70 border-purple-300 text-purple-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  } ${isAlreadySubmitted ? 'pointer-events-none opacity-90' : ''}`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    disabled={isAlreadySubmitted}
                    checked={isChecked}
                    onChange={() => handleInputChange(q.id, opt)}
                    className="w-3.5 h-3.5 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        );

      case 'CHECKBOX':
        const checkedList = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2 mt-1">
            {q.options?.map((opt) => {
              const isChecked = checkedList.includes(opt);
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                    isChecked
                      ? 'bg-purple-50/70 border-purple-300 text-purple-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  } ${isAlreadySubmitted ? 'pointer-events-none opacity-90' : ''}`}
                >
                  <input
                    type="checkbox"
                    disabled={isAlreadySubmitted}
                    checked={isChecked}
                    onChange={() => handleCheckboxToggle(q.id, opt)}
                    className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        );

      case 'DATE':
        return (
          <div className="flex items-center gap-2">
            <input
              type="date"
              disabled={isAlreadySubmitted}
              value={value || ''}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-600 disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
        );

      case 'YES_NO':
        return (
          <div className="flex items-center gap-3 mt-1">
            {['Yes', 'No'].map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={isAlreadySubmitted}
                  onClick={() => handleInputChange(q.id, opt)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    isSelected
                      ? opt === 'Yes'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  } ${isAlreadySubmitted ? 'pointer-events-none opacity-80' : ''}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );

      case 'FILE_UPLOAD':
        return (
          <div className="mt-1">
            {isAlreadySubmitted ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 text-xs">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Uploaded Attachment: {value || 'Document Attached'}</span>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-purple-50/20 transition-all">
                <UploadCloud className="w-6 h-6 text-purple-600 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {files[q.id] || 'Click to select file or drag here'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  PDF, DOCX, PNG, JPG up to 5MB
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(q.id, e)}
                />
              </label>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
          />
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                {form.category || 'Form'}
              </span>
              {isAlreadySubmitted ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  <Check className="w-3 h-3" /> Submitted
                </span>
              ) : isOverdue ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  <AlertCircle className="w-3 h-3" /> Overdue
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Pending Submission
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
              {form.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Deadline: {new Date(form.deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {form.description && (
            <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100 text-purple-900 leading-relaxed">
              {form.description}
            </div>
          )}

          {isAlreadySubmitted && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Submission recorded on {new Date(form.submitted_at).toLocaleString()}. You cannot submit this form again.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Dynamic Questions List */}
          <div className="space-y-4 divide-y divide-slate-100">
            {form.questions?.map((q, idx) => (
              <div key={q.id} className={idx > 0 ? 'pt-4' : ''}>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {idx + 1}. {q.label}
                  {q.required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                {q.helpText && (
                  <p className="text-[11px] text-slate-400 mb-1.5">{q.helpText}</p>
                )}
                <div className="mt-1.5">{renderField(q)}</div>
              </div>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isAlreadySubmitted ? 'Close' : 'Cancel'}
            </button>

            {!isAlreadySubmitted && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Form'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
