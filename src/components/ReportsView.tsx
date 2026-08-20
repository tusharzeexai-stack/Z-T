import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  Building2, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  FileSpreadsheet, 
  Printer, 
  Cpu, 
  Shield 
} from 'lucide-react';
import { Department, District, Language } from '../types';
import { translations } from '../data/translations';

interface ReportsViewProps {
  departments: Department[];
  districts: District[];
  currentLang?: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  departments = [],
  districts = [],
}) => {
  const [reportType, setReportType] = useState('Executive Summary');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'xlsx' | 'csv'>('pdf');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const handleGenerate = () => {
    setGeneratingReport(true);
    setReportReady(false);
    setTimeout(() => {
      setGeneratingReport(false);
      setReportReady(true);
      setTimeout(() => setReportReady(false), 5000);
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Ageing Infrastructure & Lifecycle Analyzer Banner */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#0072ce]" />
              <span>
                Infrastructure Ageing & Lifecycle Analyzer
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated categorization and replacement schedule for legacy camera hardware (7+ years).
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono">
            State Replacement Priority: HIGH
          </span>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Active Nodes</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">124,580</div>
            <span className="text-[10px] text-slate-500">Continuous 24/7</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-red-200">
            <span className="text-[10px] uppercase font-bold text-red-600">EoL Legacy (8+ yrs)</span>
            <div className="text-2xl font-black text-red-600 font-mono mt-1">38,230</div>
            <span className="text-[10px] text-red-700 font-bold">30.6% Replacement Needed</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-600">Mid-Life (3-7 yrs)</span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">48,520</div>
            <span className="text-[10px] text-amber-700">Security Patch Required</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Modern (&lt;3 yrs)</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">37,830</div>
            <span className="text-[10px] text-emerald-700">AI-Ready & 4K</span>
          </div>
        </div>

        {/* Multi-segment bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Hardware Age Distribution</span>
            <span className="font-mono text-[#0072ce] font-bold">38,230 EoL / 48,520 Mid-Life / 37,830 Modern</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div style={{ width: '30.6%' }} className="bg-red-500 h-full" title="EoL Legacy Nodes"></div>
            <div style={{ width: '39.0%' }} className="bg-amber-400 h-full" title="Mid-Life Nodes"></div>
            <div style={{ width: '30.4%' }} className="bg-emerald-500 h-full" title="Modern AI-Ready Nodes"></div>
          </div>
        </div>
      </div>

      {/* Official Government Report Builder Box */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-[#0072ce]" />
          <h3 className="text-sm font-bold text-slate-900 uppercase">
            Official Government Report Generator
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Report Template Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Report Category (12 Mandatory Categories)
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0072ce]"
            >
              <option value="1. Camera Master Inventory Report">1. Camera Master Inventory Report</option>
              <option value="2. Department Inventory Ledger">2. Department Inventory Ledger</option>
              <option value="3. District Jurisdiction Summary">3. District Jurisdiction Summary</option>
              <option value="4. Health & Uptime Telemetry Report">4. Health & Uptime Telemetry Report</option>
              <option value="5. Offline Cameras Incident Log">5. Offline Cameras Incident Log</option>
              <option value="6. Coverage & Density Index Report">6. Coverage & Density Index Report</option>
              <option value="7. Infrastructure Gap Analysis DPR">7. Infrastructure Gap Analysis DPR</option>
              <option value="8. Ageing Infrastructure Replacement Schedule">8. Ageing Infrastructure Replacement Schedule</option>
              <option value="9. Data Quality & Metadata Audit Report">9. Data Quality & Metadata Audit Report</option>
              <option value="10. VMS Reference Inventory Report">10. VMS Reference Inventory Report</option>
              <option value="11. Camera Onboarding Activity Log">11. Camera Onboarding Activity Log</option>
              <option value="12. Security Audit & Governance Ledger">12. Security Audit & Governance Ledger</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Department Scope
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0072ce]"
            >
              <option value="All Departments">All Departments</option>
              {departments.map((d, i) => (
                <option key={i} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              District Scope
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0072ce]"
            >
              <option value="All Districts">All 33 Districts</option>
              {districts.map((d, i) => (
                <option key={i} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Format Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['pdf', 'xlsx', 'csv'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setReportFormat(fmt)}
                  className={`p-2 rounded-lg font-bold uppercase transition text-center ${
                    reportFormat === fmt
                      ? 'bg-[#0072ce] text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Generate Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Generated reports include NIC digital verification watermark and official metadata signatures.
          </div>

          <button
            onClick={handleGenerate}
            disabled={generatingReport}
            className="px-6 py-2.5 bg-[#0072ce] hover:bg-[#005bb5] disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>{generatingReport ? 'Compiling Official Report...' : 'Export Official Dossier'}</span>
          </button>
        </div>

        {reportReady && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{reportType} ({reportFormat.toUpperCase()}) ready for download.</span>
            </div>
            <button
              onClick={() => {
                const dummyContent = `Z-TRACS Official Report: ${reportType}\nGenerated: ${new Date().toISOString()}\nScope: ${selectedDept} - ${selectedDistrict}\nFormat: ${reportFormat.toUpperCase()}`;
                const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `z_tracs_report_${Date.now()}.${reportFormat}`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-md text-[11px] font-bold hover:bg-emerald-800 transition"
            >
              Download File Now
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
