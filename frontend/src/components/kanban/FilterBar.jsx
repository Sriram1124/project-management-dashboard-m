import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { MOCK_ASSIGNEES, MOCK_EPICS, MOCK_SPRINTS } from '../../constants/kanban';

export default function FilterBar({
  searchQuery = '',
  onSearchChange,
  selectedAssignee,
  onSelectAssignee,
  selectedPriority,
  onSelectPriority,
  selectedEpic,
  onSelectEpic,
  selectedSprint = 'Sprint 04 / Active Sprint',
  onSelectSprint,
  quickFilterMyTasks = false,
  onToggleMyTasks,
  quickFilterOverdue = false,
  onToggleOverdue,
  quickFilterBlocked = false,
  onToggleBlocked,
  onClearFilters,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const barRef = useRef(null);

  const priorities = ['All Priorities', 'High', 'Medium', 'Low', 'Blocked', 'Completed'];

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
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
    (selectedEpic && selectedEpic !== 'All Epics') ||
    quickFilterMyTasks ||
    quickFilterOverdue ||
    quickFilterBlocked
  );

  return (
    <div
      ref={barRef}
      className="bg-white rounded-md p-2.5 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 relative z-10"
    >
      {/* Left side: Search input + 4 Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search Input */}
        <div className="relative min-w-[190px] sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-6 py-1 rounded-md border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-white hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

        {/* Assignee Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('assignee')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              selectedAssignee
                ? 'border-purple-400 bg-purple-50/60 text-purple-700 font-semibold'
                : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
            }`}
          >
            {selectedAssignee ? (
              <div className="flex items-center gap-1.5">
                <img
                  src={selectedAssignee.avatar}
                  alt={selectedAssignee.name}
                  className="w-3.5 h-3.5 rounded-full object-cover"
                />
                <span className="truncate max-w-[90px]">{selectedAssignee.name}</span>
              </div>
            ) : (
              <span>Assignee</span>
            )}
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
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              selectedPriority
                ? 'border-purple-400 bg-purple-50/60 text-purple-700 font-semibold'
                : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
            }`}
          >
            <span>{selectedPriority || 'Priority'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {openDropdown === 'priority' && (
            <div className="absolute left-0 mt-1 w-40 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
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
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              selectedEpic && selectedEpic !== 'All Epics'
                ? 'border-purple-400 bg-purple-50/60 text-purple-700 font-semibold'
                : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
            }`}
          >
            <span className="truncate max-w-[100px]">
              {selectedEpic && selectedEpic !== 'All Epics' ? selectedEpic : 'Epic'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {openDropdown === 'epic' && (
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
              {MOCK_EPICS.map((e) => {
                const isSelected = (!selectedEpic && e === 'All Epics') || selectedEpic === e;
                return (
                  <button
                    key={e}
                    onClick={() => {
                      onSelectEpic?.(e === 'All Epics' ? null : e);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      isSelected ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                    }`}
                  >
                    <span>{e}</span>
                    {isSelected && <Check className="w-3 h-3 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sprint Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('sprint')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="truncate max-w-[120px]">{selectedSprint}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {openDropdown === 'sprint' && (
            <div className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-md border border-slate-200 py-1 z-30">
              {MOCK_SPRINTS.map((s) => {
                const isSelected = selectedSprint === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      onSelectSprint?.(s);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      isSelected ? 'text-purple-700 font-semibold bg-purple-50/40' : 'text-slate-700'
                    }`}
                  >
                    <span>{s}</span>
                    {isSelected && <Check className="w-3 h-3 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Quick Filters + Clear */}
      <div className="flex items-center gap-1.5 text-xs shrink-0">
        <button
          onClick={onToggleMyTasks}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
            quickFilterMyTasks
              ? 'bg-purple-50 border-purple-300 text-purple-700 font-semibold'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          My Tasks
        </button>

        <button
          onClick={onToggleOverdue}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
            quickFilterOverdue
              ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Overdue
        </button>

        <button
          onClick={onToggleBlocked}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
            quickFilterBlocked
              ? 'bg-rose-100 border-rose-400 text-rose-800 font-semibold'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Blocked
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-700 ml-1 underline transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
