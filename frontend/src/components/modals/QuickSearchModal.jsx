import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, FolderKanban, CheckSquare, FileText, ArrowRight } from 'lucide-react';
import { mockInterns, mockProjects, mockTasks } from '../../data/mockData';

export default function QuickSearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredInterns = q ? mockInterns.filter(i => 
    i.name.toLowerCase().includes(q) || 
    i.project.toLowerCase().includes(q) || 
    i.section.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const filteredProjects = q ? mockProjects.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.lead.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const filteredTasks = q ? mockTasks.filter(t => 
    t.title.toLowerCase().includes(q) || 
    t.assignee.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const hasResults = filteredInterns.length > 0 || filteredProjects.length > 0 || filteredTasks.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interns, projects, tasks, leads..."
            className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!q ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-600">Quick Search across InternHub</p>
              <p>Type an intern name, project track, task title, or section code (e.g. "Aarav", "AI", "A1")</p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Interns Section */}
              {filteredInterns.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-purple-600" />
                    <span>Interns</span>
                  </div>
                  <div className="space-y-1">
                    {filteredInterns.map((intern) => (
                      <div
                        key={intern.id}
                        onClick={() => {
                          onSelectResult?.('interns', intern);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                            {intern.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700">
                              {intern.name}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {intern.project} • Sec {intern.section}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {filteredProjects.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FolderKanban className="w-3 h-3 text-purple-600" />
                    <span>Projects</span>
                  </div>
                  <div className="space-y-1">
                    {filteredProjects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          onSelectResult?.('projects', proj);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700">
                            {proj.name}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            Lead: {proj.lead} • {proj.internsCount} Interns • {proj.progress}% Progress
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {proj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Section */}
              {filteredTasks.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3 h-3 text-purple-600" />
                    <span>Tasks</span>
                  </div>
                  <div className="space-y-1">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          onSelectResult?.('tasks', task);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700">
                            {task.title}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            Assignee: {task.assignee} • Due: {task.due}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

