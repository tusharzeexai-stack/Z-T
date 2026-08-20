import React, { useState } from 'react';
import { SystemAlert } from '../types';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Filter, 
  Check, 
  X,
  FileCheck
} from 'lucide-react';

interface AlertCenterViewProps {
  alerts: SystemAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onNavigateToJourney: (plateNumber: string) => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  onNavigateToJourney,
}) => {
  const [activeSeverityTab, setActiveSeverityTab] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter(alt => {
    if (activeSeverityTab === 'CRITICAL' && alt.severity !== 'CRITICAL') return false;
    if (activeSeverityTab === 'HIGH' && alt.severity !== 'HIGH') return false;
    if (activeSeverityTab === 'MEDIUM' && alt.severity !== 'MEDIUM') return false;
    if (activeSeverityTab === 'RESOLVED' && alt.status !== 'RESOLVED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alt.title.toLowerCase().includes(q) ||
        alt.cameraCode.toLowerCase().includes(q) ||
        alt.district.toLowerCase().includes(q) ||
        (alt.plateNumber && alt.plateNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200 select-none">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF3FA] text-[#0052CC] border border-blue-200">
              Model 2 Alert Desk
            </span>
            <span className="text-xs text-slate-500 font-medium">Statewide Security & Telemetry Incident Operations</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Surveillance Alert Management Center</h1>
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center bg-[#EDF3FA] p-1 rounded-lg border border-slate-200 text-xs font-bold overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Incidents' },
            { id: 'CRITICAL', label: 'Critical' },
            { id: 'HIGH', label: 'High' },
            { id: 'MEDIUM', label: 'Medium' },
            { id: 'RESOLVED', label: 'Resolved' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSeverityTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeSeverityTab === tab.id 
                  ? 'bg-[#0052CC] text-white shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center space-x-3 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search alert title, camera code, district, or plate number..."
          className="w-full bg-transparent border-none text-xs text-slate-900 focus:outline-hidden"
        />
      </div>

      {/* Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            No incidents found matching active filter criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border shadow-2xs space-y-3 flex flex-col justify-between ${
                alert.severity === 'CRITICAL' 
                  ? 'bg-rose-50/40 border-rose-200' 
                  : alert.severity === 'HIGH' 
                  ? 'bg-amber-50/40 border-amber-200' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-600 text-white' :
                    alert.severity === 'HIGH' ? 'bg-amber-600 text-white' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {alert.severity} • {alert.category}
                  </span>

                  <span className="text-[11px] text-slate-500 font-mono">{alert.timestamp}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2">{alert.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{alert.notes}</p>

                <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">CAMERA CODE</span>
                    <span className="font-bold text-[#0052CC]">{alert.cameraCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">DISTRICT</span>
                    <span className="font-bold text-slate-800">{alert.district}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                {alert.plateNumber && (
                  <button
                    onClick={() => onNavigateToJourney(alert.plateNumber!)}
                    className="px-3 py-1.5 bg-[#0052CC] text-white rounded-lg font-bold hover:bg-[#0041A8] transition shadow-2xs"
                  >
                    Analyze Journey →
                  </button>
                )}

                {alert.status === 'NEW' ? (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition shadow-2xs flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge Incident</span>
                  </button>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                    ACKNOWLEDGED ({alert.acknowledgedBy || 'Operator'})
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
