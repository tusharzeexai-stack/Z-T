import React, { useState } from 'react';
import { 
  Bell, 
  Video, 
  Search, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut,
  UserCheck,
  Building,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { useRBAC, ROLE_PERMISSIONS_MAP } from '../context/RBACContext';

interface HeaderProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenNotifications?: () => void;
  onToggleNotifications?: () => void;
  onOpenSystemStatus?: () => void;
  onOpenSearch?: () => void;
  unreadAlertCount?: number;
  unreadAlertsCount?: number;
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onToggleNotifications,
  onOpenSystemStatus,
  onOpenSearch,
  unreadAlertCount = 3,
  unreadAlertsCount = 3,
  activeTab = 'overview',
  onNavigateTab = (_tab: string) => {},
  onLogout
}) => {
  const effectiveAlertCount = unreadAlertCount || unreadAlertsCount;
  const handleNotifyClick = onToggleNotifications || onOpenNotifications || (() => {});
  const { currentUser, currentRole } = useRBAC();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRoleLabel = ROLE_PERMISSIONS_MAP[currentRole]?.label || currentRole;

  return (
    <header className="w-full bg-[#06152B] text-white border-b border-[#0D2342] select-none sticky top-0 z-40">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Mobile Menu Toggle & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(p => !p)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              title="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div 
              className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group shrink-0" 
              onClick={() => onNavigateTab('overview')}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition shrink-0">
                <div className="w-full h-full rounded bg-[#0052CC] flex items-center justify-center text-white font-black text-xs">
                  <Video className="w-4 h-4 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-xs sm:text-base font-bold text-white tracking-tight leading-tight">
                    Z-TRACS <span className="font-light text-slate-400 hidden xs:inline">|</span> <span className="hidden sm:inline">Centralised CCTV Registry</span>
                  </h1>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                  GUJARAT POLICE <span className="text-slate-500">|</span> <span className="hidden xs:inline">GOVERNMENT OF GUJARAT</span>
                </p>
              </div>
            </div>
          </div>

          {/* Center: System Status Pill */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenSystemStatus}
              className="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#08281D] hover:bg-[#0c3929] border border-[#14533C] text-[#22C55E] text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Click to view Subsystem Diagnostics"
            >
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span className="tracking-wide uppercase text-[11px] font-bold">SYSTEM OPERATIONAL</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs rounded-full transition"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Global Search...</span>
              <kbd className="px-1.5 py-0.2 bg-slate-900 text-[10px] font-mono rounded text-slate-400">⌘K</kbd>
            </button>
          </div>

          {/* Right: Controls & Logged-In User Profile Dropdown */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Mobile Search Icon */}
            <button 
              onClick={onOpenSearch}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-slate-800/60 transition"
              title="Global Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Bell Icon with Notification Badge */}
            <button
              onClick={handleNotifyClick}
              className="relative p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-slate-800/60 transition"
              title="System Alerts & Telemetry"
            >
              <Bell className="w-4 h-4" />
              {effectiveAlertCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#06152B]"></span>
              )}
            </button>

            {/* Logged-In User Profile Badge */}
            <div className="relative pl-1.5 sm:pl-2 border-l border-slate-700/60">
              <button
                onClick={() => setIsProfileDropdownOpen(p => !p)}
                className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-blue-400/60"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] font-semibold text-blue-400 uppercase tracking-wider">
                    {userRoleLabel}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xs:block" />
              </button>

              {/* Logged-In User Profile Card Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 w-64 sm:w-72 text-xs text-slate-800 animate-in fade-in">
                  
                  {/* User Profile Header */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0052CC]"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {currentUser.name}
                      </div>
                      <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-blue-50 text-[#0052CC] font-bold text-[10px] uppercase font-mono">
                        {userRoleLabel}
                      </div>
                    </div>
                  </div>

                  {/* Account Details List */}
                  <div className="py-2.5 space-y-2 text-slate-600 border-b border-slate-100 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono font-bold text-slate-800">{currentUser.badge}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser.departmentName || 'Gujarat Police'}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{currentUser.district || 'Statewide Jurisdiction'}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-[10px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Authenticated Session Active</span>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  {onLogout && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg font-bold text-rose-600 hover:bg-rose-50 transition flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out / Log Out</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-mono">Exit</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </header>
  );
};
