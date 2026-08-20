import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, UserCheck, Video, KeyRound, ArrowRight,
  ShieldCheck, UserCog, Radio, BadgeCheck, Eye, EyeOff,
  AlertTriangle, Clock, Globe, Building2, ChevronRight
} from 'lucide-react';
import { UserRole, User } from '../types';
import { useRBAC } from '../context/RBACContext';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { switchUser } = useRBAC();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const rbacRolesList: {
    role: UserRole;
    title: string;
    titleHi: string;
    description: string;
    accessLevel: string;
    icon: React.ElementType;
    color: string;
    user: User;
  }[] = [
    {
      role: 'STATE_ADMIN',
      title: 'State Administrator',
      titleHi: 'રાજ્ય વહીવટકર્તા',
      description: 'Full statewide governance, all departments, system configuration',
      accessLevel: 'LEVEL 5 — TOP SECRET',
      icon: ShieldCheck,
      color: '#1a3a6b',
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
      titleHi: 'જિલ્લા વહીવટકર્તા',
      description: 'District-scoped admin, cameras, gap reports, municipal assets',
      accessLevel: 'LEVEL 4 — RESTRICTED',
      icon: UserCog,
      color: '#1a4a3a',
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
      titleHi: 'કંટ્રોલ રૂમ ઓપરેટર',
      description: 'Live video wall, alert triage, camera telemetry monitoring',
      accessLevel: 'LEVEL 3 — CONFIDENTIAL',
      icon: Radio,
      color: '#3a2a1a',
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
      titleHi: 'પોલીસ ક્ષેત્ર અધિકારી',
      description: 'ANPR search, vehicle journey tracking, evidence vault access',
      accessLevel: 'LEVEL 3 — CONFIDENTIAL',
      icon: BadgeCheck,
      color: '#2a1a3a',
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

  const selectedPersona = rbacRolesList[selectedRoleIndex];
  const [badgeInput, setBadgeInput] = useState(selectedPersona.user.badge);
  const [passwordInput, setPasswordInput] = useState('');

  const handleRoleSelect = (index: number) => {
    setSelectedRoleIndex(index);
    setBadgeInput(rbacRolesList[index].user.badge);
    setLoginError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!badgeInput.trim()) { setLoginError('Employee / Badge ID is required.'); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      switchUser(selectedPersona.user);
      onLoginSuccess(selectedPersona.user);
    }, 1200);
  };

  const dateStr = currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour12: false });

  return (
    <div className="min-h-screen flex flex-col font-sans select-none" style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d1f3c 40%, #0a1628 100%)' }}>

      {/* ── GOI-style Top Tricolor Bar ── */}
      <div className="flex h-1.5 w-full flex-shrink-0">
        <div className="flex-1" style={{ background: '#FF9933' }}></div>
        <div className="flex-1" style={{ background: '#FFFFFF' }}></div>
        <div className="flex-1" style={{ background: '#138808' }}></div>
      </div>

      {/* ── Official GOI Top Navigation Bar ── */}
      <div className="bg-[#1a2744] border-b border-[#243560] py-2 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4 text-[11px] text-slate-300 font-medium">
          <span className="flex items-center space-x-1.5">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>Government of Gujarat — Official Portal</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Screen Reader Access</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Skip to Main Content</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="font-mono">{timeStr} IST</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[10px]">{dateStr}</span>
        </div>
      </div>

      {/* ── Portal Header with Emblem ── */}
      <div className="bg-[#14224a] border-b border-[#1e2e5a] py-5 px-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Left: Emblem + Title */}
          <div className="flex items-center space-x-5">
            {/* Govt Emblem Placeholder */}
            <div className="w-16 h-16 rounded-full bg-[#0052CC] border-2 border-[#3373d1] flex items-center justify-center shadow-xl flex-shrink-0">
              <div className="text-center">
                <Shield className="w-8 h-8 text-white mx-auto" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-0.5">
                भारत सरकार · Government of India
              </div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">
                Z-TRACS — Centralised Video Surveillance System
              </h1>
              <div className="text-[11px] text-slate-300 mt-0.5 font-medium">
                Gujarat Police • Home Department • Government of Gujarat
              </div>
            </div>
          </div>

          {/* Right: Logos / portal badges */}
          <div className="hidden md:flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-emerald-900/50 border border-emerald-700/60 text-emerald-300 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SYSTEM OPERATIONAL</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400">
              <Building2 className="w-3 h-3" />
              <span>NIC Hosted • ISO 27001:2022 Certified</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="bg-[#0f1b38] border-b border-[#192240] py-2 px-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center space-x-1.5 text-[11px] text-slate-400">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span>Secure Login</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-400 font-semibold">RBAC Authentication Portal</span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT INFO PANEL ── */}
          <div className="lg:col-span-5 text-white space-y-6">

            {/* Notice Box */}
            <div className="bg-amber-900/20 border border-amber-700/40 rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 text-xs font-bold">AUTHORISED ACCESS ONLY</p>
                <p className="text-amber-200/80 text-[11px] mt-1 leading-relaxed">
                  This system is for authorised Government officials only. All access is logged, monitored, and subject to the IT Act 2000, Section 66.
                </p>
              </div>
            </div>

            {/* Portal Description */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3 flex items-center space-x-2">
                <div className="flex-1 h-px bg-slate-700"></div>
                <span>About This Portal</span>
                <div className="flex-1 h-px bg-slate-700"></div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                The <strong className="text-white">Z-TRACS Unified Video Intelligence Platform</strong> provides centralised access to statewide CCTV camera networks, live video walls, ANPR metadata analytics, GIS mapping, and VMS federation across all Gujarat districts.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5">
              {[
                { icon: '🔐', label: 'Role-Based Access Control (RBAC)', sub: '4-tier hierarchical authorisation' },
                { icon: '🗺️', label: 'PostGIS Spatial Vector GIS', sub: '12,482 cameras mapped statewide' },
                { icon: '🚗', label: 'ANPR Vehicle Intelligence', sub: 'AI-powered plate recognition & journey' },
                { icon: '🔒', label: 'SHA-256 Evidence Vault', sub: 'Court-compliant forensic chain of custody' },
                { icon: '📡', label: 'Live VMS Federation', sub: 'Multi-vendor camera system integration' },
              ].map(f => (
                <div key={f.label} className="flex items-start space-x-3 bg-[#1a2744]/60 border border-[#243560]/80 rounded-lg px-3 py-2.5">
                  <span className="text-base mt-0.5">{f.icon}</span>
                  <div>
                    <div className="text-white text-[11px] font-bold">{f.label}</div>
                    <div className="text-slate-400 text-[10px]">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* NIC Footer Notice */}
            <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-500 space-y-0.5 leading-relaxed">
              <p>⚠ Unauthorised access is a criminal offence under the IT Act 2000.</p>
              <p>🔒 This connection is encrypted with TLS 1.3.</p>
              <p>🖥 Best viewed in Chrome 120+ / Edge 120+ at 1280px resolution.</p>
            </div>
          </div>

          {/* ── RIGHT: LOGIN FORM ── */}
          <div className="lg:col-span-7">

            {/* Card */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">

              {/* Card Header */}
              <div className="bg-[#1a2744] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0052CC] flex items-center justify-center shadow">
                    <Lock className="w-4.5 h-4.5 text-white w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Secure Operator Login</div>
                    <div className="text-slate-400 text-[10px]">RBAC Authentication • Restricted Access</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">Session</div>
                  <div className="font-mono text-[10px] text-emerald-400">ENCRYPTED</div>
                </div>
              </div>

              {/* Divider with classification */}
              <div className="bg-[#0052CC] py-1.5 px-6 flex items-center justify-center space-x-2">
                <Shield className="w-3 h-3 text-white/80" />
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">
                  Official Government Portal — For Authorised Personnel Only
                </span>
                <Shield className="w-3 h-3 text-white/80" />
              </div>

              <div className="p-6 sm:p-7">
                <form onSubmit={handleLogin} className="space-y-5">

                  {/* Step 1: Role Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Step 1 — Select Your Official Role
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">4 Roles</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rbacRolesList.map((item, index) => {
                        const isSelected = index === selectedRoleIndex;
                        const IconComp = item.icon;
                        return (
                          <button
                            type="button"
                            key={item.role}
                            onClick={() => handleRoleSelect(index)}
                            className={`group text-left rounded-lg border-2 transition-all duration-150 overflow-hidden ${
                              isSelected
                                ? 'border-[#0052CC] shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {/* Role Card Top Bar */}
                            <div className={`px-3 py-1.5 flex items-center justify-between ${isSelected ? 'bg-[#0052CC]' : 'bg-slate-100 group-hover:bg-slate-200'} transition`}>
                              <div className="flex items-center space-x-1.5">
                                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                                  {item.title}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                              )}
                            </div>
                            {/* Role Card Body */}
                            <div className={`px-3 py-2 ${isSelected ? 'bg-blue-50' : 'bg-white'} transition`}>
                              <div className="text-[10px] font-semibold text-slate-500 mb-0.5">{item.titleHi}</div>
                              <div className="text-[10px] font-bold text-slate-800 font-mono mb-1">{item.user.name}</div>
                              <div className={`text-[9px] font-bold uppercase tracking-wider inline-block px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {item.accessLevel}
                              </div>
                              <div className="text-[9px] text-slate-500 mt-1 leading-tight line-clamp-1">{item.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Horizontal Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-[10px] text-slate-400 uppercase tracking-wider font-bold">Step 2 — Enter Credentials</span>
                    </div>
                  </div>

                  {/* Badge / Employee ID */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                      Employee ID / Badge Number
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        id="badge-input"
                        value={badgeInput}
                        onChange={e => { setBadgeInput(e.target.value); setLoginError(''); }}
                        placeholder="e.g. GJ-POL-2018-09"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100 transition placeholder:font-normal placeholder:text-slate-400"
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  {/* Passphrase */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                      Passphrase / Smart Card PIN
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password-input"
                        value={passwordInput}
                        onChange={e => { setPasswordInput(e.target.value); setLoginError(''); }}
                        placeholder="Enter your secure passphrase"
                        className="w-full pl-9 pr-10 py-2.5 bg-white border-2 border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100 transition placeholder:font-normal placeholder:text-slate-400"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {loginError && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Terms Acknowledgement */}
                  <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <input type="checkbox" id="agree-terms" defaultChecked className="mt-0.5 accent-[#0052CC]" required />
                    <label htmlFor="agree-terms" className="text-[10px] text-amber-800 leading-relaxed cursor-pointer">
                      I acknowledge that I am an authorised Government employee and that my access is being logged and monitored in accordance with the <strong>IT Act 2000</strong> and applicable Government policies.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    id="login-submit-btn"
                    className="w-full py-3 px-6 rounded-lg text-sm font-bold text-white flex items-center justify-center space-x-2.5 transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: isLoading
                        ? '#6b7280'
                        : 'linear-gradient(90deg, #0041A8 0%, #0052CC 50%, #0066FF 100%)',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>Authenticating — Please wait…</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Login as {selectedPersona.title}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Help Links */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <a href="#" className="hover:text-[#0052CC] transition underline-offset-2 hover:underline">Forgot Badge ID / Password?</a>
                    <span className="text-slate-300">|</span>
                    <a href="#" className="hover:text-[#0052CC] transition underline-offset-2 hover:underline">Contact NIC Help Desk</a>
                    <span className="text-slate-300">|</span>
                    <a href="#" className="hover:text-[#0052CC] transition underline-offset-2 hover:underline">IT Grievance</a>
                  </div>

                </form>
              </div>

              {/* Card Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>TLS 1.3 Encrypted Connection</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                  <span>Version 3.4.1</span>
                  <span>•</span>
                  <span>NIC MeitY Hosted</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ── Official Footer ── */}
      <div className="bg-[#0d1527] border-t border-[#1a2540] mt-4 flex-shrink-0">
        {/* Top Footer */}
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">Gujarat Police</div>
            <div className="text-slate-400 text-[10px] leading-relaxed">
              Police Headquarters, Sector 18,<br/>
              Gandhinagar — 382 018, Gujarat, India<br/>
              📞 100 / 1090 / 1091
            </div>
          </div>
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">Home Department</div>
            <div className="text-slate-400 text-[10px] leading-relaxed">
              Government of Gujarat<br/>
              Sachivalaya, Gandhinagar — 382 010<br/>
              🌐 www.gujarat.gov.in
            </div>
          </div>
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">Technical Support</div>
            <div className="text-slate-400 text-[10px] leading-relaxed">
              NIC Gujarat State Centre<br/>
              Bloc No. 16, CGO Complex, Sector 10A<br/>
              📧 support.nic-gujarat@nic.in
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1a2540] bg-[#090f1e]">
          {/* Tricolor bar bottom */}
          <div className="flex h-1 w-full">
            <div className="flex-1" style={{ background: '#FF9933' }}></div>
            <div className="flex-1" style={{ background: '#FFFFFF' }}></div>
            <div className="flex-1" style={{ background: '#138808' }}></div>
          </div>
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-[10px] text-slate-500">
              © 2026 Gujarat Police Department & Government of Gujarat. All rights reserved.
            </div>
            <div className="flex items-center space-x-3 text-[10px] text-slate-500">
              <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-slate-300 transition">Terms of Use</a>
              <span>|</span>
              <a href="#" className="hover:text-slate-300 transition">Accessibility</a>
              <span>|</span>
              <a href="#" className="hover:text-slate-300 transition">Site Map</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
