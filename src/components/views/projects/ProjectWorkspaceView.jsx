import React, { useState } from 'react';
import ProjectOverviewTab from './ProjectOverviewTab';
import ProjectRoadmapTab from './ProjectRoadmapTab';
import ProjectSprintWorkspaceTab from './ProjectSprintWorkspaceTab';
import ProjectBacklogTab from './ProjectBacklogTab';
import ProjectMomTab from './ProjectMomTab';
import KanbanBoard from '../../kanban/KanbanBoard';
import { mockProjectWorkspaceData } from '../../../data/projectWorkspaceData';

export default function ProjectWorkspaceView({ 
  onBackToDirectory, 
  activeTab = 'sprint', 
  onTabChange,
  onOpenSearch,
  onActionTrigger,
  onToast,
}) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const data = mockProjectWorkspaceData;

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'sprint', label: 'Sprint Workspace' },
    { id: 'backlog', label: 'Backlog & Epics' },
    { id: 'kanban', label: 'Kanban Board' },
    { id: 'mom', label: 'MoM' },
  ];

  return (
    <div className="space-y-3">
      {/* PROJECT CONTEXT: METADATA & PROJECT NAVIGATION TABS */}
      <div className="bg-white border-b border-slate-200 -mt-2 -mx-2 px-6 pt-3 pb-0 select-none">
        {/* ROW 1: Project Metadata */}
        <div className="flex items-center gap-3 text-[15px] text-slate-600 pb-2.5">
          <span>Tech Lead: <strong className="text-slate-800 font-semibold">{data.lead.name}</strong></span>
          <span className="text-slate-300 select-none">·</span>
          <span>Sections: <strong className="text-slate-800 font-semibold">{data.sections.join(', ')}</strong></span>
          <span className="text-slate-300 select-none">·</span>
          <span><strong className="text-slate-800 font-semibold">48</strong> Interns</span>
        </div>

        {/* ROW 2: Project Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto -mb-px">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-purple-600 text-purple-700 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Current Tab Content */}
      <div className="pt-1">
        {currentTab === 'sprint' && (
          <ProjectSprintWorkspaceTab onLogWork={() => onActionTrigger?.('Log Work Modal')} />
        )}
        {currentTab === 'kanban' && <KanbanBoard onToast={onToast} />}
        {currentTab === 'overview' && <ProjectOverviewTab onToast={onToast} />}
        {currentTab === 'roadmap' && <ProjectRoadmapTab />}
        {currentTab === 'backlog' && (
          <ProjectBacklogTab onToast={onToast} />
        )}
        {currentTab === 'mom' && (
          <ProjectMomTab onToast={onToast} />
        )}
      </div>
    </div>
  );
}
