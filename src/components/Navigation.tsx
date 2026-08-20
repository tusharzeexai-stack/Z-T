import React from 'react';
import { Language, UserRole } from '../types';
import { useRBAC } from '../context/RBACContext';

export type NavTab = 
  | 'overview'
  | 'command-center'
  | 'live-view'
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
    'overview', 'command-center', 'live-view', 'anpr-search', 'vehicle-journey',
    'alerts', 'investigations', 'federation-overview', 'vms-management', 'connectors',
    'event-flow', 'gis', 'registry', 'onboarding', 'health', 'departments',
    'districts', 'gap-analysis', 'reports', 'administration', 'audit'
  ],
  DISTRICT_ADMIN: [
    'overview', 'command-center', 'live-view', 'anpr-search', 'vehicle-journey',
    'alerts', 'gis', 'registry', 'onboarding', 'health', 'districts',
    'gap-analysis', 'reports', 'administration', 'audit'
  ],
  DEPARTMENT_ADMIN: [
    'overview', 'command-center', 'live-view', 'gis', 'registry', 'onboarding',
    'health', 'departments', 'reports', 'administration', 'audit'
  ],
  DISTRICT_OFFICER: [
    'overview', 'command-center', 'live-view', 'anpr-search', 'vehicle-journey',
    'alerts', 'gis', 'registry', 'health', 'districts', 'gap-analysis', 'reports'
  ],
  CONTROL_ROOM_OPERATOR: [
    'command-center', 'live-view', 'anpr-search', 'vehicle-journey',
    'alerts', 'gis', 'health'
  ],
  POLICE_OFFICER: [
    'anpr-search', 'vehicle-journey', 'alerts', 'investigations',
    'command-center', 'live-view', 'gis', 'registry', 'reports', 'audit'
  ],
  STATE_AUDITOR: [
    'overview', 'gis', 'registry', 'health', 'reports', 'audit'
  ]
};

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onTabChange,
  healthAlertsCount,
  activeAlertsCount = 3,
}) => {
  const { currentRole } = useRBAC();
  const handleTab = onSelectTab || onTabChange || (() => {});

  const allNavItems: { id: NavTab; label: string; badge?: number; highlight?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'command-center', label: 'Command Center', highlight: true },
    { id: 'live-view', label: 'Live Wall' },
    { id: 'anpr-search', label: 'ANPR Search' },
    { id: 'vehicle-journey', label: 'Vehicle Journey' },
    { id: 'alerts', label: 'Alert Center', badge: activeAlertsCount },
    { id: 'investigations', label: 'Investigations' },
    { id: 'federation-overview', label: 'Federation' },
    { id: 'vms-management', label: 'VMS Systems' },
    { id: 'connectors', label: 'Connectors' },
    { id: 'event-flow', label: 'Event Pipeline' },
    { id: 'gis', label: 'CCTV GIS' },
    { id: 'registry', label: 'Camera Registry' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'health', label: 'Health Monitoring', badge: healthAlertsCount },
    { id: 'departments', label: 'Departments' },
    { id: 'districts', label: 'Districts' },
    { id: 'gap-analysis', label: 'Gap Analysis' },
    { id: 'reports', label: 'Reports' },
    { id: 'administration', label: 'Administration' },
    { id: 'audit', label: 'Audit' },
  ];

  const allowedTabs = ROLE_ALLOWED_TABS[currentRole] || ROLE_ALLOWED_TABS.STATE_ADMIN;
  const filteredNavItems = allNavItems.filter(item => allowedTabs.includes(item.id));

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs overflow-x-auto no-scrollbar select-none">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-6 sm:space-x-8 min-w-max">
          {filteredNavItems.map((item) => {
            const isActive = activeTab === item.id || 
              (item.id === 'gap-analysis' && (activeTab === 'gaps' || activeTab === 'gap-analysis')) ||
              (item.id === 'administration' && activeTab === 'administration') ||
              (item.id === 'audit' && activeTab === 'audit');

            return (
              <button
                key={item.id}
                onClick={() => handleTab(item.id)}
                className={`py-3 text-xs font-semibold tracking-normal transition-all relative whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  isActive
                    ? 'text-[#0052CC] font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0052CC]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
