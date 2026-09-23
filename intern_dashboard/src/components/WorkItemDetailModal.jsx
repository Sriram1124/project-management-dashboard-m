import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Paperclip, 
  Send, 
  History, 
  FolderPlus, 
  CornerDownRight, 
  FileText, 
  UploadCloud, 
  Tag, 
  Layers,
  Check
} from 'lucide-react';
import { workItemsService } from '../services/workItemsService';

export default function WorkItemDetailModal({
  workItem,
  isOpen,
  onClose,
  onToast
}) {
  if (!isOpen || !workItem) return null;

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'attachments' | 'activity' | 'comments'
  const [status, setStatus] = useState(workItem.status);
  const [priority, setPriority] = useState(workItem.priority);
  const [newComment, setNewComment] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  const isOverdue = workItemsService.isOverdue(workItem);
  const childItems = workItemsService.getChildWorkItems(workItem.id);
  const parentItem = workItem.parent_id
    ? workItemsService.getWorkItemById(workItem.parent_id)
    : null;

  // Multiple assignees check: is current user one of several?
  const isCurrentUserAssigned = workItem.work_item_assignees?.some(
    (a) => a.id === 'INT-01'
  );
  const hasMultipleAssignees = (workItem.work_item_assignees?.length || 0) > 1;

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    workItemsService.updateWorkItem(workItem.id, { status: newStatus });
    onToast?.(`Updated status to ${newStatus}`);
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    workItemsService.updateWorkItem(workItem.id, { priority: newPriority });
    onToast?.(`Priority changed to ${newPriority}`);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    workItemsService.addComment(workItem.id, newComment.trim());
    setNewComment('');
    onToast?.('Comment added');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      workItemsService.addAttachment(workItem.id, {
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type || 'file'
      });
      onToast?.(`Uploaded attachment "${file.name}"`);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'EPIC':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'STORY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'TASK':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUBTASK':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'BUG':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'URGENT':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-bold';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LOW':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between">
          <div className="space-y-1.5 min-w-0 pr-4">
            {/* Hierarchy Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="font-semibold text-purple-700">
                {workItem.project_name || 'Personal Workspace'}
              </span>
              {parentItem && (
                <>
                  <span>/</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <CornerDownRight className="w-3 h-3 text-slate-400" />
                    Parent: {parentItem.title}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getTypeBadge(
                  workItem.type
                )}`}
              >
                {workItem.type}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">
                {workItem.id}
              </span>

              {isOverdue && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded">
                  <AlertCircle className="w-3 h-3" /> Overdue
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {workItem.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-white text-xs">
          {[
            { id: 'details', label: 'Details & Scope' },
            { id: 'attachments', label: `Attachments (${workItem.attachments?.length || 0})` },
            { id: 'comments', label: `Comments (${workItem.comments?.length || 0})` },
            { id: 'activity', label: 'Activity Log' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                  Description
                </h4>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {workItem.description || 'No description provided.'}
                </div>
              </div>

              {/* Status & Priority Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-50/40 rounded-xl border border-purple-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-purple-200 bg-white font-semibold text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-purple-200 bg-white font-semibold text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Dates & Deadlines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Start Date
                  </span>
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {workItem.start_date
                        ? new Date(workItem.start_date).toLocaleDateString()
                        : 'Not specified'}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3 border rounded-xl ${
                    isOverdue
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Due Date
                  </span>
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock
                      className={`w-3.5 h-3.5 ${
                        isOverdue ? 'text-rose-600' : 'text-slate-400'
                      }`}
                    />
                    <span>
                      {workItem.due_date
                        ? new Date(workItem.due_date).toLocaleDateString()
                        : 'No due date'}
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] font-bold text-rose-600 uppercase ml-auto">
                        (Overdue)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignees Section - Multiple Assignees Support */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Work Item Assignees ({workItem.work_item_assignees?.length || 0})
                  </h4>
                  {hasMultipleAssignees && isCurrentUserAssigned && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      You are a co-assignee
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {workItem.work_item_assignees?.map((assignee) => {
                    const isYou = assignee.id === 'INT-01';
                    return (
                      <div
                        key={assignee.id}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${
                          isYou
                            ? 'bg-purple-50/70 border-purple-200 text-purple-900'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate flex items-center gap-1.5">
                            <span>{assignee.name}</span>
                            {isYou && (
                              <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {assignee.role}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Child Subtasks Section */}
              {childItems.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Child Subtasks ({childItems.length})
                  </h4>
                  <div className="space-y-2">
                    {childItems.map((child) => (
                      <div
                        key={child.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => workItemsService.toggleComplete(child.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              child.status === 'COMPLETED'
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {child.status === 'COMPLETED' && <Check className="w-3 h-3" />}
                          </button>
                          <span
                            className={
                              child.status === 'COMPLETED'
                                ? 'line-through text-slate-400 font-medium'
                                : 'text-slate-800 font-semibold'
                            }
                          >
                            {child.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {child.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Task Attachments ({workItem.attachments?.length || 0})
                </span>
                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              {workItem.attachments?.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                  <Paperclip className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No attachments yet</p>
                  <p className="text-[11px] mt-1">
                    Upload screenshots, logs, or verification files for this work item.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {workItem.attachments?.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 block truncate">
                            {att.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {att.size} • Uploaded {att.uploaded_at}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToast?.(`Downloading ${att.name}...`)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment or note..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-purple-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {workItem.comments?.length === 0 ? (
                  <p className="text-center text-slate-400 py-6">No comments yet.</p>
                ) : (
                  workItem.comments?.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{c.author}</span>
                        <span className="text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              {workItem.activity_history?.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <History className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{act.user}</span>
                      <span className="text-[10px] text-slate-400">
                        {act.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{act.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Work Item ID: <span className="font-mono text-slate-700 font-bold">{workItem.id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
