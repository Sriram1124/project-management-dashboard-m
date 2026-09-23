import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ManagerDashboardView from './components/views/ManagerDashboardView';
import ProjectsDirectoryView from './components/views/projects/ProjectsDirectoryView';
import ProjectWorkspaceView from './components/views/projects/ProjectWorkspaceView';
import InternsView from './components/views/InternsView';
import TechLeadsView from './components/views/TechLeadsView';
import TasksView from './components/views/TasksView';
import ReportsView from './components/views/ReportsView';
import InternPortalView from './components/views/InternPortalView';
import AlertModal from './components/modals/AlertModal';
import QuickSearchModal from './components/modals/QuickSearchModal';
import ExceptionDetailModal from './components/modals/ExceptionDetailModal';
import TeamsChannelView from './components/channels/TeamsChannelView';
import { initialChannelForms } from './data/channelFormsData';
import { CheckCircle2 } from 'lucide-react';
import { mockProjectWorkspaceData } from './data/projectWorkspaceData';

export default function App() {
  const [currentRole, setCurrentRole] = useState('manager'); // 'manager' | 'intern'
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeProjectTab, setActiveProjectTab] = useState('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedException, setSelectedException] = useState(null);
  const [toast, setToast] = useState(null);
  const [channelForms, setChannelForms] = useState(initialChannelForms);

  const handlePostChannelForm = (newForm) => {
    setChannelForms((prev) => [newForm, ...prev]);
    triggerToast(`Form "${newForm.title}" posted to Teams Channel`);
  };

  const handleSubmitChannelFormResponse = ({ formId, internName, section, rating, blocker }) => {
    setChannelForms((prev) =>
      prev.map((f) => {
        if (f.id === formId) {
          const newResp = {
            id: `r-${Date.now()}`,
            internName,
            section,
            submittedAt: 'Just now',
            rating,
            blocker,
          };
          return {
            ...f,
            submittedCount: Math.min(f.totalTarget, f.submittedCount + 1),
            sampleResponses: [newResp, ...(f.sampleResponses || [])],
          };
        }
        return f;
      })
    );
    triggerToast('Form response submitted successfully!');
  };

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K) & Browser Back/Forward navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAlertModalOpen(false);
        setSelectedException(null);
      }
    };

    const handlePopState = (e) => {
      if (e.state?.projectId) {
        setActiveProjectId(e.state.projectId);
        setCurrentView('projects');
      } else {
        setActiveProjectId(null);
        if (e.state?.view) {
          setCurrentView(e.state.view);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const triggerToast = (msg) => {
    setToast({ msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAlertSent = (message, targetGroup) => {
    triggerToast(
      `Broadcast alert dispatched to ${
        targetGroup === 'all-cohort' ? 'all 48 interns' : '11 pending/overdue recipients'
      }`
    );
  };

  const handleCustomAlertFromBar = (message) => {
    triggerToast(`Broadcast alert sent: "${message.slice(0, 32)}..."`);
  };

  const handleActionFromException = (actionName) => {
    triggerToast(`Action initiated: ${actionName}`);
  };

  const handleSelectProject = (projectId) => {
    const id = projectId || 'PROJ-SMS-2025';
    setActiveProjectId(id);
    setActiveProjectTab('kanban');
    setCurrentView('projects');
    window.history.pushState({ view: 'projects', projectId: id }, '', window.location.pathname);
    triggerToast('Loaded Kanban Board: Student Management System');
  };

  const handleExitProject = () => {
    setActiveProjectId(null);
    setCurrentView('projects');
    window.history.pushState({ view: 'projects', projectId: null }, '', window.location.pathname);
  };

  const handleTogglePerspective = () => {
    if (currentRole === 'manager') {
      setCurrentRole('intern');
      triggerToast('Switched perspective to Intern Portal');
    } else {
      setCurrentRole('manager');
      triggerToast('Returned to Manager Console');
    }
  };

  const getViewTitle = () => {
    if (currentRole === 'intern') return 'Intern Workstation';
    if (activeProjectId) {
      return mockProjectWorkspaceData.name;
    }
    switch (currentView) {
      case 'dashboard':
        return 'Welcome Back, Sarah';
      case 'projects':
        return 'Projects Directory';
      case 'interns':
        return 'Intern Roster & Oversight';
      case 'tech-leads':
        return 'Tech Leads Console';
      case 'tasks':
        return 'Task Deadlines & Boards';
      case 'reports':
        return 'Intern Performance Reports';
      case 'channels':
        return 'Teams Channel: Forms & Broadcasts';
      default:
        return 'Manager Dashboard';
    }
  };

  const getBreadcrumbs = () => {
    if (currentRole === 'intern') return ['Intern Portal', 'My Workspace'];
    if (activeProjectId) {
      return ['Projects', mockProjectWorkspaceData.name];
    }
    const pageLabel =
      {
        dashboard: 'Manager Dashboard',
        projects: 'Projects Directory',
        interns: 'Interns',
        'tech-leads': 'Tech Leads',
        tasks: 'Tasks',
        reports: 'Performance Reports',
        channels: 'Teams Channel',
      }[currentView] || 'Manager Dashboard';

    return ['Console', pageLabel];
  };

  return (
    <div className="min-h-screen flex bg-[#F7F8FC] font-sans antialiased text-slate-800 selection:bg-purple-200">
      {/* Sidebar navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setActiveProjectId(null);
          if (currentRole !== 'manager') setCurrentRole('manager');
        }}
        activeProjectId={activeProjectId}
        onExitProject={handleExitProject}
        activeProjectTab={activeProjectTab}
        onSelectProjectTab={(tabId) => setActiveProjectTab(tabId)}
        internCount={48}
        currentRole={currentRole}
        onTogglePerspective={handleTogglePerspective}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          breadcrumbs={getBreadcrumbs()}
          title={getViewTitle()}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAlertModal={() => setIsAlertModalOpen(true)}
          unreadAlertCount={4}
          onBackClick={activeProjectId ? handleExitProject : null}
          onBreadcrumbClick={(crumb) => {
            if (crumb === 'Projects') {
              handleExitProject();
            } else if (crumb === 'Console') {
              setActiveProjectId(null);
              setCurrentView('dashboard');
            }
          }}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {currentRole === 'intern' ? (
            <InternPortalView onSwitchToManager={() => setCurrentRole('manager')} />
          ) : activeProjectId ? (
            <ProjectWorkspaceView
              onBackToDirectory={handleExitProject}
              activeTab={activeProjectTab}
              onTabChange={(tabId) => setActiveProjectTab(tabId)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onActionTrigger={(action) => triggerToast(`Action opened: ${action}`)}
              onToast={triggerToast}
            />
          ) : (
            <>
              {currentView === 'dashboard' && (
                <ManagerDashboardView
                  onNavigate={(v) => {
                    setCurrentView(v);
                  }}
                  onOpenAlertModal={() => setIsAlertModalOpen(true)}
                  onOpenExceptionModal={(excId) => setSelectedException(excId)}
                  onSendAlertMessage={handleCustomAlertFromBar}
                  channelForms={channelForms}
                  onPostForm={handlePostChannelForm}
                  onSubmitResponse={handleSubmitChannelFormResponse}
                  onToast={triggerToast}
                />
              )}
              {currentView === 'projects' && (
                <ProjectsDirectoryView onSelectProject={handleSelectProject} />
              )}
              {currentView === 'interns' && (
                <InternsView
                  onPingIntern={(intern) =>
                    triggerToast(`Message prompt opened for ${intern.name}`)
                  }
                />
              )}
              {currentView === 'tech-leads' && (
                <TechLeadsView
                  onRebalanceLead={(lead) =>
                    triggerToast(`Opened review rebalance for ${lead.name}`)
                  }
                />
              )}
              {currentView === 'tasks' && <TasksView />}
              {currentView === 'reports' && <ReportsView />}
              {currentView === 'channels' && (
                <TeamsChannelView
                  forms={channelForms}
                  onPostForm={handlePostChannelForm}
                  onSubmitResponse={handleSubmitChannelFormResponse}
                  onToast={triggerToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSent={handleAlertSent}
      />

      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(type, item) => {
          if (type === 'interns') {
            setActiveProjectId(null);
            setCurrentView('interns');
          } else if (type === 'projects') {
            handleSelectProject(item.id);
          } else if (type === 'tasks') {
            setActiveProjectId(null);
            setCurrentView('tasks');
          }
          triggerToast(`Navigated to ${item.name || item.title}`);
        }}
      />

      <ExceptionDetailModal
        exceptionId={selectedException}
        onClose={() => setSelectedException(null)}
        onActionTaken={handleActionFromException}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-slate-900 text-white text-xs font-medium shadow-md animate-in slide-in-from-bottom-2 duration-150 border border-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
