import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2,
  Video,
  Search,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Language, UserRole } from '../types';
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
}) => {
  const effectiveAlertCount = unreadAlertCount || unreadAlertsCount;
  const handleNotifyClick = onToggleNotifications || onOpenNotifications || (() => {});
  const { currentUser, currentRole, switchRole } = useRBAC();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'command-center', label: 'Command Center' },
    { id: 'live-view', label: 'Live Wall' },
    { id: 'anpr-search', label: 'ANPR Search' },
    { id: 'vehicle-journey', label: 'Vehicle Journey' },
    { id: 'alerts', label: 'Alert Center' },
    { id: 'investigations', label: 'Investigations' },
    { id: 'federation-overview', label: 'Federation Mesh' },
    { id: 'vms-management', label: 'VMS Platforms' },
    { id: 'connectors', label: 'Connectors' },
    { id: 'event-flow', label: 'Event Pipeline' },
    { id: 'gis', label: 'CCTV GIS' },
    { id: 'registry', label: 'Camera Registry' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'health', label: 'Health Monitoring' },
    { id: 'departments', label: 'Departments' },
    { id: 'districts', label: 'Districts' },
    { id: 'gap-analysis', label: 'Gap Analysis' },
    { id: 'reports', label: 'Reports' },
    { id: 'administration', label: 'Administration' },
    { id: 'audit', label: 'Audit' },
  ];

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

          {/* Right: Controls & User Profile Dropdown */}
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

            {/* User Profile Badge with Role Switcher */}
            <div className="relative pl-1.5 sm:pl-2 border-l border-slate-700/60">
              <button
                onClick={() => setIsRoleDropdownOpen(p => !p)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
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
                    {ROLE_PERMISSIONS_MAP[currentRole]?.label || currentRole}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xs:block" />
              </button>

              {/* Role Switcher Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 w-60 sm:w-64 text-xs text-slate-800 animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Switch User Role (Demo RBAC)
                  </div>
                  <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                    {(Object.keys(ROLE_PERMISSIONS_MAP) as UserRole[]).map(rKey => {
                      const roleItem = ROLE_PERMISSIONS_MAP[rKey];
                      const isCurrent = currentRole === rKey;
                      return (
                        <button
                          key={rKey}
                          onClick={() => {
                            switchRole(rKey);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg font-medium transition flex items-center justify-between ${
                            isCurrent ? 'bg-[#0052CC] text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="text-xs">{roleItem.label}</div>
                            <div className={`text-[10px] ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                              {rKey}
                            </div>
                          </div>
                          {isCurrent && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pb-2">
              {mobileNavItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-lg text-left transition ${
                      isActive 
                        ? 'bg-[#0052CC] text-white font-bold' 
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
