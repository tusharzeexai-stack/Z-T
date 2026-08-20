import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Download, 
  LayoutGrid, 
  Table as TableIcon, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Phone, 
  TrendingUp, 
  Radar, 
  Shield 
} from 'lucide-react';
import { District, Language } from '../types';
import { translations } from '../data/translations';

interface DistrictsViewProps {
  districts: District[];
  currentLang?: Language;
  onSelectDistrict: (district: District) => void;
}

export const DistrictsView: React.FC<DistrictsViewProps> = ({
  districts = [],
  onSelectDistrict,
}) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [filterZone, setFilterZone] = useState('All');

  const zones = ['All', 'Central Gujarat', 'South Gujarat', 'Saurashtra', 'North Gujarat', 'Kutch'];

  const filteredDistricts = districts.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.headquarters && d.headquarters.toLowerCase().includes(search.toLowerCase())) ||
      (d.zone && d.zone.toLowerCase().includes(search.toLowerCase()));
    const matchZone = filterZone === 'All' || d.zone === filterZone;
    return matchSearch && matchZone;
  });

  const totalRegisteredCameras = districts.reduce((acc, d) => acc + (d.totalCameras || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">
            Registered District Assets
          </span>
          <div className="text-2xl font-black text-[#0072ce] font-mono mt-1">{totalRegisteredCameras.toLocaleString()}</div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +2.4% statewide expansion
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">
            Nominal Health Index
          </span>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">94.8% Nominal</div>
          <span className="text-xs text-slate-500 mt-1">
            High reliability across 33 Districts & SP Commands
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">
            Priority Coverage Gaps
          </span>
          <div className="text-2xl font-black text-amber-600 font-mono mt-1">42 Locations</div>
          <span className="text-xs text-slate-500 mt-1">
            Identified for Phase-3 Camera Deployment
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3 flex-1 min-w-[280px] max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search district, HQ, or zone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0072ce]"
            />
          </div>

          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#0072ce]"
          >
            {zones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition ${viewMode === 'table' ? 'bg-white text-[#0072ce] shadow-2xs' : 'text-slate-500'}`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white text-[#0072ce] shadow-2xs' : 'text-slate-500'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#00253e] text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">District</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Headquarters</th>
                  <th className="p-3">Total Cameras</th>
                  <th className="p-3">Online Rate</th>
                  <th className="p-3">Critical Gaps</th>
                  <th className="p-3">SP / CP Contact</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDistricts.map((d: any) => {
                  const onlineVal = d.onlinePercentage ?? d.onlineRate ?? 95;
                  const gapsVal = d.criticalGapsCount ?? d.criticalGaps ?? 0;
                  const officerName = d.nodalSp ?? d.spContact?.officer ?? 'SP Control Room';
                  const officerPhone = d.controlRoomContact ?? d.spContact?.phone ?? '079-23250000';

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">
                        <div>{d.name}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{d.headquarters}, {d.zone}</div>
                      </td>
                      <td className="p-3 text-slate-600">{d.zone}</td>
                      <td className="p-3 text-slate-600">{d.headquarters}</td>
                      <td className="p-3 font-mono font-bold text-[#0072ce]">{d.totalCameras.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          onlineVal >= 95 ? 'bg-emerald-100 text-emerald-800' :
                          onlineVal >= 90 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {onlineVal}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-mono font-bold ${gapsVal > 2 ? 'text-[#d9222a]' : 'text-slate-600'}`}>
                          {gapsVal} Gaps
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">
                        <div>{officerName}</div>
                        <div className="text-slate-400">{officerPhone}</div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectDistrict(d)}
                          className="px-3 py-1 bg-[#0072ce] hover:bg-[#005bb5] text-white rounded text-[11px] font-bold shadow-2xs"
                        >
                          Inspect District
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDistricts.map((d: any) => {
            const onlineVal = d.onlinePercentage ?? d.onlineRate ?? 95;
            const gapsVal = d.criticalGapsCount ?? d.criticalGaps ?? 0;
            const officerName = d.nodalSp ?? d.spContact?.officer ?? 'SP Control Room';
            const officerPhone = d.controlRoomContact ?? d.spContact?.phone ?? '079-23250000';

            return (
              <div
                key={d.id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-[#0072ce] transition flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{d.name}</h3>
                      <p className="text-xs text-slate-500">{d.headquarters} • {d.zone}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      onlineVal >= 95 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {onlineVal}% Online
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Total Cameras</span>
                      <span className="font-mono font-bold text-[#0072ce] text-base">{d.totalCameras.toLocaleString()}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Critical Gaps</span>
                      <span className="font-mono font-bold text-amber-600 text-base">{gapsVal}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                    <p className="font-semibold text-slate-800">{officerName}</p>
                    <p className="text-slate-500 font-mono">{officerPhone}</p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDistrict(d)}
                  className="w-full py-2 bg-[#0072ce] hover:bg-[#005bb5] text-white rounded-lg text-xs font-bold transition shadow-2xs"
                >
                  View District Nodes →
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
