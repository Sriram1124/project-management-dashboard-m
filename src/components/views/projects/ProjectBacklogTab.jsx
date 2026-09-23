import React, { useState } from 'react';
import BacklogToolbar from '../../backlog/BacklogToolbar';
import SprintSection from '../../backlog/SprintSection';
import EpicPanel from '../../backlog/EpicPanel';
import IssueDetailDrawer from '../../backlog/IssueDetailDrawer';
import CreateIssueModal from '../../backlog/CreateIssueModal';
import IssueRow from '../../backlog/IssueRow';
import { 
  INITIAL_EPICS, 
  INITIAL_SPRINTS, 
  INITIAL_ISSUES 
} from '../../../data/backlogData';

export default function ProjectBacklogTab({ onToast }) {
  const [epics, setEpics] = useState(INITIAL_EPICS);
  const [sprints, setSprints] = useState(INITIAL_SPRINTS);
  const [issues, setIssues] = useState(INITIAL_ISSUES);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedEpicId, setSelectedEpicId] = useState(null);
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [groupBy, setGroupBy] = useState('sprint'); // 'sprint' | 'epic' | 'none'
  const [isEpicPanelOpen, setIsEpicPanelOpen] = useState(true);

  // Quick Filters
  const [quickFilterMyIssues, setQuickFilterMyIssues] = useState(false);
  const [quickFilterOverdue, setQuickFilterOverdue] = useState(false);
  const [quickFilterBlocked, setQuickFilterBlocked] = useState(false);

  // Drawer & Modal States
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialSprintId, setCreateInitialSprintId] = useState('sprint-04');
  const [createInitialEpicId, setCreateInitialEpicId] = useState('');

  // Drag and Drop
  const handleDragStart = (e, issueId) => {
    e.dataTransfer.setData('text/plain', issueId);
  };

  const handleDragEnd = () => {
    // cleanup
  };

  const handleDropIssue = (issueId, targetSprintId) => {
    setIssues(prev =>
      prev.map(item => {
        if (item.id === issueId) {
          return { ...item, sprintId: targetSprintId };
        }
        return item;
      })
    );

    const movedIssue = issues.find(i => i.id === issueId);
    const targetSprint = sprints.find(s => s.id === targetSprintId);
    onToast?.(`Moved ${movedIssue?.id || 'issue'} to ${targetSprint?.name || targetSprintId}`);
  };

  // Subtasks Handlers
  const handleToggleSubtask = (issueId, subtaskId) => {
    setIssues(prev =>
      prev.map(item => {
        if (item.id === issueId && item.subtasks) {
          const updatedSubtasks = item.subtasks.map(st =>
            st.id === subtaskId ? { ...st, done: !st.done } : st
          );
          return { ...item, subtasks: updatedSubtasks };
        }
        return item;
      })
    );

    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(st =>
          st.id === subtaskId ? { ...st, done: !st.done } : st
        ),
      }));
    }
  };

  const handleAddSubtask = (issueId, subtaskTitle) => {
    const newSt = {
      id: `${issueId}-S${Date.now().toString().slice(-2)}`,
      title: subtaskTitle,
      done: false,
    };

    setIssues(prev =>
      prev.map(item => {
        if (item.id === issueId) {
          return {
            ...item,
            subtasks: [...(item.subtasks || []), newSt],
          };
        }
        return item;
      })
    );

    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), newSt],
      }));
    }

    onToast?.(`Added subtask to ${issueId}`);
  };

  // Issue CRUD
  const handleCreateIssue = (newIssue) => {
    setIssues(prev => [newIssue, ...prev]);
    onToast?.(`Created ${newIssue.type} ${newIssue.id}: ${newIssue.title}`);
  };

  const handleCreateEpic = (newEpic) => {
    setEpics(prev => [...prev, newEpic]);
    onToast?.(`Created Epic ${newEpic.id}: ${newEpic.name}`);
  };

  const handleUpdateIssue = (updatedIssue) => {
    setIssues(prev =>
      prev.map(item => (item.id === updatedIssue.id ? updatedIssue : item))
    );
    setSelectedIssue(updatedIssue);
    onToast?.(`Updated ${updatedIssue.id}`);
  };

  const handleDeleteIssue = (issueId) => {
    setIssues(prev => prev.filter(item => item.id !== issueId));
    if (selectedIssue?.id === issueId) {
      setSelectedIssue(null);
    }
    onToast?.(`Deleted issue ${issueId}`);
  };

  // Sprint actions
  const handleStartSprint = (sprintId) => {
    setSprints(prev =>
      prev.map(s => (s.id === sprintId ? { ...s, status: 'ACTIVE' } : s))
    );
    onToast?.(`Started sprint ${sprintId}`);
  };

  const handleCompleteSprint = (sprintId) => {
    setSprints(prev =>
      prev.map(s => (s.id === sprintId ? { ...s, status: 'COMPLETED' } : s))
    );
    onToast?.(`Completed sprint ${sprintId}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedAssignee(null);
    setSelectedPriority(null);
    setSelectedEpicId(null);
    setSelectedSprintId(null);
    setSelectedStatus(null);
    setQuickFilterMyIssues(false);
    setQuickFilterOverdue(false);
    setQuickFilterBlocked(false);
  };

  // Filtered Issues
  const filteredIssues = issues.filter(issue => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = issue.id.toLowerCase().includes(q);
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description?.toLowerCase().includes(q);
      const matchAssignee = issue.assignee?.name?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchDesc && !matchAssignee) {
        return false;
      }
    }

    if (selectedAssignee && issue.assignee?.id !== selectedAssignee.id) {
      return false;
    }

    if (selectedPriority && issue.priority !== selectedPriority) {
      return false;
    }

    if (selectedEpicId && issue.epicId !== selectedEpicId) {
      return false;
    }

    if (selectedSprintId && issue.sprintId !== selectedSprintId) {
      return false;
    }

    if (selectedStatus && issue.status?.toUpperCase() !== selectedStatus.toUpperCase()) {
      return false;
    }

    if (quickFilterMyIssues) {
      if (!issue.assignee || (issue.assignee.name !== 'Priya Sharma' && issue.assignee.name !== 'Sarah Mitchell')) {
        return false;
      }
    }

    if (quickFilterOverdue && !issue.isOverdue) {
      return false;
    }

    if (quickFilterBlocked && issue.status !== 'BLOCKED') {
      return false;
    }

    return true;
  });

  const totalSP = issues.reduce((acc, curr) => acc + (Number(curr.storyPoints) || 0), 0);

  return (
    <div className="space-y-2.5">
      {/* 1. BACKLOG PRODUCTIVITY TOOLBAR (INCLUDES COMPACT TITLE & STATS) */}
      <BacklogToolbar
        issuesCount={issues.length}
        epicsCount={epics.length}
        totalSP={totalSP}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAssignee={selectedAssignee}
        onSelectAssignee={setSelectedAssignee}
        selectedPriority={selectedPriority}
        onSelectPriority={setSelectedPriority}
        selectedEpicId={selectedEpicId}
        onSelectEpicId={setSelectedEpicId}
        selectedSprintId={selectedSprintId}
        onSelectSprintId={setSelectedSprintId}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        groupBy={groupBy}
        onSelectGroupBy={setGroupBy}
        isEpicPanelOpen={isEpicPanelOpen}
        onToggleEpicPanel={() => setIsEpicPanelOpen(!isEpicPanelOpen)}
        epics={epics}
        sprints={sprints}
        quickFilterMyIssues={quickFilterMyIssues}
        onToggleMyIssues={() => setQuickFilterMyIssues(!quickFilterMyIssues)}
        quickFilterOverdue={quickFilterOverdue}
        onToggleOverdue={() => setQuickFilterOverdue(!quickFilterOverdue)}
        quickFilterBlocked={quickFilterBlocked}
        onToggleBlocked={() => setQuickFilterBlocked(!quickFilterBlocked)}
        onClearFilters={handleClearFilters}
        onCreateClick={() => {
          setCreateInitialSprintId('sprint-04');
          setCreateInitialEpicId('');
          setIsCreateModalOpen(true);
        }}
      />

      {/* 2. MAIN BACKLOG WORKSPACE (EPICS PANEL + SPRINT SECTIONS) */}
      <div className="flex items-start gap-2.5">
        {/* Collapsible Left Epic Panel */}
        {isEpicPanelOpen && (
          <EpicPanel
            epics={epics}
            selectedEpicId={selectedEpicId}
            onSelectEpicId={setSelectedEpicId}
            issues={issues}
            onCreateEpic={() => {
              setCreateInitialSprintId('sprint-04');
              setIsCreateModalOpen(true);
            }}
          />
        )}

        {/* Main Issue Lists Container */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* GROUP BY SPRINT (DEFAULT JIRA BACKLOG VIEW) */}
          {groupBy === 'sprint' && (
            <>
              {sprints.map((sprint) => {
                const sprintIssues = filteredIssues.filter(i => i.sprintId === sprint.id);
                return (
                  <SprintSection
                    key={sprint.id}
                    sprint={sprint}
                    issues={sprintIssues}
                    epics={epics}
                    selectedIssueId={selectedIssue?.id}
                    onSelectIssue={(issue) => setSelectedIssue(issue)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDropIssue={handleDropIssue}
                    onToggleSubtask={handleToggleSubtask}
                    onAddSubtask={handleAddSubtask}
                    onCreateIssueInSprint={(sprintId) => {
                      setCreateInitialSprintId(sprintId);
                      setIsCreateModalOpen(true);
                    }}
                    onStartSprint={handleStartSprint}
                    onCompleteSprint={handleCompleteSprint}
                  />
                );
              })}
            </>
          )}

          {/* GROUP BY EPIC VIEW */}
          {groupBy === 'epic' && (
            <div className="space-y-2.5">
              {epics.map((epic) => {
                const epicIssues = filteredIssues.filter(i => i.epicId === epic.id);
                return (
                  <div key={epic.id} className="rounded-md border border-slate-200 bg-white overflow-hidden">
                    <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: epic.color }} />
                        <span className="font-mono font-bold text-xs text-slate-700">{epic.id}</span>
                        <h3 className="font-bold text-xs text-slate-900">{epic.name}</h3>
                        <span className="text-[11px] text-slate-400">({epicIssues.length} issues)</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{epic.progress}% complete</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {epicIssues.map((issue) => (
                        <IssueRow
                          key={issue.id}
                          issue={issue}
                          epic={epic}
                          isSelected={selectedIssue?.id === issue.id}
                          onSelectIssue={(issue) => setSelectedIssue(issue)}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onToggleSubtask={handleToggleSubtask}
                          onAddSubtask={handleAddSubtask}
                        />
                      ))}
                      {epicIssues.length === 0 && (
                        <div className="p-3 text-center text-xs text-slate-400">
                          No issues assigned to this epic.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* GROUP BY NONE (FLAT LIST) */}
          {groupBy === 'none' && (
            <div className="rounded-md border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
              {filteredIssues.map((issue) => {
                const issueEpic = epics.find(e => e.id === issue.epicId);
                return (
                  <IssueRow
                    key={issue.id}
                    issue={issue}
                    epic={issueEpic}
                    isSelected={selectedIssue?.id === issue.id}
                    onSelectIssue={(issue) => setSelectedIssue(issue)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onToggleSubtask={handleToggleSubtask}
                    onAddSubtask={handleAddSubtask}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. RIGHT-SIDE ISSUE DETAIL DRAWER */}
      <IssueDetailDrawer
        issue={selectedIssue}
        epics={epics}
        sprints={sprints}
        isOpen={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        onUpdateIssue={handleUpdateIssue}
        onDeleteIssue={handleDeleteIssue}
        onToggleSubtask={handleToggleSubtask}
        onAddSubtask={handleAddSubtask}
      />

      {/* 4. CREATE ISSUE MODAL */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        epics={epics}
        sprints={sprints}
        initialSprintId={createInitialSprintId}
        initialEpicId={createInitialEpicId}
        onCreateIssue={handleCreateIssue}
        onCreateEpic={handleCreateEpic}
      />
    </div>
  );
}
