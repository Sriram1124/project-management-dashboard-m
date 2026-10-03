import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Users,
  Check,
  XCircle
} from 'lucide-react';
import { usersService } from '../../services/users.service';

export default function BulkImportModal({ isOpen, onClose, onSuccess }) {
  // Step: 'UPLOAD' | 'PREVIEW' | 'SUCCESS'
  const [step, setStep] = useState('UPLOAD');
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvContent, setCsvContent] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const templateContent = 'name,email,type\nJohn Doe,john@example.com,INTERN\nJane Smith,jane@example.com,EMPLOYEE\n';
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'members_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Please select a valid .csv file.');
        return;
      }
      setError('');
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target?.result || '');
      };
      reader.readAsText(file);
    }
  };

  const handleValidate = async () => {
    if (!csvContent.trim()) {
      setError('Please choose a CSV file with member data.');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const result = await usersService.validateBulkCsv(csvContent);
      setValidationResult(result);
      setStep('PREVIEW');
    } catch (err) {
      setError(err.response?.data?.reason || err.response?.data?.error || err.message || 'Failed to validate CSV file.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!validationResult || !validationResult.validRows || validationResult.validRows.length === 0) {
      setError('No valid candidate rows available to import.');
      return;
    }

    setIsImporting(true);
    setError('');

    try {
      // Send ONLY valid candidate rows to prevent any invalid row from reaching creation
      const result = await usersService.confirmBulkImport(validationResult.validRows);
      setImportResult(result);
      setStep('SUCCESS');
      onSuccess?.(); // Refresh background list
    } catch (err) {
      setError(
        err.response?.data?.reason ||
        err.response?.data?.error ||
        err.message ||
        'Bulk import could not be completed.'
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadCredentialsCsv = () => {
    if (!importResult?.created_users) return;

    const headers = 'name,email,user_code,type,temporary_password\n';
    const rows = importResult.created_users.map(
      (u) => `"${u.name}","${u.email}","${u.user_code}","${u.type}","${u.temporary_password}"`
    ).join('\n');

    const csvData = headers + rows;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `provisioned_credentials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    // Reset state
    setStep('UPLOAD');
    setSelectedFile(null);
    setCsvContent('');
    setValidationResult(null);
    setImportResult(null);
    setError('');
    onClose();
  };

  const validCount = validationResult?.summary?.valid ?? validationResult?.validRows?.length ?? 0;
  const invalidCount = validationResult?.summary?.invalid ?? validationResult?.invalidRows?.length ?? 0;
  const totalCount = validationResult?.summary?.total ?? (validCount + invalidCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Bulk Import Members</h2>
              <p className="text-xs text-slate-500 mt-0.5">Provision multiple interns and employees via CSV.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Import Error</span>
                <span className="text-[11px] leading-relaxed mt-0.5 block">{error}</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 1: UPLOAD & VALIDATE                                 */}
          {/* ========================================================= */}
          {step === 'UPLOAD' && (
            <div className="space-y-4">
              
              {/* Template Download Box */}
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-950">Need the formatted template?</h4>
                  <p className="text-[11px] text-purple-700 mt-0.5">Download our standardized CSV template with required headers.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3 py-1.5 rounded-lg bg-white border border-purple-200 hover:bg-purple-50 text-xs font-bold text-purple-700 flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Template
                </button>
              </div>

              {/* Upload Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-purple-50/20"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                {selectedFile ? (
                  <div>
                    <span className="text-xs font-bold text-purple-700 block">{selectedFile.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">{(selectedFile.size / 1024).toFixed(1)} KB • Click to choose different file</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Click to select CSV file</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">Required columns: name, email, type</span>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedFile || isValidating}
                  onClick={handleValidate}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Validating CSV...
                    </>
                  ) : (
                    <>
                      <span>Validate CSV</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: PREVIEW & CONFIRM                                 */}
          {/* ========================================================= */}
          {step === 'PREVIEW' && validationResult && (
            <div className="space-y-4">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Rows</span>
                  <span className="text-lg font-black text-slate-800">{totalCount}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Valid Rows</span>
                  <span className="text-lg font-black text-emerald-800">{validCount}</span>
                </div>
                <div className="p-3 bg-red-50 rounded-xl border border-red-200/80 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">Invalid Rows</span>
                  <span className="text-lg font-black text-red-800">{invalidCount}</span>
                </div>
              </div>

              {/* Invalid Rows Section */}
              {validationResult.invalidRows?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Invalid Rows ({validationResult.invalidRows.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {validationResult.invalidRows.map((inv, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">
                            Row {inv.rowNumber}
                          </span>
                          <span className="font-semibold text-slate-900 block truncate">
                            {inv.name || 'Unnamed'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500 block truncate">
                            {inv.email || 'No email'}
                          </span>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100/90 text-red-700 font-bold text-[11px]">
                            ❌ {inv.reason}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General errors (e.g. invalid header structure) */}
              {(!validationResult.invalidRows || validationResult.invalidRows.length === 0) && validationResult.errors?.length > 0 && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="text-xs font-bold text-red-800 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    Validation Errors ({validationResult.errors.length})
                  </h4>
                  <ul className="text-[11px] text-red-700 space-y-1 max-h-28 overflow-y-auto pr-1">
                    {validationResult.errors.map((err, idx) => (
                      <li key={idx} className="list-disc list-inside">{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Valid Rows Preview Table */}
              {validationResult.validRows?.length > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Valid Candidate Rows ({validationResult.validRows.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px] sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Email</th>
                          <th className="py-2 px-3">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {validationResult.validRows.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/60">
                            <td className="py-1.5 px-3 font-semibold text-slate-900">{r.name}</td>
                            <td className="py-1.5 px-3 font-mono text-[11px] text-slate-600">{r.email}</td>
                            <td className="py-1.5 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                r.type === 'INTERN' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                              }`}>
                                {r.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  No valid candidate rows to import from this file.
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep('UPLOAD')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Upload Again
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isImporting || validCount === 0}
                    onClick={handleConfirmImport}
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Importing Members...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Confirm Import ({validCount})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: SUCCESS RESULT & CREDENTIALS                      */}
          {/* ========================================================= */}
          {step === 'SUCCESS' && importResult && (
            <div className="space-y-5 text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Bulk Import Successful!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Successfully provisioned <strong>{importResult.summary?.created}</strong> members into your organization.
                </p>
              </div>

              <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-left text-amber-900 text-xs flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-950">Download Generated Credentials</p>
                  <p className="text-[11px] leading-relaxed text-amber-900/90">
                    One-time temporary passwords and generated User IDs have been created. <strong>These credentials cannot be retrieved after you close this window.</strong>
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleDownloadCredentialsCsv}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Credentials CSV
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
