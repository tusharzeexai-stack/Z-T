import React, { useState } from 'react';
import { 
  Radar, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Download, 
  FileSpreadsheet, 
  Cpu, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  FileCheck, 
  Shield 
} from 'lucide-react';
import { GapArea, Language } from '../types';
import { translations } from '../data/translations';

interface GapAnalysisViewProps {
  gapAreas: GapArea[];
  currentLang?: Language;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  gapAreas = [],
}) => {
  const [filterPriority, setFilterPriority] = useState('All');
  const [proposalGenerated, setProposalGenerated] = useState(false);

  const filteredGaps = gapAreas.filter(g => {
    if (filterPriority === 'All') return true;
    return g.priority === filterPriority;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Statewide Density & Blindspot Index */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Coverage Index Gauge */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">
            Statewide Density Index
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-black text-emerald-600 font-mono">78.4%</span>
            <span className="text-xs font-bold text-[#0072ce]">
              Target: 95.0% (2027)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div style={{ width: '78.4%' }} className="bg-[#0072ce] h-full"></div>
          </div>
          <p className="text-[11px] text-slate-500">
            Urban coverage optimal; arterial expansion underway in border corridors.
          </p>
        </div>

        {/* Critical Gaps Count */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">
            Identified High-Risk Gaps
          </span>
          <div className="text-3xl font-black text-amber-600 font-mono">42 Locations</div>
          <p className="text-xs text-amber-700">
            Interstate border & reserve highway corridors flagged
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>Low Coverage Districts:</span>
            <span className="text-slate-800 font-bold">Kutch West, Dang, Tapi</span>
          </div>
        </div>

        {/* Proposed Budget Action */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">
              100-Day Priority Action
            </span>
            <div className="text-lg font-bold text-slate-900 mt-1">₹48.5 Cr Phase-3 DPR</div>
            <p className="text-xs text-slate-500">
              Detailed Project Report submitted for Home Department approval.
            </p>
          </div>
          <button
            onClick={() => setProposalGenerated(true)}
            className="w-full py-2 bg-[#0072ce] hover:bg-[#005bb5] text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition"
          >
            <FileCheck className="w-4 h-4" />
            <span>{proposalGenerated ? 'DPR Exported!' : 'Export Gap Analysis DPR'}</span>
          </button>
        </div>

      </div>

      {/* Identified Blindspots Registry Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Radar className="w-4 h-4 text-[#0072ce]" />
              <span>
                Coverage Gap Registry & Proposed Node Deployment
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated analysis based on incident logs, traffic flow density, and arterial topology.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-[#0072ce]"
            >
              <option value="All">All Priorities</option>
              <option value="High Priority">High Priority</option>
              <option value="Medium Priority">Medium Priority</option>
              <option value="Low Priority">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#00253e] text-white text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">Location & Corridor Description</th>
                <th className="p-3">District</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Reason / Infrastructure Vulnerability</th>
                <th className="p-3">Suggested Hardware</th>
                <th className="p-3">Est. Daily Traffic</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGaps.map((gap) => (
                <tr key={gap.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-bold text-slate-900">{gap.locationDescription}</td>
                  <td className="p-3 text-slate-600">{gap.district}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      gap.priority === 'High Priority' ? 'bg-red-100 text-red-800' :
                      gap.priority === 'Medium Priority' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {gap.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{gap.reason}</td>
                  <td className="p-3 font-mono font-bold text-[#0072ce]">{gap.suggestedHardware}</td>
                  <td className="p-3 font-mono text-slate-800 font-semibold">{gap.estimatedTrafficPerDay}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-[#0072ce] border border-[#bcd7f9] text-[10px] font-bold">
                      {gap.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
