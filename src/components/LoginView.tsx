import React, { useState } from 'react';
import { Shield, Lock, UserCheck, Video, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole, User } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { ROLE_PERMISSIONS_MAP } from '../context/RBACContext';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(INITIAL_USERS[0].id);
  const [badgeInput, setBadgeInput] = useState(INITIAL_USERS[0].badge);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const selectedUser = INITIAL_USERS.find(u => u.id === selectedUserId) || INITIAL_USERS[0];

  const handleUserSelect = (u: User) => {
    setSelectedUserId(u.id);
    setBadgeInput(u.badge);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(selectedUser);
    }, 600);
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
            <h1 className="text-lg font-bold text-white tracking-tight">Z-TRACS</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              GUJARAT POLICE • GOVERNMENT OF GUJARAT
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-[#08281D] border border-[#14533C] text-[#22C55E] text-xs font-bold rounded-full flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
          <span>SECURE PORTAL ACTIVE</span>
        </span>
      </div>

      {/* Main Login Box */}
      <div className="max-w-4xl w-full mx-auto my-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Col: Portal Description (Col 5) */}
        <div className="md:col-span-5 text-white space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>State CCTV Master Registry</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Centralised Surveillance Infrastructure Registry
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Model 1 Statewide Asset Registry, GIS foundation, department inventory, health visibility, and audit ledger.
          </p>

          <div className="space-y-2 pt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict Role-Based Access Control (RBAC)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PostGIS Spatial Vector Layer Integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>SHA-256 Tamper-Evident Audit Logging</span>
            </div>
          </div>
        </div>

        {/* Right Col: Login Form Card (Col 7) */}
        <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200">
          
          <div className="border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Official Operator Authentication</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Select Persona & Login</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose one of the 5 standard RBAC roles to simulate portal access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Quick Role Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select User Account Role:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INITIAL_USERS.map(u => {
                  const perm = ROLE_PERMISSIONS_MAP[u.role];
                  const isSelected = u.id === selectedUserId;
                  return (
                    <button
                      type="button"
                      key={u.id}
                      onClick={() => handleUserSelect(u)}
                      className={`p-3 rounded-xl border text-left transition flex items-start space-x-2.5 ${
                        isSelected 
                          ? 'border-[#0052CC] bg-blue-50/80 ring-2 ring-blue-500/20' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">{u.name}</div>
                        <div className="text-[10px] font-semibold text-[#0052CC] font-mono mt-0.5">{perm.label}</div>
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
              className="w-full py-3 px-4 bg-[#0052CC] text-white rounded-xl text-xs font-bold hover:bg-[#0041A8] transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Authenticating Operator credentials...' : `Access Portal as ${ROLE_PERMISSIONS_MAP[selectedUser.role].label}`}</span>
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
