import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Calendar, 
  User, 
  HardDrive, 
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

export default function FilePreviewModal({ file, onClose, onDownload }) {
  const [activeSheet, setActiveSheet] = useState('users');
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!file) return null;

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'xlsx':
      case 'xls':
      case 'csv':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'docx':
      case 'doc':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
              {file.type === 'pdf' && <FileText className="w-5 h-5 text-rose-600" />}
              {file.type === 'xlsx' && <FileSpreadsheet className="w-5 h-5 text-emerald-600" />}
              {file.type === 'docx' && <FileText className="w-5 h-5 text-blue-600" />}
              {file.isImage && <ImageIcon className="w-5 h-5 text-purple-600" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {file.name}
                </h3>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getFileBadgeColor(file.type)}`}>
                  {file.type}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>{file.size}</span>
                <span>•</span>
                <span>Modified {file.uploadedAt}</span>
                <span>•</span>
                <span>By {file.uploadedBy || 'Priya Sharma'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button
              onClick={() => onDownload(file)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 transition-colors"
              title="Copy shareable link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Preview Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60 min-h-[380px] max-h-[65vh] flex flex-col items-center justify-start">
          {/* IMAGE PREVIEW */}
          {file.isImage && (
            <div className="w-full flex flex-col items-center">
              <div className="mb-3 flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-600 shadow-2xs">
                <button 
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                  className="hover:text-purple-600 p-0.5"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] font-semibold w-12 text-center">{zoomLevel}%</span>
                <button 
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                  className="hover:text-purple-600 p-0.5"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-[11px] text-slate-400">1920 × 1080 px</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-full overflow-auto flex items-center justify-center">
                <img
                  src={file.thumbnailUrl || file.previewUrl}
                  alt={file.name}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
                  className="rounded-lg object-contain max-h-[500px] w-auto max-w-full"
                />
              </div>
            </div>
          )}

          {/* PDF PREVIEW */}
          {file.type === 'pdf' && (
            <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden text-slate-800">
              <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Page 1 of 8</span>
                <span className="font-medium text-slate-700">Document Reader Preview</span>
                <span>Zoom 100%</span>
              </div>
              <div className="p-8 space-y-5 text-sm leading-relaxed">
                <div className="border-b border-slate-100 pb-4">
                  <div className="text-[11px] font-bold text-purple-700 uppercase tracking-widest">
                    PROJECT DOCUMENTATION • CONFIDENTIAL
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 mt-1">
                    {file.name.replace('.pdf', '')}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Approved by Tech Lead: Priya Sharma • Active for Sprint 05
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-800 text-sm">1. Executive Overview & Objectives</h4>
                  <p>
                    This document formalizes the requirements, architecture milestones, and delivery specifications for the Student Management System (SMS) project cohort. All intern tasks mapped in Backlog must adhere to the acceptance criteria defined herein.
                  </p>

                  <h4 className="font-bold text-slate-800 text-sm pt-2">2. Key Architectural Deliverables</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>PostgreSQL schema with role-based row-level permissions</li>
                    <li>JWT stateless session auth with HttpOnly cookie rotation</li>
                    <li>Timesheet submission engine with weekly audit logs</li>
                    <li>MoM documentation pipeline with direct Jira-style task mapping</li>
                  </ul>

                  <h4 className="font-bold text-slate-800 text-sm pt-2">3. Acceptance & SLA Criteria</h4>
                  <p>
                    All API endpoints must maintain sub-120ms response time at p95 under load. Code review sign-off is required by Section Lead prior to production deployment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SPREADSHEET PREVIEW */}
          {file.type === 'xlsx' && (
            <div className="w-full bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-700">Workbook:</span>
                  <span>4 Tables, 240 Rows</span>
                </div>
                <div className="flex items-center gap-1">
                  {['users', 'cohort_allocations', 'sprint_tasks', 'audit_logs'].map((sheet) => (
                    <button
                      key={sheet}
                      onClick={() => setActiveSheet(sheet)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        activeSheet === sheet 
                          ? 'bg-emerald-600 text-white font-semibold' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {sheet}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                      <th className="py-2 px-3 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
                      <th className="py-2 px-3 border-r border-slate-200">Field Name</th>
                      <th className="py-2 px-3 border-r border-slate-200">Data Type</th>
                      <th className="py-2 px-3 border-r border-slate-200">Nullable</th>
                      <th className="py-2 px-3 border-r border-slate-200">Constraints</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 border-r border-slate-100 text-center text-slate-400">1</td>
                      <td className="py-2 px-3 border-r border-slate-100 font-bold text-slate-900">id</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-purple-700">UUID</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-rose-600 font-semibold">NO</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-amber-700">PRIMARY KEY</td>
                      <td className="py-2 px-3 font-sans text-slate-600">Unique internal identifier</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 border-r border-slate-100 text-center text-slate-400">2</td>
                      <td className="py-2 px-3 border-r border-slate-100 font-bold text-slate-900">full_name</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-purple-700">VARCHAR(255)</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-rose-600 font-semibold">NO</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-slate-400">-</td>
                      <td className="py-2 px-3 font-sans text-slate-600">Intern full registered name</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 border-r border-slate-100 text-center text-slate-400">3</td>
                      <td className="py-2 px-3 border-r border-slate-100 font-bold text-slate-900">cohort_section</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-purple-700">VARCHAR(10)</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-rose-600 font-semibold">NO</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-slate-400">-</td>
                      <td className="py-2 px-3 font-sans text-slate-600">Section code: A1, A2, B1, B2...</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 border-r border-slate-100 text-center text-slate-400">4</td>
                      <td className="py-2 px-3 border-r border-slate-100 font-bold text-slate-900">role_type</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-purple-700">ENUM</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-rose-600 font-semibold">NO</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-slate-400">DEFAULT 'intern'</td>
                      <td className="py-2 px-3 font-sans text-slate-600">Access permission classification</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 border-r border-slate-100 text-center text-slate-400">5</td>
                      <td className="py-2 px-3 border-r border-slate-100 font-bold text-slate-900">created_at</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-purple-700">TIMESTAMPTZ</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-rose-600 font-semibold">NO</td>
                      <td className="py-2 px-3 border-r border-slate-100 text-slate-400">NOW()</td>
                      <td className="py-2 px-3 font-sans text-slate-600">Record creation audit timestamp</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WORD / DOCX PREVIEW */}
          {file.type === 'docx' && (
            <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-md p-8 text-slate-800 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Microsoft Word Document • 14 Pages
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {file.name.replace('.docx', '')}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">Author: Engineering Documentation Team</div>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed space-y-3">
                <p>
                  <strong>System Architecture & Onboarding Manual:</strong> This guide provides engineering interns and mentors with comprehensive instructions regarding repository setup, local Docker container execution, database migration scripts, and pull-request guidelines.
                </p>
                <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-lg text-blue-900 text-xs">
                  <strong>Important Notice:</strong> All commits must reference an existing Jira/Backlog ticket ID (e.g., <code>[SPS-204] Fix JWT header parsing</code>) to pass GitHub Actions automated lint verification.
                </div>
                <p>
                  For questions or credential assistance, reach out to Tech Lead <strong>Priya Sharma</strong> or submit an escalation ticket in the project workspace.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Encrypted & verified against project repository</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(file)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Copy
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

