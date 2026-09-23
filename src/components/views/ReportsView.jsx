import React, { useState } from 'react';
import { mockInterns } from '../../data/mockData';
import { 
  Download, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Eye, 
  X,
  FileText,
  User,
  Star,
  ChevronRight
} from 'lucide-react';

export default function ReportsView() {
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [scoreFilter, setScoreFilter] = useState('All');
  const [selectedInternModal, setSelectedInternModal] = useState(null);

  // Augment mockInterns with rich individual performance evaluation metrics
  const internsPerformance = mockInterns.map((intern, index) => {
    // Generate deterministic evaluation scores based on index and existing status
    const baseScore = intern.status === 'Lagging' 
      ? 62 + (index % 12) 
      : 82 + ((index * 7) % 17);
    const score = Math.min(98, Math.max(55, baseScore));
    
    const velocity = intern.status === 'Lagging' ? '12 pts/sprint' : '26 pts/sprint';
    const codeQuality = score >= 90 ? 'Exceptional (A+)' : score >= 80 ? 'Proficient (A)' : score >= 70 ? 'Satisfactory (B)' : 'Needs Attention (C)';
    const reviewTurnaround = score >= 85 ? '18 hours avg' : '34 hours avg';
    const strengths = score >= 85 
      ? ['High component velocity', 'Clean documentation', 'Proactive peer reviews']
      : score >= 75
      ? ['Consistent delivery', 'Good team communication']
      : ['Requires additional pair programming', 'Deadline follow-up needed'];
    
    return {
      ...intern,
      performanceScore: score,
      velocity,
      codeQuality,
      reviewTurnaround,
      strengths,
      evaluationPeriod: 'Q4 2025 Sprint Cycle',
      grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'C',
    };
  });

  const filtered = internsPerformance.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
                        i.email.toLowerCase().includes(search.toLowerCase()) ||
                        i.project.toLowerCase().includes(search.toLowerCase());
    const matchSection = sectionFilter === 'All' || i.section === sectionFilter;
    const matchScore = 
      scoreFilter === 'All' ? true :
      scoreFilter === 'Top' ? i.performanceScore >= 90 :
      scoreFilter === 'OnTrack' ? (i.performanceScore >= 75 && i.performanceScore < 90) :
      i.performanceScore < 75;

    return matchSearch && matchSection && matchScore;
  });

  // Client-side instant download function for an individual intern report
  const handleDownloadSingleReport = (intern) => {
    const reportContent = `===============================================================
INTERNHUB INDIVIDUAL PERFORMANCE APPRAISAL REPORT
===============================================================
Date Generated: ${new Date().toLocaleDateString()}
Intern Name:    ${intern.name}
Intern ID:      ${intern.id}
Email:          ${intern.email}
Track/Project:  ${intern.project}
Section:        ${intern.section}
Tech Lead:      ${intern.lead}
Evaluation:     ${intern.evaluationPeriod}
---------------------------------------------------------------
KEY PERFORMANCE INDICATORS (KPIs)
---------------------------------------------------------------
Overall Performance Score: ${intern.performanceScore}% (Grade: ${intern.grade})
Status:                    ${intern.status}
Tasks Completed:           ${intern.tasksDone} of ${intern.tasksTotal}
Overdue Tasks:             ${intern.overdue}
Attendance Compliance:     ${intern.attendance}
Sprint Velocity:           ${intern.velocity}
Code Quality Rating:       ${intern.codeQuality}
Average PR Turnaround:     ${intern.reviewTurnaround}

---------------------------------------------------------------
EVALUATION & STRENGTHS
---------------------------------------------------------------
${intern.strengths.map(s => `• ${s}`).join('\n')}

---------------------------------------------------------------
SUPERVISOR RECOMMENDATION
---------------------------------------------------------------
${intern.performanceScore >= 85 
  ? 'Strong candidate for full-time junior engineer conversion. Recommended for advanced architecture assignments.' 
  : intern.performanceScore >= 75 
  ? 'Meeting all milestones according to sprint schedule. Continue current curriculum.' 
  : 'Recommended for targeted pair programming mentoring with assigned Tech Lead.'}

Authorized Program Manager: Sarah Mitchell
InternHub Operations Platform v1.0
===============================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${intern.name.replace(/\s+/g, '_')}_Performance_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Client-side batch CSV export for all interns
  const handleExportAllCSV = () => {
    const headers = [
      'Intern ID', 'Name', 'Email', 'Project', 'Section', 'Tech Lead',
      'Performance Score %', 'Grade', 'Tasks Done', 'Tasks Total', 'Overdue',
      'Attendance', 'Sprint Velocity', 'Code Quality'
    ];
    const rows = filtered.map(i => [
      `"${i.id}"`,
      `"${i.name}"`,
      `"${i.email}"`,
      `"${i.project}"`,
      `"${i.section}"`,
      `"${i.lead}"`,
      i.performanceScore,
      `"${i.grade}"`,
      i.tasksDone,
      i.tasksTotal,
      i.overdue,
      `"${i.attendance}"`,
      `"${i.velocity}"`,
      `"${i.codeQuality}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `InternHub_Cohort_Performance_Reports_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Individual Intern Performance Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Downloadable evaluation scorecards and appraisal records for all 48 cohort members
          </p>
        </div>

        <button
          onClick={handleExportAllCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export All Reports (CSV)</span>
        </button>
      </div>

      {/* KPI Highlight Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Performance</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">84.2%</div>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">✔ Exceeds target threshold</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Performers (90%+)</span>
            <div className="text-2xl font-extrabold text-purple-700 mt-1">
              {internsPerformance.filter(i => i.performanceScore >= 90).length} Interns
            </div>
            <p className="text-xs text-purple-600 font-semibold mt-0.5">Conversion eligible</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Star className="w-5 h-5 fill-emerald-500 stroke-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reports Ready</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">48 of 48</div>
            <p className="text-xs text-slate-400 mt-0.5">Updated with Q4 sprint metrics</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search intern name, email, or project..."
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 w-full"
          />
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Section:</span>
          {['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'].map((sec) => (
            <button
              key={sec}
              onClick={() => setSectionFilter(sec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                sectionFilter === sec
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Tier:</span>
          {[
            { id: 'All', label: 'All' },
            { id: 'Top', label: 'Top (90%+)' },
            { id: 'OnTrack', label: 'On Track' },
            { id: 'NeedsSupport', label: 'Needs Support' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setScoreFilter(t.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                scoreFilter === t.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interns Performance Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Intern Details</th>
                <th className="py-3.5 px-6">Project & Tech Lead</th>
                <th className="py-3.5 px-6">Performance Score</th>
                <th className="py-3.5 px-6">Deliverables</th>
                <th className="py-3.5 px-6">Code Quality</th>
                <th className="py-3.5 px-6 text-right">Download Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((intern) => (
                <tr key={intern.id} className="hover:bg-purple-50/30 transition-colors">
                  {/* Intern Name & Avatar */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {intern.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{intern.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{intern.id} • {intern.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Project & Lead */}
                  <td className="py-3.5 px-6">
                    <div className="text-slate-800 font-semibold text-xs">{intern.project}</div>
                    <div className="text-[10px] text-slate-400">Lead: {intern.lead} • Sec {intern.section}</div>
                  </td>

                  {/* Performance Score Badge */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            intern.performanceScore >= 90 ? 'bg-emerald-500' :
                            intern.performanceScore >= 75 ? 'bg-purple-600' : 'bg-rose-500'
                          }`}
                          style={{ width: `${intern.performanceScore}%` }}
                        />
                      </div>
                      <span className={`font-extrabold text-xs ${
                        intern.performanceScore >= 90 ? 'text-emerald-600' :
                        intern.performanceScore >= 75 ? 'text-purple-700' : 'text-rose-600'
                      }`}>
                        {intern.performanceScore}%
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
                        {intern.grade}
                      </span>
                    </div>
                  </td>

                  {/* Deliverables */}
                  <td className="py-3.5 px-6">
                    <span className="text-slate-700 font-semibold">{intern.tasksDone}/{intern.tasksTotal} Tasks</span>
                    <div className="text-[10px] text-slate-400">
                      {intern.overdue > 0 ? (
                        <span className="text-rose-600 font-semibold">{intern.overdue} overdue</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">0 overdue</span>
                      )}
                    </div>
                  </td>

                  {/* Code Quality */}
                  <td className="py-3.5 px-6">
                    <span className="text-slate-800 text-xs font-semibold">{intern.codeQuality}</span>
                    <div className="text-[10px] text-slate-400">{intern.velocity}</div>
                  </td>

                  {/* Download Action Buttons */}
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInternModal(intern)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Preview Scorecard"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownloadSingleReport(intern)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-semibold text-xs border border-purple-200 hover:border-purple-600 transition-all active:scale-95 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {internsPerformance.length} individual performance records</span>
          <span className="text-purple-700 font-semibold">All reports generated and verified for download</span>
        </div>
      </div>

      {/* Individual Report Card Preview Modal */}
      {selectedInternModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedInternModal(null)}
        >
          <div 
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedInternModal.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedInternModal.name}</h3>
                  <p className="text-xs text-slate-500">{selectedInternModal.project} • Section {selectedInternModal.section}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInternModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Scorecard Hero */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">Overall Rating</span>
                  <div className="text-3xl font-black text-purple-900 mt-1">
                    {selectedInternModal.performanceScore}%
                  </div>
                  <span className="text-xs text-purple-700 font-medium">Grade {selectedInternModal.grade} • {selectedInternModal.codeQuality}</span>
                </div>
                <div className="text-right text-xs space-y-1">
                  <div>Attendance: <strong className="text-slate-800">{selectedInternModal.attendance}</strong></div>
                  <div>Tasks Done: <strong className="text-slate-800">{selectedInternModal.tasksDone}/{selectedInternModal.tasksTotal}</strong></div>
                  <div>Velocity: <strong className="text-slate-800">{selectedInternModal.velocity}</strong></div>
                </div>
              </div>

              {/* Evaluation Highlights */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Key Strengths & Observations
                </h4>
                <div className="space-y-1.5">
                  {selectedInternModal.strengths.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manager Feedback */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-600">
                <span className="font-bold text-slate-800 block">Supervisor Recommendation:</span>
                <p>
                  {selectedInternModal.performanceScore >= 85
                    ? 'Exceeding sprint milestones. Demonstrates high problem-solving capacity and is on track for post-internship recruitment.'
                    : 'Consistently completes assigned backlog tickets. Recommended to take on more complex algorithmic modules.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">InternHub Appraisal Engine</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInternModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownloadSingleReport(selectedInternModal);
                    setSelectedInternModal(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Report (.txt)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
