import React, { useState } from 'react';
import { 
  Hash, 
  Plus, 
  ArrowRight, 
  FileText, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import PostFormModal from '../channels/PostFormModal';
import FillFormModal from '../channels/FillFormModal';
import ViewSubmissionsModal from '../channels/ViewSubmissionsModal';

export default function TeamsChannelWidget({ 
  forms, 
  onPostForm, 
  onSubmitResponse, 
  onNavigateToChannel, 
  onToast 
}) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedFormForFill, setSelectedFormForFill] = useState(null);
  const [selectedFormForView, setSelectedFormForView] = useState(null);

  const activeForms = forms.filter((f) => f.status === 'Active');

  const handleRemindPending = (form) => {
    onToast?.(`Sent reminder to pending interns for "${form.title}"`);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shadow-2xs">
            <Hash className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Teams Channel: Active Forms
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                {activeForms.length} Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Broadcast forms posted by Manager for all 48 cohort interns to complete
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Form</span>
          </button>
          <button
            onClick={onNavigateToChannel}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>Open Channel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Forms Grid */}
      {activeForms.length === 0 ? (
        <div className="mt-4 p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-xs">
          <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">No Active Channel Forms</h4>
          <p className="text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Channel form broadcasts and response collections are planned for V2.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeForms.map((form) => {
          const completionPercent = Math.round((form.submittedCount / form.totalTarget) * 100);

          return (
            <div
              key={form.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-purple-200 transition-all shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                    {form.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>{form.dueDate}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                  {form.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {form.description}
                </p>
              </div>

              {/* Progress & Actions */}
              <div className="pt-2 border-t border-slate-200/60 space-y-2.5">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Submissions Progress</span>
                    <span className="text-purple-700 font-bold">
                      {form.submittedCount} / {form.totalTarget} ({completionPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${completionPercent}%` }} 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <button
                    onClick={() => setSelectedFormForFill(form)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Fill &amp; Submit</span>
                  </button>
                  <button
                    onClick={() => setSelectedFormForView(form)}
                    className="py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors shadow-2xs"
                  >
                    <Users className="w-3 h-3" />
                    <span>Responses ({form.submittedCount})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modals */}
      <PostFormModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostForm={(newForm) => {
          onPostForm(newForm);
          onToast?.(`Form "${newForm.title}" posted to Teams Channel`);
        }}
      />

      <FillFormModal
        isOpen={Boolean(selectedFormForFill)}
        form={selectedFormForFill}
        onClose={() => setSelectedFormForFill(null)}
        onSubmitResponse={(response) => {
          onSubmitResponse(response);
          onToast?.('Form response submitted successfully!');
        }}
      />

      <ViewSubmissionsModal
        isOpen={Boolean(selectedFormForView)}
        form={selectedFormForView}
        onClose={() => setSelectedFormForView(null)}
        onRemindPending={handleRemindPending}
      />
    </div>
  );
}

