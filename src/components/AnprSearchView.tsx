import React, { useState } from 'react';
import { AnprEvent, Department, District } from '../types';
import { 
  Search, 
  Filter, 
  Calendar, 
  Car, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  Eye, 
  FileText, 
  Download,
  RotateCcw,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

interface AnprSearchViewProps {
  anprEvents: AnprEvent[];
  departments: Department[];
  districts: District[];
  onSelectPlateForJourney: (plateNumber: string) => void;
  onSelectCameraByCode?: (cameraCode: string) => void;
}

export const AnprSearchView: React.FC<AnprSearchViewProps> = ({
  anprEvents,
  departments,
  districts,
  onSelectPlateForJourney,
  onSelectCameraByCode,
}) => {
  const [searchPlate, setSearchPlate] = useState('GJ01AB1234');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedVehicleType, setSelectedVehicleType] = useState('ALL');
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filtered ANPR records
  const filteredEvents = anprEvents.filter(evt => {
    if (searchPlate.trim()) {
      if (!evt.plateNumber.toLowerCase().includes(searchPlate.trim().toLowerCase())) return false;
    }
    if (selectedDept !== 'ALL' && evt.departmentId !== selectedDept) return false;
    if (selectedDistrict !== 'ALL' && evt.district !== selectedDistrict) return false;
    if (selectedVehicleType !== 'ALL' && evt.vehicleType !== selectedVehicleType) return false;
    if (watchlistOnly && !evt.watchlistFlag) return false;
    return true;
  });

  const resetFilters = () => {
    setSearchPlate('');
    setSelectedDept('ALL');
    setSelectedDistrict('ALL');
    setSelectedVehicleType('ALL');
    setWatchlistOnly(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 select-none">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF3FA] text-[#0052CC] border border-blue-200">
              Model 2 Video Intelligence
            </span>
            <span className="text-xs text-slate-500 font-medium">Automatic Number Plate Recognition (ANPR) Query</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Statewide ANPR Search Engine</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectPlateForJourney('GJ01AB1234')}
            className="px-4 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-lg hover:bg-[#0041A8] transition shadow-xs flex items-center space-x-1.5"
          >
            <span>Analyze GJ01AB1234 Journey →</span>
          </button>
        </div>
      </div>

      {/* ANPR Search Form Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Plate Number Input */}
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">License Plate Number:</label>
            <div className="relative">
              <Car className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
                placeholder="e.g. GJ01AB1234 or GJ05"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-[#0052CC]"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Department Scope:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-[#0052CC]"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">District Jurisdiction:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-[#0052CC]"
            >
              <option value="ALL">All 33 Districts</option>
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Classification:</label>
            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-[#0052CC]"
            >
              <option value="ALL">All Types</option>
              <option value="Car">Car / Sedan</option>
              <option value="SUV">SUV / MUV</option>
              <option value="Truck">Commercial Truck</option>
              <option value="Motorcycle">Motorcycle / Two-Wheeler</option>
              <option value="Bus">GSRTC Bus</option>
            </select>
          </div>

        </div>

        {/* Sub-toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 font-bold text-rose-700 cursor-pointer">
              <input
                type="checkbox"
                checked={watchlistOnly}
                onChange={(e) => setWatchlistOnly(e.target.checked)}
                className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Flagged Watchlist Matches Only</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition ${viewMode === 'table' ? 'bg-white text-[#0052CC] shadow-2xs' : 'text-slate-500'}`}
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white text-[#0052CC] shadow-2xs' : 'text-slate-500'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={resetFilters}
              className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

      </div>

      {/* ANPR Results Listing */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-[#EDF3FA] border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Found {filteredEvents.length} ANPR Detections Matching Query
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              AI Confidence Score &gt; 94% Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Plate Crop</th>
                  <th className="p-3">Plate Number</th>
                  <th className="p-3">Vehicle Details</th>
                  <th className="p-3">Camera Node</th>
                  <th className="p-3">Location & District</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">AI Confidence</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No ANPR events found for plate query "{searchPlate}"
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map(evt => (
                    <tr key={evt.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3">
                        <img src={evt.imageCropUrl} alt={evt.plateNumber} className="w-16 h-10 object-cover rounded border border-slate-300" />
                      </td>
                      <td className="p-3">
                        <div className="font-mono font-black text-slate-900 text-sm">{evt.plateNumber}</div>
                        {evt.watchlistFlag && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-mono font-bold text-[9px]">
                            CRIME BRANCH WATCHLIST
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{evt.vehicleType} • {evt.color}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Speed: {evt.speedKmh} Km/h</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#0052CC]">{evt.cameraCode}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-900">{evt.district}</div>
                        <div className="text-[11px] text-slate-500">{evt.locationDescription}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{evt.timestamp}</td>
                      <td className="p-3 font-mono">
                        <span className="font-bold text-emerald-600">{evt.confidence}%</span>
                        <div className="text-[10px] text-slate-400">Plate: {evt.plateConfidence}%</div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectPlateForJourney(evt.plateNumber)}
                          className="px-3 py-1 bg-[#0052CC] hover:bg-[#0041A8] text-white rounded text-[11px] font-bold shadow-2xs"
                        >
                          Vehicle Journey →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(evt => (
            <div key={evt.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900">
                <img src={evt.vehicleImageUrl} alt={evt.plateNumber} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-slate-900/90 px-2 py-0.5 rounded text-white font-mono font-bold text-xs border border-slate-700">
                  {evt.plateNumber}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Camera:</span>
                  <span className="font-bold text-[#0052CC]">{evt.cameraCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">{evt.district}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Time:</span>
                  <span>{evt.timestamp}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectPlateForJourney(evt.plateNumber)}
                className="w-full py-2 bg-[#0052CC] text-white font-bold text-xs rounded-lg hover:bg-[#0041A8] transition"
              >
                Analyze Journey →
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
