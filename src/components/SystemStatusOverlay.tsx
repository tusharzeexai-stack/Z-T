import React from 'react';
import { X, CheckCircle2, Activity, Database, Server, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { SubsystemStatus } from '../types';
import { INITIAL_SUBSYSTEMS } from '../data/mockData';

interface SystemStatusOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusOverlay: React.FC<SystemStatusOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">System Subsystem Diagnostics</h3>
              <p className="text-[11px] text-slate-500 font-mono">Gujarat Police SDC Primary Cluster • Status Visibility</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Status Banner */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold">ALL SUBSYSTEMS NOMINAL (99.9% Overall Health)</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 font-bold">LATENCY AVG: 16ms</span>
        </div>

        {/* Subsystems List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {INITIAL_SUBSYSTEMS.map((sub, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[9px] rounded uppercase font-mono">
                  {sub.category}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {sub.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900">{sub.name}</h4>
              <p className="text-[11px] text-slate-500 font-mono">{sub.details}</p>
              <div className="pt-1.5 border-t border-slate-200 flex justify-between text-[10px] text-slate-600 font-mono">
                <span>Latency: <strong className="text-slate-900">{sub.latencyMs}ms</strong></span>
                <span>Uptime: <strong className="text-emerald-700">{sub.uptimePercentage}%</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Read-only telemetry snapshot • Real-time monitor</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0052CC] text-white rounded-lg font-bold text-xs hover:bg-[#0041A8] transition"
          >
            Dismiss Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
};
