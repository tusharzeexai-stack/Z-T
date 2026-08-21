import React, { useState } from 'react';
import { Language, UserRole } from '../types';
import { useRBAC } from '../context/RBACContext';
import {
  LayoutDashboard,
  MonitorPlay,
  Tv2,
  Radio,
  ScanLine,
  Route,
  BellRing,
  FolderSearch,
  Network,
  Server,
  Plug,
  GitBranch,
  Map,
  Camera,
  UserPlus,
  Activity,
  Building2,
  Landmark,
  BarChart3,
  SlidersHorizontal,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Shield,
  Video,
  X,
  Star
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'command-center'
  | 'live-view'
  | 'sentinel-live-wall'
  | 'anpr-search'
  | 'vehicle-journey'
  | 'alerts'
  | 'investigations'
  | 'federation-overview'
  | 'vms-management'
  | 'connectors'
  | 'event-flow'
  | 'gis'
  | 'registry'
  | 'onboarding'
  | 'health'
  | 'departments'
  | 'districts'
  | 'gap-analysis'
  | 'reports'
  | 'administration'
  | 'audit';

interface NavigationProps {
  activeTab: string;
  onSelectTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  currentLang?: Language;
  healthAlertsCount?: number;
  criticalGapsCount?: number;
  activeAlertsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const ROLE_ALLOWED_TABS: Record<UserRole, NavTab[]> = {
  STATE_ADMIN: [
    'overview', 'sentinel-live-wall', 'command-center', 'live-view', 'anpr-search', 'alerts',
    'gis', 'vehicle-journey', 'registry', 'onboarding', 'health', 'investigations',
    'administration', 'audit', 'reports', 'gap-analysis', 'departments', 'districts',
    'federation-overview', 'vms-management', 'connectors', 'event-flow'
  ],
  DISTRICT_ADMIN: [
    'overview', 'sentinel-live-wall', 'command-center', 'live-view', 'anpr-search', 'alerts',
    'gis', 'vehicle-journey', 'registry', 'onboarding', 'health',
    'administration', 'audit', 'reports', 'gap-analysis', 'districts'
  ],
  DEPARTMENT_ADMIN: [
    'overview', 'sentinel-live-wall', 'command-center', 'live-view', 'gis', 'registry', 'onboarding',
    'health', 'administration', 'audit', 'reports', 'departments'
  ],
  DISTRICT_OFFICER: [
    'overview', 'sentinel-live-wall', 'command-center', 'live-view', 'anpr-search', 'alerts',
    'gis', 'vehicle-journey', 'registry', 'health', 'reports', 'districts', 'gap-analysis'
  ],
  CONTROL_ROOM_OPERATOR: [
    'sentinel-live-wall', 'command-center', 'live-view', 'anpr-search', 'alerts',
    'gis', 'vehicle-journey', 'health'
  ],
  POLICE_OFFICER: [
    'anpr-search', 'vehicle-journey', 'alerts', 'investigations',
    'sentinel-live-wall', 'command-center', 'live-view', 'gis', 'registry', 'reports', 'audit'
  ],
  STATE_AUDITOR: [
    'overview', 'gis', 'registry', 'health', 'reports', 'audit'
  ]
};

// Sidebar group definitions with IMPORTANT TOP SECTIONS first
const NAV_GROUPS: {
  label: string;
  isImportant?: boolean;
  items: { id: NavTab; label: string; shortLabel: string; icon: React.ElementType; badge?: 'alerts' | 'health' }[]
}[] = [
  {
    label: '⭐ IMPORTANT — CORE OPERATIONS',
    isImportant: true,
    items: [
      { id: 'overview', label: 'Overview Dashboard', shortLabel: 'Overview', icon: LayoutDashboard },
      { id: 'sentinel-live-wall', label: 'Sentinel Live (31 Feeds)', shortLabel: 'Sentinel', icon: Radio },
      { id: 'command-center', label: 'Command Center Video Wall', shortLabel: 'Command', icon: MonitorPlay },
      { id: 'anpr-search', label: 'ANPR Vehicle Search', shortLabel: 'ANPR', icon: ScanLine },
      { id: 'alerts', label: 'Real-Time Alert Center', shortLabel: 'Alerts', icon: BellRing, badge: 'alerts' },
      { id: 'live-view', label: 'Live Stream Grid', shortLabel: 'Live Grid', icon: Tv2 },
    ]
  },
  {
    label: 'CCTV ASSETS & MAPS',
    items: [
      { id: 'gis', label: 'CCTV GIS Spatial Map', shortLabel: 'GIS Map', icon: Map },
      { id: 'vehicle-journey', label: '3D Vehicle Journey Tracker', shortLabel: 'Journey', icon: Route },
      { id: 'registry', label: 'Camera Registry', shortLabel: 'Registry', icon: Camera },
      { id: 'onboarding', label: 'Camera Onboarding', shortLabel: 'Onboard', icon: UserPlus },
      { id: 'health', label: 'Health Telemetry', shortLabel: 'Health', icon: Activity, badge: 'health' },
      { id: 'investigations', label: 'Case Investigations', shortLabel: 'Invest.', icon: FolderSearch },
    ]
  },
  {
    label: 'USER ADMIN & GOVERNANCE',
    items: [
      { id: 'administration', label: 'User Admin & Access Control', shortLabel: 'User Admin', icon: SlidersHorizontal },
      { id: 'audit', label: 'Immutable Audit Ledger', shortLabel: 'Audit', icon: ClipboardList },
      { id: 'reports', label: 'Official Reports Generator', shortLabel: 'Reports', icon: BarChart3 },
      { id: 'gap-analysis', label: 'Gap Analysis DPR', shortLabel: 'Gap DPR', icon: Landmark },
      { id: 'departments', label: 'Department Registry', shortLabel: 'Depts', icon: Building2 },
      { id: 'districts', label: 'District Jurisdiction', shortLabel: 'Districts', icon: Landmark },
    ]
  },
  {
    label: 'FEDERATION & PIPELINE',
    items: [
      { id: 'federation-overview', label: 'VMS Federation Overview', shortLabel: 'Federation', icon: Network },
      { id: 'vms-management', label: 'VMS Reference Systems', shortLabel: 'VMS', icon: Server },
      { id: 'connectors', label: 'VMS Connectors', shortLabel: 'Conn.', icon: Plug },
      { id: 'event-flow', label: 'Event Pipeline DLQ', shortLabel: 'Events', icon: GitBranch },
    ]
  }
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onTabChange,
  healthAlertsCount = 0,
  activeAlertsCount = 0,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { currentRole } = useRBAC();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    if (onTabChange) onTabChange(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const allowedTabs = ROLE_ALLOWED_TABS[currentRole] || ROLE_ALLOWED_TABS.STATE_ADMIN;

  const renderNavContent = () => (
    <div className="flex flex-col h-full select-none">
      
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-[#00385C] flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-[#0072CE] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
            ZT
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <div className="font-extrabold text-white text-xs tracking-wider uppercase">Z-TRACS GRID</div>
              <div className="text-[10px] text-slate-400 font-mono">Gujarat Police</div>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1 text-slate-400 hover:text-white rounded hover:bg-[#00385C] transition"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1 text-slate-400 hover:text-white rounded hover:bg-[#00385C]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 px-2 no-scrollbar">
        {NAV_GROUPS.map((group, gIdx) => {
          const visibleItems = group.items.filter(item => allowedTabs.includes(item.id));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              
              {/* Section Header Label */}
              {!isCollapsed ? (
                <div className={`px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase flex items-center justify-between ${
                  group.isImportant ? 'text-amber-400 bg-amber-500/10 rounded border border-amber-500/20 my-1' : 'text-slate-400'
                }`}>
                  <span className="flex items-center space-x-1">
                    {group.isImportant && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                    <span>{group.label}</span>
                  </span>
                </div>
              ) : (
                <div className="w-full border-t border-[#00385C] my-2" />
              )}

              {/* Group Nav Buttons */}
              {visibleItems.map(item => {
                const isActive = activeTab === item.id;
                const IconComp = item.icon;

                let badgeCount = 0;
                if (item.badge === 'alerts') badgeCount = activeAlertsCount;
                if (item.badge === 'health') badgeCount = healthAlertsCount;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isActive 
                        ? 'bg-[#0072CE] text-white shadow-sm ring-1 ring-blue-300/30 font-bold' 
                        : 'text-slate-300 hover:bg-[#00385C] hover:text-white'
                    } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && badgeCount > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        item.badge === 'alerts' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer Role Card */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#00385C] bg-[#001D31]">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-[#0072CE]" />
            <span className="font-mono text-[10px] text-emerald-400 font-bold">STATE WAN SECURED</span>
          </div>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-[#00253E] border-r border-[#00385C] text-white transition-all duration-300 h-screen sticky top-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile}
          />
          <div className="relative w-72 bg-[#00253E] h-full shadow-2xl z-10">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
};
