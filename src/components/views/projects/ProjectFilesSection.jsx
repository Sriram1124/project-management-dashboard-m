import React, { useState, useRef } from 'react';
import { 
  Folder, 
  Plus, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  MoreVertical, 
  Eye, 
  Download, 
  Pencil, 
  Trash2, 
  Clock, 
  Check, 
  X,
  UploadCloud
} from 'lucide-react';
import FilePreviewModal from './FilePreviewModal';

// Clean inline SVG Architecture Diagram for the image preview thumbnail
const architectureSvgDataUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="100%" height="100%">
  <rect width="600" height="340" fill="%23f8fafc" rx="8"/>
  <rect x="20" y="20" width="560" height="300" fill="white" stroke="%23e2e8f0" stroke-width="1.5" rx="6"/>
  <!-- Header -->
  <rect x="20" y="20" width="560" height="40" fill="%23f1f5f9" rx="6"/>
  <circle cx="45" cy="40" r="5" fill="%23ef4444"/>
  <circle cx="62" cy="40" r="5" fill="%23f59e0b"/>
  <circle cx="79" cy="40" r="5" fill="%2310b981"/>
  <text x="105" y="44" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23475569">System Architecture • Microservices &amp; PostgreSQL Engine</text>
  <!-- Client Box -->
  <rect x="50" y="100" width="120" height="70" rx="8" fill="%23e0e7ff" stroke="%236366f1" stroke-width="1.5"/>
  <text x="110" y="132" font-family="sans-serif" font-size="12" font-weight="bold" fill="%234338ca" text-anchor="middle">React Client</text>
  <text x="110" y="150" font-family="sans-serif" font-size="9" fill="%236366f1" text-anchor="middle">Vite + Tailwind</text>
  <!-- Gateway Box -->
  <rect x="240" y="100" width="130" height="70" rx="8" fill="%23f3e8ff" stroke="%239333ea" stroke-width="1.5"/>
  <text x="305" y="132" font-family="sans-serif" font-size="12" font-weight="bold" fill="%237e22ce" text-anchor="middle">API Gateway</text>
  <text x="305" y="150" font-family="sans-serif" font-size="9" fill="%239333ea" text-anchor="middle">JWT Auth &amp; Rate Limit</text>
  <!-- Database Box -->
  <rect x="440" y="100" width="120" height="70" rx="8" fill="%23dcfce7" stroke="%2316a34a" stroke-width="1.5"/>
  <text x="500" y="132" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2315803d" text-anchor="middle">PostgreSQL</text>
  <text x="500" y="150" font-family="sans-serif" font-size="9" fill="%2316a34a" text-anchor="middle">Primary DB + Pool</text>
  <!-- Connectors -->
  <line x1="170" y1="135" x2="240" y2="135" stroke="%2394a3b8" stroke-width="2" stroke-dasharray="4"/>
  <polygon points="238,131 246,135 238,139" fill="%2364748b"/>
  <line x1="370" y1="135" x2="440" y2="135" stroke="%2394a3b8" stroke-width="2" stroke-dasharray="4"/>
  <polygon points="438,131 446,135 438,139" fill="%2364748b"/>
  <!-- Sub services -->
  <rect x="190" y="215" width="105" height="55" rx="6" fill="%23fef3c7" stroke="%23d97706" stroke-width="1.5"/>
  <text x="242" y="243" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23b45309" text-anchor="middle">Auth Service</text>
  <text x="242" y="257" font-family="sans-serif" font-size="8" fill="%23d97706" text-anchor="middle">HttpOnly Cookies</text>
  <rect x="320" y="215" width="115" height="55" rx="6" fill="%23e0f2fe" stroke="%230284c7" stroke-width="1.5"/>
  <text x="377" y="243" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230369a1" text-anchor="middle">Timesheets Engine</text>
  <text x="377" y="257" font-family="sans-serif" font-size="8" fill="%230284c7" text-anchor="middle">Weekly Sync Job</text>
  <line x1="242" y1="170" x2="242" y2="215" stroke="%2394a3b8" stroke-width="1.5"/>
  <line x1="377" y1="170" x2="377" y2="215" stroke="%2394a3b8" stroke-width="1.5"/>
</svg>`;

const INITIAL_FILES = [
  {
    id: 'f-1',
    name: 'Project Requirements.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedAt: 'Sep 18, 2026',
    uploadedBy: 'Priya Sharma',
    isImage: false,
  },
  {
    id: 'f-2',
    name: 'Database Schema.xlsx',
    type: 'xlsx',
    size: '1.1 MB',
    uploadedAt: 'Sep 20, 2026',
    uploadedBy: 'Priya Sharma',
    isImage: false,
  },
  {
    id: 'f-3',
    name: 'Meeting Minutes — Sprint 3.pdf',
    type: 'pdf',
    size: '840 KB',
    uploadedAt: 'Yesterday, 4:15 PM',
    uploadedBy: 'Priya Sharma',
    isImage: false,
  },
  {
    id: 'f-4',
    name: 'Project Documentation.docx',
    type: 'docx',
    size: '3.8 MB',
    uploadedAt: 'Today, 11:20 AM',
    uploadedBy: 'Priya Sharma',
    isImage: false,
  },
  {
    id: 'f-5',
    name: 'System Architecture Diagram.png',
    type: 'png',
    size: '1.8 MB',
    uploadedAt: 'Sep 21, 2026',
    uploadedBy: 'Priya Sharma',
    isImage: true,
    thumbnailUrl: architectureSvgDataUri,
  },
];

export default function ProjectFilesSection({ onToast }) {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [previewFile, setPreviewFile] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef(null);

  // Close open dropdowns when clicking outside
  const handleContainerClick = () => {
    if (activeMenuId) setActiveMenuId(null);
  };

  const handleUploadClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const uploaded = Array.from(e.target.files || []);
    if (!uploaded.length) return;

    const newEntries = uploaded.map((f, idx) => {
      const ext = f.name.split('.').pop().toLowerCase();
      const isImg = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext);
      const sizeStr = f.size > 1024 * 1024 
        ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(f.size / 1024)} KB`;

      return {
        id: `f-${Date.now()}-${idx}`,
        name: f.name,
        type: ext,
        size: sizeStr,
        uploadedAt: 'Just now',
        uploadedBy: 'Priya Sharma',
        isImage: isImg,
        thumbnailUrl: isImg ? URL.createObjectURL(f) : null,
      };
    });

    setFiles((prev) => [...newEntries, ...prev]);
    onToast?.(`Uploaded ${newEntries.length} file(s) successfully`);
    // Reset file input
    e.target.value = '';
  };

  const handlePreview = (file, e) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    setPreviewFile(file);
  };

  const handleDownload = (file, e) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    onToast?.(`Downloading ${file.name}...`);
    // Create mock download link
    const link = document.createElement('a');
    link.href = file.thumbnailUrl || '#';
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartRename = (file, e) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    setRenameFile(file);
    setNewName(file.name);
  };

  const handleConfirmRename = () => {
    if (!newName.trim() || !renameFile) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === renameFile.id ? { ...f, name: newName.trim() } : f))
    );
    onToast?.(`Renamed to "${newName.trim()}"`);
    setRenameFile(null);
    setNewName('');
  };

  const handleDelete = (file, e) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    onToast?.(`Deleted "${file.name}"`);
  };

  const toggleMenu = (fileId, e) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === fileId ? null : fileId));
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-100" onClick={handleContainerClick}>
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-purple-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Project Files
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {files.length}
          </span>
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Visual File Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {files.map((file) => {
          const isMenuOpen = activeMenuId === file.id;

          return (
            <div
              key={file.id}
              onClick={(e) => handlePreview(file, e)}
              className="bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-purple-300 rounded-xl p-3.5 transition-all shadow-xs hover:shadow-sm cursor-pointer group flex flex-col justify-between relative"
            >
              {/* Top Row: Icon / Thumbnail + Three-dot Menu */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  {/* File Type Representation */}
                  {file.isImage ? (
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/70 relative mb-1 group-hover:border-purple-200 transition-colors">
                      <img
                        src={file.thumbnailUrl}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-900/70 text-white backdrop-blur-xs">
                        {file.type}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 group-hover:bg-purple-50 group-hover:border-purple-200 transition-colors">
                        {file.type === 'pdf' && <FileText className="w-4 h-4 text-rose-600" />}
                        {file.type === 'xlsx' && <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
                        {file.type === 'docx' && <FileText className="w-4 h-4 text-blue-600" />}
                        {!['pdf', 'xlsx', 'docx'].includes(file.type) && (
                          <FileText className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                        {file.type}
                      </span>
                    </div>
                  )}

                  {/* Three-dot Action Menu Button */}
                  <div className="relative shrink-0">
                    <button
                      onClick={(e) => toggleMenu(file.id, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="File options"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div 
                        className="absolute right-0 top-6 z-20 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handlePreview(file, e)}
                          className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={(e) => handleDownload(file, e)}
                          className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={(e) => handleStartRename(file, e)}
                          className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-400" />
                          <span>Rename</span>
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button
                          onClick={(e) => handleDelete(file, e)}
                          className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-rose-50 text-rose-600 font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Name */}
                <h4 
                  className="text-xs font-bold text-slate-800 truncate group-hover:text-purple-700 transition-colors"
                  title={file.name}
                >
                  {file.name}
                </h4>
              </div>

              {/* Bottom Metadata: Size & Modified Date */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                <span className="font-medium text-slate-500">{file.size}</span>
                <span className="truncate ml-2 text-right" title={`Uploaded ${file.uploadedAt}`}>
                  {file.uploadedAt}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rename Dialog Modal */}
      {renameFile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-100"
          onClick={() => setRenameFile(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-sm font-bold text-slate-900 mb-2">Rename File</h4>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename()}
              autoFocus
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setRenameFile(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRename}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}

