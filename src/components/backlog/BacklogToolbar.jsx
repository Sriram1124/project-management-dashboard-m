import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Check, 
  X, 
  Layers
} from 'lucide-react';
import { MOCK_ASSIGNEES } from '../../constants/kanban';

export default function BacklogToolbar({
  issuesCount = 0,
  epicsCount = 0,
  totalSP = 0,
  searchQuery = '',
  onSearchChange,
  selectedAssignee,
  onSelectAssignee,
  selectedPriority,
  onSelectPriority,
  selectedEpicId,
  onSelectEpicId,
  selectedSprintId,
  onSelectSprintId,
  selectedStatus,
  onSelectStatus,
  groupBy = 'sprint', // 'sprint' | 'epic' | 'none'
  onSelectGroupBy,
  isEpicPanelOpen,
  onToggleEpicPanel,
  epics = [],
  sprints = [],
  quickFilterMyIssues,
  onToggleMyIssues,
  quickFilterOverdue,
  onToggleOverdue,
  quickFilterBlocked,
  onToggleBlocked,
  onClearFilters,
  onCreateClick,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const toolbarRef = useRef(null);

  const priorities = ['All Priorities', 'High', 'Medium', 'Low'];
  const statuses = ['All Statuses', 'TO DO', 'IN PROGRESS', 'IN REVIEW', 'BLOCKED', 'DONE'];

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedAssignee ||
    selectedPriority ||
    selectedEpicId ||
    selectedSprintId ||
    selectedStatus ||
    quickFilterMyIssues ||
    quickFilterOverdue ||
    quickFilterBlocked
  );

  return (
    <div
      ref={toolbarRef}
      className="bg-white rounded-md p-2.5 border border-slate-200 space-y-2 relative z-20 text-xs select-none"
    >
      {/* LINE 1: COMPACT BACKLOG TITLE & STATS */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <h2 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
          Backlog
        </h2>

        <div className="text-[11px] text-slate-500 font-medium">
          <strong className="text-slate-900 font-semibold">{issuesCount}</strong> Issues
          <span className="text-slate-300 mx-1.5">·</span>
          <strong className="text-slate-900 font-semibold">{epicsCount}</strong> Epics
          <span className="text-slate-300 mx-1.5">·</span>
          <strong className="text-slate-900 font-semibold">{totalSP}</strong> SP
        </div>
      </div>

      {/* LINE 2: TOOLBAR CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        {/* Left Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {/* + Create Button */}
          <button
            onClick={onCreateClick}
            className="px-2.5 py-1 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold flex items-center gap-1 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>

          {/* Epics Panel Toggle */}
          <button
            onClick={onToggleEpicPanel}
            className={`px-2 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
              isEpicPanelOpen
                ? 'bg-purple-50 border-purple-300 text-purple-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle Epics panel"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Epics</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5 hidden sm:block" />

          {/* Search Box */}
          <div className="relative w-44 sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search issues..."
              className="w-full pl-7 pr-5 py-1 rounded-md border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-white hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Assignee Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('assignee')}
              className={`px-2 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                selectedAssignee
                  ? 'border-purple-300 bg-purple-50/70 text-purple-700 font-semibold'
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
              }`}
            >
              <span>{selectedAssignee ? selectedAssignee.name : 'Assignee'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'assignee' && (
              <div className="absolute left-0 mt-1 w-52 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
                <button
                  onClick={() => {
                    onSelectAssignee?.(null);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    !selectedAssignee ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                  }`}
                >
                  <span>All Assignees</span>
                  {!selectedAssignee && <Check className="w-3 h-3 text-purple-600" />}
                </button>

                {MOCK_ASSIGNEES.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectAssignee?.(user);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      selectedAssignee?.id === user.id ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
                      <span className="truncate">{user.name}</span>
                    </div>
                    {selectedAssignee?.id === user.id && <Check className="w-3 h-3 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('priority')}
              className={`px-2 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                selectedPriority
                  ? 'border-purple-300 bg-purple-50/70 text-purple-700 font-semibold'
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
              }`}
            >
              <span>{selectedPriority || 'Priority'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'priority' && (
              <div className="absolute left-0 mt-1 w-36 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
                {priorities.map((p) => {
                  const isSelected = (!selectedPriority && p === 'All Priorities') || selectedPriority === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        onSelectPriority?.(p === 'All Priorities' ? null : p);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        isSelected ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                      }`}
                    >
                      <span>{p}</span>
                      {isSelected && <Check className="w-3 h-3 text-purple-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Epic Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('epic')}
              className={`px-2 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                selectedEpicId
                  ? 'border-purple-300 bg-purple-50/70 text-purple-700 font-semibold'
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="truncate max-w-[90px]">
                {selectedEpicId ? epics.find(e => e.id === selectedEpicId)?.name || 'Epic' : 'Epic'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'epic' && (
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
                <button
                  onClick={() => {
                    onSelectEpicId?.(null);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    !selectedEpicId ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                  }`}
                >
                  <span>All Epics</span>
                  {!selectedEpicId && <Check className="w-3 h-3 text-purple-600" />}
                </button>

                {epics.map((epic) => (
                  <button
                    key={epic.id}
                    onClick={() => {
                      onSelectEpicId?.(epic.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      selectedEpicId === epic.id ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: epic.color }} />
                      <span className="truncate">{epic.name}</span>
                    </div>
                    {selectedEpicId === epic.id && <Check className="w-3 h-3 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sprint Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('sprint')}
              className={`px-2 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                selectedSprintId
                  ? 'border-purple-300 bg-purple-50/70 text-purple-700 font-semibold'
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
              }`}
            >
              <span>
                {selectedSprintId ? sprints.find(s => s.id === selectedSprintId)?.name || 'Sprint' : 'Sprint'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'sprint' && (
              <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
                <button
                  onClick={() => {
                    onSelectSprintId?.(null);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    !selectedSprintId ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                  }`}
                >
                  <span>All Sprints</span>
                  {!selectedSprintId && <Check className="w-3 h-3 text-purple-600" />}
                </button>

                {sprints.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSprintId?.(s.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      selectedSprintId === s.id ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                    }`}
                  >
                    <span>{s.name}</span>
                    {selectedSprintId === s.id && <Check className="w-3 h-3 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('status')}
              className={`px-2 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                selectedStatus
                  ? 'border-purple-300 bg-purple-50/70 text-purple-700 font-semibold'
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
              }`}
            >
              <span>{selectedStatus || 'Status'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'status' && (
              <div className="absolute left-0 mt-1 w-36 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
                {statuses.map((st) => {
                  const isSelected = (!selectedStatus && st === 'All Statuses') || selectedStatus === st;
                  return (
                    <button
                      key={st}
                      onClick={() => {
                        onSelectStatus?.(st === 'All Statuses' ? null : st);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        isSelected ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                      }`}
                    >
                      <span>{st}</span>
                      {isSelected && <Check className="w-3 h-3 text-purple-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls: Quick Filters & Group by */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleMyIssues}
            className={`px-2 py-1 rounded-md font-medium border transition-colors ${
              quickFilterMyIssues
                ? 'bg-purple-50 border-purple-300 text-purple-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
            }`}
          >
            My Issues
          </button>

          <button
            onClick={onToggleOverdue}
            className={`px-2 py-1 rounded-md font-medium border transition-colors ${
              quickFilterOverdue
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
            }`}
          >
            Overdue
          </button>

          <button
            onClick={onToggleBlocked}
            className={`px-2 py-1 rounded-md font-medium border transition-colors ${
              quickFilterBlocked
                ? 'bg-rose-100 border-rose-300 text-rose-800 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
            }`}
          >
            Blocked
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5 hidden sm:block" />

          {/* Group By */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('groupby')}
              className="px-2 py-1 rounded-md border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium flex items-center gap-1"
            >
              <span className="text-slate-400">Group:</span>
              <span className="capitalize">{groupBy}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'groupby' && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
                {['sprint', 'epic', 'none'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      onSelectGroupBy?.(mode);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      groupBy === mode ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                    }`}
                  >
                    <span className="capitalize">{mode}</span>
                    {groupBy === mode && <Check className="w-3 h-3 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-700 underline px-1 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
