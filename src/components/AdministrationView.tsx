import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Server, 
  Key, 
  Activity, 
  FileSpreadsheet, 
  Lock, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Database,
  Layers,
  Cpu,
  Download,
  RefreshCw
} from 'lucide-react';
import { User, VmsReference, SubsystemStatus, UserRole } from '../types';
import { INITIAL_USERS, INITIAL_VMS_REFERENCES, INITIAL_SUBSYSTEMS } from '../data/mockData';
import { ROLE_PERMISSIONS_MAP } from '../context/RBACContext';

export const AdministrationView: React.FC = () => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'roles' | 'vms' | 'system' | 'api' | 'templates'>('users');
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  const [vmsList, setVmsList] = useState<VmsReference[]>(INITIAL_VMS_REFERENCES);
  const [subsystems, setSubsystems] = useState<SubsystemStatus[]>(INITIAL_SUBSYSTEMS);

  const [userSearch, setUserSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Filtered users
  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.badge.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF3FA] text-[#0052CC] border border-blue-200">
              System Administration
            </span>
            <span className="text-xs text-slate-500 font-medium">Statewide Governance & Policy Suite</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Z-TRACS Administrative Control Center</h1>
        </div>

        {/* Sub-tab Pill Navigation */}
        <div className="flex items-center bg-[#EDF3FA] p-1 rounded-lg border border-slate-200 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'users', label: 'User Directory' },
            { id: 'roles', label: 'RBAC Matrix' },
            { id: 'vms', label: 'VMS Inventory' },
            { id: 'system', label: 'System Status' },
            { id: 'api', label: 'Registry API' },
            { id: 'templates', label: 'Import Schemas' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeAdminSubTab === tab.id 
                  ? 'bg-[#0052CC] text-white shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: USER DIRECTORY */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name, badge ID, or role..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-lg hover:bg-[#0041A8] transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Provision User Account</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#00253e] text-white text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3">User & Badge</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">System Role</th>
                  <th className="p-3">Jurisdiction Scope</th>
                  <th className="p-3">Last Login</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 flex items-center space-x-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.badge}</div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0052CC] border border-blue-200 font-bold text-[10px]">
                        {ROLE_PERMISSIONS_MAP[u.role]?.label || u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {u.district ? `District: ${u.district}` : u.departmentName ? `Dept: ${u.departmentName}` : 'Statewide (All)'}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{u.lastLogin}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RBAC MATRIX */}
      {activeAdminSubTab === 'roles' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enforced at action and route execution levels across Z-TRACS Model 1.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-[#00253e] text-white text-[10px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-700">Role Title</th>
                  <th className="p-3 text-center">Create Node</th>
                  <th className="p-3 text-center">Edit Node</th>
                  <th className="p-3 text-center">Archive Node</th>
                  <th className="p-3 text-center">Maintenance</th>
                  <th className="p-3 text-center">Bulk Import</th>
                  <th className="p-3 text-center">Export Reports</th>
                  <th className="p-3 text-center">Manage Users</th>
                  <th className="p-3 text-center">Scope Restriction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(Object.keys(ROLE_PERMISSIONS_MAP) as UserRole[]).map(rKey => {
                  const perm = ROLE_PERMISSIONS_MAP[rKey];
                  return (
                    <tr key={rKey} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                        <div>{perm.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{perm.description}</div>
                      </td>
                      <td className="p-3 text-center font-bold">{perm.canCreateCamera ? '✅' : '❌'}</td>
                      <td className="p-3 text-center font-bold">{perm.canEditCamera ? '✅' : '❌'}</td>
                      <td className="p-3 text-center font-bold">{perm.canArchiveCamera ? '✅' : '❌'}</td>
                      <td className="p-3 text-center font-bold">{perm.canMarkMaintenance ? '✅' : '❌'}</td>
                      <td className="p-3 text-center font-bold">{perm.canBulkImport ? '✅' : '❌'}</td>
                      <td className="p-3 text-center font-bold">{perm.canExportReports ? '✅' : '❌'}</td>
                      <td className="p-3 text-center font-bold">{perm.canManageUsers ? '✅' : '❌'}</td>
                      <td className="p-3 text-center font-mono text-[10px] font-bold text-[#0052CC]">
                        {perm.districtScoped ? 'District Scoped' : perm.departmentScoped ? 'Dept Scoped' : 'Statewide'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: VMS INVENTORY */}
      {activeAdminSubTab === 'vms' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">Registered VMS Reference Inventory</h3>
              <p className="text-xs text-slate-500 mt-0.5">Model 1 VMS Reference registry (Metadata sync pointers ONLY; no video federation).</p>
            </div>
            <button className="px-3 py-1.5 bg-[#0052CC] text-white text-xs font-bold rounded-lg hover:bg-[#0041A8]">
              Register New VMS System
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#00253e] text-white text-[11px] uppercase font-bold">
                <tr>
                  <th className="p-3">VMS Identifier</th>
                  <th className="p-3">Vendor & Platform</th>
                  <th className="p-3">Parent Department</th>
                  <th className="p-3">Linked Camera Count</th>
                  <th className="p-3">Protocol</th>
                  <th className="p-3">Integration Type</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {vmsList.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#0052CC]">{v.id}</td>
                    <td className="p-3 font-sans font-semibold text-slate-900">{v.systemName} ({v.vendor})</td>
                    <td className="p-3 font-sans text-slate-700">{v.department}</td>
                    <td className="p-3 font-bold text-slate-900">{v.cameraCount.toLocaleString()} Nodes</td>
                    <td className="p-3 text-slate-600">{v.protocol}</td>
                    <td className="p-3 font-sans text-slate-600">{v.integrationType}</td>
                    <td className="p-3 text-right font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SYSTEM STATUS */}
      {activeAdminSubTab === 'system' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">Subsystem Diagnostics & Status Visibility</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time health monitoring of database cluster, PostGIS vector engine, and API gateways.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-full">
              ALL SUBSYSTEMS NOMINAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subsystems.map((sub, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[10px] rounded uppercase font-mono">
                    {sub.category}
                  </span>
                  <span className="flex items-center text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {sub.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{sub.name}</h4>
                <p className="text-[11px] text-slate-500 font-mono">{sub.details}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-600 font-mono">
                  <span>Latency: <strong className="text-slate-900">{sub.latencyMs}ms</strong></span>
                  <span>Uptime: <strong className="text-emerald-700">{sub.uptimePercentage}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: REGISTRY API */}
      {activeAdminSubTab === 'api' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase">Registry Sync API Gateway Specification</h3>
          <p className="text-xs text-slate-500">FastAPI backend REST endpoints specification for Z-TRACS Model 1.</p>
          <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto">
            <p className="text-slate-400">// Model 1 FastAPI Endpoint Architecture</p>
            <p className="mt-1">GET  /api/v1/cameras            - List camera records with facets</p>
            <p>GET  /api/v1/cameras/{`{id}`}       - Fetch CameraMasterRecord detail</p>
            <p>POST /api/v1/cameras            - Provision single camera record</p>
            <p>PATCH /api/v1/cameras/{`{id}`}      - Update metadata fields</p>
            <p>POST /api/v1/cameras/{`{id}`}/archive - Archive camera with audit payload</p>
            <p>GET  /api/v1/gis/features       - GeoJSON vector feature collection</p>
            <p>GET  /api/v1/health/events      - Live telemetry incident logs</p>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: IMPORT SCHEMAS */}
      {activeAdminSubTab === 'templates' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase">Standard Import Schemas & Templates</h3>
          <p className="text-xs text-slate-500">Official CSV/XLSX headers required for bulk camera onboarding.</p>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono space-y-2">
            <span className="font-bold text-slate-900 block">Required Header Columns:</span>
            <p className="text-slate-700">camera_code, name, type, latitude, longitude, address, city, district, department_id, owner, officer_name, officer_phone, officer_email, manufacturer, model, firmware_version, resolution, network_type, vms_platform_name, endpoint_reference, storage_type, retention_days, capability_anpr</p>
            <button className="mt-2 flex items-center space-x-1.5 px-3.5 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-lg hover:bg-[#0041A8]">
              <Download className="w-4 h-4" />
              <span>Download CSV Template (.csv)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
