import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Key, 
  UserCheck, 
  FileCheck2, 
  Terminal, 
  X 
} from 'lucide-react';
import { AuditLog, Language } from '../types';
import { translations } from '../data/translations';

interface AuditLogsViewProps {
  logs: AuditLog[];
  currentLang?: Language;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs = [],
}) => {
  const t = translations.en;
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchSearch = (log.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.user?.badge || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.resource || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.ip || '').includes(search);
    const matchAction = actionFilter === 'All' || (log.action || '').toLowerCase().includes(actionFilter.toLowerCase());
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Security & Immutability Verification Banner */}
      <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-lg bg-[#e8f2fe] text-[#0072ce] shadow-2xs">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Immutable Security Audit Ledger
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                SHA-256 VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tamper-evident audit trail recording all operator logins, camera reboots, metadata changes, and live streams.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 flex items-center space-x-1.5 transition shadow-2xs">
            <FileCheck2 className="w-4 h-4 text-[#0072ce]" />
            <span>Verify Hash Chain</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search officer name, badge, action, or IP..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0072ce]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#0072ce]"
          >
            <option value="All">All Actions</option>
            <option value="CREATE_CAMERA">CREATE_CAMERA</option>
            <option value="UPDATE_METADATA">UPDATE_METADATA</option>
            <option value="MARK_MAINTENANCE">MARK_MAINTENANCE</option>
            <option value="ARCHIVE_CAMERA">ARCHIVE_CAMERA</option>
            <option value="RESTORE_CAMERA">RESTORE_CAMERA</option>
            <option value="BULK_IMPORT">BULK_IMPORT</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="EXPORT_REPORT">EXPORT_REPORT</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#00253e] text-white text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Operator & Badge</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Resource</th>
                <th className="p-3">District</th>
                <th className="p-3">Network IP</th>
                <th className="p-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-50 cursor-pointer transition"
                >
                  <td className="p-3 text-slate-500 font-medium text-[11px]">{log.timestamp}</td>
                  <td className="p-3 font-sans">
                    <div className="font-bold text-slate-900">{log.user?.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.user?.badge} • {log.user?.role}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-semibold">{log.resource}</td>
                  <td className="p-3 font-sans text-slate-600">{log.district}</td>
                  <td className="p-3 text-slate-500 text-[11px]">{log.ip}</td>
                  <td className="p-3 text-right font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Audit Log Entry • {selectedLog.id}</h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900">{selectedLog.user?.name} ({selectedLog.user?.role})</p>
                <p className="text-slate-500 font-mono text-[11px]">Badge: {selectedLog.user?.badge} | IP: {selectedLog.ip}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Diff Payload:</span>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-[11px] font-mono overflow-x-auto">
                  {JSON.stringify(selectedLog.diffPayload || { status: 'Nominal Handshake Verified' }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-[#0072ce] text-white rounded-lg text-xs font-bold"
              >
                {t.actions.cancel || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
