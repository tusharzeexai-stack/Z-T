import React, { useState } from 'react';
import { Shield, Lock, UserCheck, Video, KeyRound, ArrowRight, CheckCircle2, ShieldCheck, UserCog, Radio, BadgeCheck } from 'lucide-react';
import { UserRole, User } from '../types';
import { useRBAC } from '../context/RBACContext';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { switchUser } = useRBAC();

  const rbacRolesList: {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ElementType;
    user: User;
  }[] = [
    {
      role: 'STATE_ADMIN',
      title: 'State Administrator',
      description: 'Full statewide governance access across all departments, PostGIS maps, & system settings.',
      icon: ShieldCheck,
      user: {
        id: 'usr-001',
        name: 'Rajesh K. Sharma, IPS',
        badge: 'GJ-POL-2018-09',
        email: 'adgp.telecom@gujaratpolice.gov.in',
        role: 'STATE_ADMIN',
        departmentId: 'DEPT-POL-01',
        departmentName: 'Gujarat Police (Traffic & Law Enforcement)',
        district: 'Gandhinagar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        lastLogin: '2026-08-20 10:35:12 IST',
      }
    },
    {
      role: 'DISTRICT_ADMIN',
      title: 'District Administrator',
      description: 'Administrative control scoped to assigned district cameras, municipal assets, & gap reports.',
      icon: UserCog,
      user: {
        id: 'usr-002',
        name: 'Smt. Mona Khandhar, IAS',
        badge: 'GJ-IAS-2012-04',
        email: 'securb@gujarat.gov.in',
        role: 'DISTRICT_ADMIN',
        departmentId: 'DEPT-MNC-02',
        departmentName: 'Urban & Municipal Corporations',
        district: 'Ahmedabad',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        lastLogin: '2026-08-20 09:12:44 IST',
      }
    },
    {
      role: 'CONTROL_ROOM_OPERATOR',
      title: 'Control Room Operator',
      description: 'Live multi-camera video wall, real-time alert triage, & camera telemetry monitoring.',
      icon: Radio,
      user: {
        id: 'usr-004',
        name: 'Insp. Vikram V. Solanki',
        badge: 'GJ-POL-2020-108',
        email: 'operator.controlroom@gujarat.gov.in',
        role: 'CONTROL_ROOM_OPERATOR',
        departmentId: 'DEPT-POL-01',
        departmentName: 'Gujarat Police',
        district: 'Surat',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        lastLogin: '2026-08-20 10:30:15 IST',
      }
    },
    {
      role: 'POLICE_OFFICER',
      title: 'Police Field Officer',
      description: 'ANPR vehicle search, cross-camera journey tracking, & SHA-256 evidence vault.',
      icon: BadgeCheck,
      user: {
        id: 'usr-003',
        name: 'G. S. Malik, IPS',
        badge: 'GJ-POL-2015-22',
        email: 'cp.ahmedabad@gujaratpolice.gov.in',
        role: 'POLICE_OFFICER',
        departmentId: 'DEPT-POL-01',
        departmentName: 'Gujarat Police',
        district: 'Ahmedabad',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        lastLogin: '2026-08-20 10:01:00 IST',
      }
    }
  ];

  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const selectedPersona = rbacRolesList[selectedRoleIndex];

  const [badgeInput, setBadgeInput] = useState(selectedPersona.user.badge);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (index: number) => {
    setSelectedRoleIndex(index);
    setBadgeInput(rbacRolesList[index].user.badge);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      switchUser(selectedPersona.user);
      onLoginSuccess(selectedPersona.user);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#06152B] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#0052CC] selection:text-white select-none">
      
      {/* Top Header Branding */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg">
            <div className="w-full h-full rounded-lg bg-[#0052CC] flex items-center justify-center text-white font-black">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Z-TRACS</h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              GUJARAT POLICE • GOVERNMENT OF GUJARAT
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-[#00385C] border border-[#004B7A] text-emerald-300 text-xs font-bold rounded-md flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>OFFICIAL RBAC PORTAL ACTIVE</span>
        </span>
      </div>

      {/* Main Login Box */}
      <div className="max-w-5xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Col: Portal Description (Col 5) */}
        <div className="lg:col-span-5 text-white space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Unified Video Intelligence Platform</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Centralised Surveillance Command Center
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Statewide Asset Registry, GIS mapping, ANPR metadata analytics, multi-camera video walls, and VMS federation.
          </p>

          <div className="space-y-2 pt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>4-Role RBAC Authorization Engine</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PostGIS Spatial Vector GIS Layer</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Court-Compliant SHA-256 Evidence Vault</span>
            </div>
          </div>
        </div>

        {/* Right Col: Login Form Card (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200">
          
          <div className="border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Official Operator Authentication</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Select 4-Role RBAC Persona</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose your official role to authenticate and enter the Z-TRACS dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* 4 Role Selector Grid */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select User Account Role (4 Roles):</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rbacRolesList.map((item, index) => {
                  const isSelected = index === selectedRoleIndex;
                  const IconComp = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.role}
                      onClick={() => handleRoleSelect(index)}
                      className={`p-3 rounded-xl border text-left transition flex items-start space-x-2.5 ${
                        isSelected 
                          ? 'border-[#0052CC] bg-blue-50/90 ring-2 ring-blue-500/30' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-[#0052CC] text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">{item.title}</div>
                        <div className="text-[10px] font-semibold text-[#0052CC] font-mono mt-0.5">{item.user.name.split(',')[0]}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Badge Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Official Badge / Employee ID:</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-[#0052CC]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Passphrase / Smart Card PIN:</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:ring-1 focus:ring-[#0052CC]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#0052CC] text-white rounded-xl text-xs font-bold hover:bg-[#0041A8] transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating Credentials...' : `Log In to Dashboard as ${selectedPersona.title}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

        </div>

      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 border-t border-slate-800/80 pt-4">
        © 2026 Gujarat Police Department • Official Internal Portal • Restricted Government System
      </div>

    </div>
  );
};
