import React, { useState } from 'react';
import { 
  Hash, 
  Plus, 
  Send, 
  Users, 
  Bell, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Pin, 
  Paperclip, 
  Smile, 
  Search, 
  Filter, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import PostFormModal from './PostFormModal';
import FillFormModal from './FillFormModal';
import ViewSubmissionsModal from './ViewSubmissionsModal';
import { formsService } from '../../services/forms.service';
import CreateFormModal from '../modals/CreateFormModal';
import FormBuilderDrawer from '../modals/FormBuilderDrawer';
import ViewSubmissionsDrawer from '../modals/ViewSubmissionsDrawer';

export default function TeamsChannelView({ 
  onPostForm, 
  onSubmitResponse, 
  onToast 
}) {
  const [activeChannel, setActiveChannel] = useState('forms-and-surveys');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'active' | 'completed'
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  const [forms, setForms] = useState([]);
  const [selectedFormForView, setSelectedFormForView] = useState(null);
  const [selectedFormBuilder, setSelectedFormBuilder] = useState(null);
  const [selectedFormForEdit, setSelectedFormForEdit] = useState(null);
  const [chatMessage, setChatMessage] = useState('');

  const loadForms = async () => {
    try {
      const data = await formsService.getForms();
      setForms(data);
    } catch (e) {
      console.error('Failed to load forms');
    }
  };

  React.useEffect(() => {
    loadForms();
  }, []);

  const channelsList = [
    { id: 'forms-and-surveys', name: 'forms-and-surveys', count: forms.length, isPrimary: true },
  ];

  const filteredForms = forms.filter((f) => {
    if (filterTab === 'active') return f.status === 'PUBLISHED';
    if (filterTab === 'completed') return f.status === 'ARCHIVED';
    return true;
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    onToast?.(`Message posted to #${activeChannel}`);
    setChatMessage('');
  };

  const handleRemindPending = (form) => {
    onToast?.(`Sent submission reminder ping for "${form.title}" to pending interns`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row min-h-[760px] overflow-hidden">
      {/* LEFT CHANNEL SIDEBAR */}
      <div className="w-full md:w-64 border-r border-slate-200/80 bg-slate-50/70 p-4 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                T
              </div>
              <div className="leading-tight">
                <h3 className="text-xs font-bold text-slate-900">Intern Teams</h3>
                <span className="text-[10px] text-slate-400">Cohort 2026 Channels</span>
              </div>
            </div>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="p-1 rounded-md text-purple-600 hover:bg-purple-100 transition-colors"
              title="Post New Form"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Channel Groups */}
          <div className="mt-4 space-y-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2">
                Team Channels
              </div>
              <nav className="space-y-1">
                {channelsList.map((ch) => {
                  const isActive = activeChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-purple-100 text-purple-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                        <span className="truncate">{ch.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-purple-200 text-purple-800' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {ch.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Target Cohort Info */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Channel Audience</span>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-700 font-semibold">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Organization Members</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                Forms posted by the Manager are visible to active organization members for submission.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Post Button */}
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-4"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Post Form for Cohort</span>
        </button>
      </div>

      {/* RIGHT MAIN FEED */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFE]">
        {/* Channel Header */}
        <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-100 text-purple-700">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">forms-and-surveys</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Broadcast Channel
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Manager posts weekly reflection forms, check-ins, and survey requests for cohort submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterTab === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                All ({forms.length})
              </button>
              <button
                onClick={() => setFilterTab('active')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterTab === 'active' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterTab('completed')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterTab === 'completed' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Completed
              </button>
            </div>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Form</span>
            </button>
          </div>
        </div>

        {/* Channel Posts Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-950 leading-relaxed">
              <strong className="font-bold">Forms Management Channel:</strong> Forms posted here by the Manager are immediately accessible to active members for response submission.
            </div>
          </div>

          {/* Form Stream */}
          {filteredForms.map((form) => {
            const completionPercent = Math.round((form._count?.submissions || 0 / form.totalTarget) * 100);

            return (
              <div 
                key={form.id} 
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-200 transition-all p-5 space-y-4"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={(form.creator||{name:'Manager',role:'Admin',avatar:'https://ui-avatars.com/api/?name=Manager'}).avatar}
                      alt={(form.creator||{name:'Manager',role:'Admin',avatar:'https://ui-avatars.com/api/?name=Manager'}).name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{(form.creator||{name:'Manager',role:'Admin',avatar:'https://ui-avatars.com/api/?name=Manager'}).name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                          {(form.creator||{name:'Manager',role:'Admin',avatar:'https://ui-avatars.com/api/?name=Manager'}).role}
                        </span>
                        {form.pinned && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                            <Pin className="w-3 h-3 fill-current" />
                            Pinned Form
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Posted {form.postedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      form.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {form.status}
                    </span>
                  </div>
                </div>

                {/* Embedded Form Card Box */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-600 text-white shadow-2xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {form.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-semibold text-purple-700">{form.category}</span>
                          <span>•</span>
                          <span>Target: {form.targetAudience}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due: {form.dueDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {form.description}
                  </p>

                  {/* Submission Progress bar */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Cohort Submissions</span>
                      <span className="text-purple-700 font-bold">
                        {form._count?.submissions || 0} / {form.totalTarget} Submitted ({completionPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          completionPercent >= 100 ? 'bg-emerald-500' : 'bg-purple-600'
                        }`}
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons for Everyone */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-2">
                      {form.status === 'DRAFT' && (
                        <>
                          <button
                            onClick={() => setSelectedFormForEdit(form)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          >
                            <span>Edit Form</span>
                          </button>
                          <button
                            onClick={() => setSelectedFormBuilder(form)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Build Form</span>
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await formsService.publishForm(form.id);
                                onToast?.('Form published successfully');
                                loadForms();
                              } catch (e) {
                                onToast?.('Failed to publish form');
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          >
                            <span>Publish Form</span>
                          </button>
                        </>
                      )}

                      {form.status !== 'DRAFT' && (
                        <button
                          onClick={() => setSelectedFormForView(form)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>View Submissions ({form._count?.submissions || 0})</span>
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {form.status} ? Instant confirmation
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Channel Chat / Message Input Footer */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPostModalOpen(true)}
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 border border-purple-200 flex items-center gap-1 text-xs font-semibold transition-colors shrink-0"
              title="Post a Form to this channel"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Attach Form</span>
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message or announcement to #forms-and-surveys..."
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <button
              type="submit"
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors shrink-0 cursor-pointer"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Modals */}
      {isPostModalOpen && (
        <CreateFormModal
          onClose={() => setIsPostModalOpen(false)}
          onSuccess={() => {
            setIsPostModalOpen(false);
            loadForms();
            onToast?.('New form created successfully.');
          }}
        />
      )}

      {selectedFormForEdit && (
        <CreateFormModal
          form={selectedFormForEdit}
          onClose={() => setSelectedFormForEdit(null)}
          onSuccess={() => {
            setSelectedFormForEdit(null);
            loadForms();
            onToast?.('Form updated successfully.');
          }}
        />
      )}

      {selectedFormBuilder && (
        <FormBuilderDrawer
          form={selectedFormBuilder}
          onClose={() => setSelectedFormBuilder(null)}
          onUpdate={loadForms}
        />
      )}

      {selectedFormForView && (
        <ViewSubmissionsDrawer
          formId={selectedFormForView.id}
          onClose={() => setSelectedFormForView(null)}
        />
      )}
    </div>
  );
}

