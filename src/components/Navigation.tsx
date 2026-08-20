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
}

const ROLE_ALLOWED_TABS: Record<UserRole, NavTab[]> = {
  STATE_ADMIN: [
    'overview', 'command-center', 'live-view', 'sentinel-live-wall', 'anpr-search', 'vehicle-journey',
    'alerts', 'investigations', 'federation-overview', 'vms-management', 'connectors',
    'event-flow', 'gis', 'registry', 'onboarding', 'health', 'departments',
    'districts', 'gap-analysis', 'reports', 'administration', 'audit'
  ],
  DISTRICT_ADMIN: [
    'overview', 'command-center', 'live-view', 'sentinel-live-wall', 'anpr-search', 'vehicle-journey',
    'alerts', 'gis', 'registry', 'onboarding', 'health', 'districts',
    'gap-analysis', 'reports', 'administration', 'audit'
  ],
  DEPARTMENT_ADMIN: [
    'overview', 'command-center', 'live-view', 'sentinel-live-wall', 'gis', 'registry', 'onboarding',
    'health', 'departments', 'reports', 'administration', 'audit'
  ],
  DISTRICT_OFFICER: [
    'overview', 'command-center', 'live-view', 'sentinel-live-wall', 'anpr-search', 'vehicle-journey',
    'alerts', 'gis', 'registry', 'health', 'districts', 'gap-analysis', 'reports'
  ],
  CONTROL_ROOM_OPERATOR: [
    'command-center', 'live-view', 'sentinel-live-wall', 'anpr-search', 'vehicle-journey',
    'alerts', 'gis', 'health'
  ],
  POLICE_OFFICER: [
    'anpr-search', 'vehicle-journey', 'alerts', 'investigations',
    'command-center', 'live-view', 'sentinel-live-wall', 'gis', 'registry', 'reports', 'audit'
  ],
  STATE_AUDITOR: [
    'overview', 'gis', 'registry', 'health', 'reports', 'audit'
  ]
};

// Sidebar group definitions
const NAV_GROUPS: {
  label: string;
  items: { id: NavTab; label: string; shortLabel: string; icon: React.ElementType; badge?: 'alerts' | 'health' }[]
}[] = [
  {
    label: 'Dashboard',
    items: [
      { id: 'overview', label: 'Overview', shortLabel: 'Overview', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Surveillance',
    items: [
      { id: 'command-center', label: 'Command Center', shortLabel: 'Command', icon: MonitorPlay },
      { id: 'live-view', label: 'Live Wall', shortLabel: 'Live Wall', icon: Tv2 },
      { id: 'sentinel-live-wall', label: 'Sentinel Live (31)', shortLabel: 'Sentinel', icon: Radio },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'anpr-search', label: 'ANPR Search', shortLabel: 'ANPR', icon: ScanLine },
      { id: 'vehicle-journey', label: 'Vehicle Journey', shortLabel: 'Journey', icon: Route },
      { id: 'alerts', label: 'Alert Center', shortLabel: 'Alerts', icon: BellRing, badge: 'alerts' },
      { id: 'investigations', label: 'Investigations', shortLabel: 'Invest.', icon: FolderSearch },
    ]
  },
  {
    label: 'Federation',
    items: [
      { id: 'federation-overview', label: 'Federation', shortLabel: 'Fed.', icon: Network },
      { id: 'vms-management', label: 'VMS Systems', shortLabel: 'VMS', icon: Server },
      { id: 'connectors', label: 'Connectors', shortLabel: 'Conn.', icon: Plug },
      { id: 'event-flow', label: 'Event Pipeline', shortLabel: 'Events', icon: GitBranch },
    ]
  },
  {
    label: 'Assets',
    items: [
      { id: 'gis', label: 'CCTV GIS Map', shortLabel: 'GIS', icon: Map },
      { id: 'registry', label: 'Camera Registry', shortLabel: 'Registry', icon: Camera },
      { id: 'onboarding', label: 'Onboarding', shortLabel: 'Onboard', icon: UserPlus },
      { id: 'health', label: 'Health Monitoring', shortLabel: 'Health', icon: Activity, badge: 'health' },
    ]
  },
  {
    label: 'Administration',
    items: [
      { id: 'departments', label: 'Departments', shortLabel: 'Depts.', icon: Building2 },
      { id: 'districts', label: 'Districts', shortLabel: 'Districts', icon: Landmark },
      { id: 'gap-analysis', label: 'Gap Analysis', shortLabel: 'Gaps', icon: BarChart3 },
      { id: 'reports', label: 'Reports', shortLabel: 'Reports', icon: ClipboardList },
      { id: 'administration', label: 'Administration', shortLabel: 'Admin', icon: SlidersHorizontal },
      { id: 'audit', label: 'Audit Log', shortLabel: 'Audit', icon: Shield },
    ]
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onTabChange,
  healthAlertsCount = 0,
  activeAlertsCount = 0,
}) => {
  const { currentRole } = useRBAC();
  const handleTab = onSelectTab || onTabChange || (() => {});
  const [collapsed, setCollapsed] = useState(false);

  const allowedTabs = ROLE_ALLOWED_TABS[currentRole] || ROLE_ALLOWED_TABS.STATE_ADMIN;

  const getBadgeCount = (badge?: 'alerts' | 'health') => {
    if (badge === 'alerts') return activeAlertsCount;
    if (badge === 'health') return healthAlertsCount;
    return 0;
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#0d1f3c] flex flex-col flex-shrink-0 transition-all duration-300 select-none z-30 ${collapsed ? 'w-14' : 'w-52'}`}
    >
      {/* Sidebar Logo / Brand */}
      <div className={`flex items-center border-b border-[#1e3358] flex-shrink-0 ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3 space-x-2.5'}`}>
        <div className="w-8 h-8 rounded-lg bg-[#0052CC] flex items-center justify-center flex-shrink-0 shadow">
          <Video className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-black text-sm leading-tight tracking-tight truncate">Z-TRACS</div>
            <div className="text-[9px] text-slate-400 font-medium truncate">Gujarat Police</div>
          </div>
        )}
      </div>

      {/* Nav Groups — scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
        {NAV_GROUPS.map(group => {
          const visibleItems = group.items.filter(item => allowedTabs.includes(item.id));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="mb-1">
              {/* Group Label */}
              {!collapsed && (
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">{group.label}</span>
                </div>
              )}
              {collapsed && <div className="my-1 border-t border-[#1e3358]" />}

              {visibleItems.map(item => {
                const isActive = activeTab === item.id;
                const badgeCount = getBadgeCount(item.badge);
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center transition-all duration-150 cursor-pointer group relative
                      ${collapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2 space-x-2.5'}
                      ${isActive
                        ? 'bg-[#0052CC] text-white'
                        : 'text-slate-400 hover:text-white hover:bg-[#1a3258]'
                      }
                    `}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-300 rounded-r" />
                    )}

                    <Icon className={`flex-shrink-0 transition-colors ${collapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />

                    {!collapsed && (
                      <span className={`text-[11px] font-semibold truncate flex-1 text-left leading-tight ${isActive ? 'text-white font-bold' : ''}`}>
                        {item.label}
                      </span>
                    )}

                    {/* Badge */}
                    {badgeCount > 0 && (
                      <span className={`rounded-full text-[9px] font-bold font-mono bg-rose-500 text-white flex-shrink-0
                        ${collapsed ? 'absolute top-1 right-1 w-3.5 h-3.5 flex items-center justify-center' : 'px-1.5 py-0.5'}
                      `}>
                        {badgeCount}
                      </span>
                    )}

                    {/* Tooltip on collapsed */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {item.label}
                        {badgeCount > 0 && <span className="ml-1 px-1 bg-rose-500 rounded text-[9px]">{badgeCount}</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Collapse Toggle Button */}
      <div className="border-t border-[#1e3358] p-2 flex-shrink-0">
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`w-full flex items-center justify-center py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a3258] transition text-[11px] font-semibold space-x-2`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
