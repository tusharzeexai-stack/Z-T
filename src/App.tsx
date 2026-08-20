import React, { useState } from 'react';
import { 
  INITIAL_CAMERAS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_DISTRICTS, 
  INITIAL_HEALTH_EVENTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_GAP_AREAS,
  INITIAL_VMS_REFERENCES,
  INITIAL_ANPR_EVENTS,
  INITIAL_ALERTS,
  INITIAL_INVESTIGATIONS,
  INITIAL_VMS_LIST,
  INITIAL_CONNECTORS,
  INITIAL_CANONICAL_EVENTS
} from './data/mockData';
import { 
  Camera, 
  Department, 
  District, 
  HealthEvent, 
  AuditLog, 
  Language, 
  User, 
  AnprEvent, 
  SystemAlert, 
  InvestigationCase,
  CanonicalVms,
  CanonicalConnector,
  CanonicalEvent
} from './types';
import { RBACProvider, useRBAC } from './context/RBACContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewView } from './components/OverviewView';
import { CctvGisView } from './components/CctvGisView';
import { CameraRegistryView } from './components/CameraRegistryView';
import { OnboardingView } from './components/OnboardingView';
import { HealthMonitoringView } from './components/HealthMonitoringView';
import { DepartmentsView } from './components/DepartmentsView';
import { DistrictsView } from './components/DistrictsView';
import { GapAnalysisView } from './components/GapAnalysisView';
import { ReportsView } from './components/ReportsView';
import { AuditLogsView } from './components/AuditLogsView';
import { AdministrationView } from './components/AdministrationView';
import { CameraDetailModal } from './components/CameraDetailModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { SystemStatusOverlay } from './components/SystemStatusOverlay';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginView } from './components/LoginView';

// Model 2 Feature Views
import { CommandCenterView } from './components/CommandCenterView';
import { AnprSearchView } from './components/AnprSearchView';
import { VehicleJourneyView } from './components/VehicleJourneyView';
import { AlertCenterView } from './components/AlertCenterView';
import { InvestigationView } from './components/InvestigationView';

// Model 3 Feature Views
import { FederationOverviewView } from './components/model3/FederationOverviewView';
import { VmsManagementView } from './components/model3/VmsManagementView';
import { ConnectorRegistryView } from './components/model3/ConnectorRegistryView';
import { EventPipelineView } from './components/model3/EventPipelineView';

function MainApp() {
  const { currentUser, currentRole } = useRBAC();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Global Application State
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cross-module filter & vehicle journey state
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('ALL');
  const [selectedPlateForJourney, setSelectedPlateForJourney] = useState<string>('GJ01AB1234');

  // Master State Store (Model 1 + Model 2 + Model 3)
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [districts, setDistricts] = useState<District[]>(INITIAL_DISTRICTS);
  const [healthEvents, setHealthEvents] = useState<HealthEvent[]>(INITIAL_HEALTH_EVENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [anprEvents, setAnprEvents] = useState<AnprEvent[]>(INITIAL_ANPR_EVENTS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [cases, setCases] = useState<InvestigationCase[]>(INITIAL_INVESTIGATIONS);

  // Model 3 Federation State
  const [vmsList, setVmsList] = useState<CanonicalVms[]>(INITIAL_VMS_LIST);
  const [connectors, setConnectors] = useState<CanonicalConnector[]>(INITIAL_CONNECTORS);
  const [canonicalEvents, setCanonicalEvents] = useState<CanonicalEvent[]>(INITIAL_CANONICAL_EVENTS);

  // Modals & Drawers State
  const [selectedCameraForDetail, setSelectedCameraForDetail] = useState<Camera | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Cross-Module Action Handlers
  const handleAddCamera = (newCam: Camera) => {
    setCameras(prev => [newCam, ...prev]);
    const newLog: AuditLog = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: {
        name: currentUser.name,
        badge: currentUser.badge,
        role: currentRole,
        avatar: currentUser.avatar,
      },
      action: 'CREATE_CAMERA',
      resource: `${newCam.cameraCode} (${newCam.name})`,
      district: newCam.district,
      result: 'Success',
      ip: '10.142.1.25 (State WAN)',
      diffPayload: [
        { field: 'camera_code', before: 'null', after: newCam.cameraCode },
        { field: 'lifecycle', before: 'null', after: newCam.lifecycle },
        { field: 'department', before: 'null', after: newCam.departmentName },
      ],
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleMarkMaintenance = (cameraUuid: string) => {
    setCameras(prev => prev.map(c => {
      if (c.cameraUuid === cameraUuid) {
        return {
          ...c,
          lifecycle: 'MAINTENANCE',
          healthStatus: 'OFFLINE',
          deviceHealth: 'Signal Lost',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          updatedBy: `${currentUser.name}`,
        };
      }
      return c;
    }));

    const targetCam = cameras.find(c => c.cameraUuid === cameraUuid);
    const newLog: AuditLog = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: {
        name: currentUser.name,
        badge: currentUser.badge,
        role: currentRole,
        avatar: currentUser.avatar,
      },
      action: 'MARK_MAINTENANCE',
      resource: targetCam ? targetCam.cameraCode : cameraUuid,
      district: targetCam?.district || 'Statewide',
      result: 'Success',
      ip: '10.142.1.25 (State WAN)',
      diffPayload: [
        { field: 'lifecycle', before: targetCam?.lifecycle || 'ACTIVE', after: 'MAINTENANCE' },
        { field: 'health_status', before: targetCam?.healthStatus || 'ONLINE', after: 'OFFLINE' },
      ],
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleArchiveCamera = (cameraUuid: string) => {
    setCameras(prev => prev.map(c => {
      if (c.cameraUuid === cameraUuid) {
        return {
          ...c,
          lifecycle: 'ARCHIVED',
          archivedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          archiveReason: 'Decommissioned by State Administrator',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          updatedBy: currentUser.name,
        };
      }
      return c;
    }));

    const targetCam = cameras.find(c => c.cameraUuid === cameraUuid);
    const newLog: AuditLog = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: {
        name: currentUser.name,
        badge: currentUser.badge,
        role: currentRole,
        avatar: currentUser.avatar,
      },
      action: 'ARCHIVE_CAMERA',
      resource: targetCam ? targetCam.cameraCode : cameraUuid,
      district: targetCam?.district || 'Statewide',
      result: 'Success',
      ip: '10.142.1.25 (State WAN)',
      diffPayload: [
        { field: 'lifecycle', before: targetCam?.lifecycle || 'ACTIVE', after: 'ARCHIVED' },
      ],
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRestoreCamera = (cameraUuid: string) => {
    setCameras(prev => prev.map(c => {
      if (c.cameraUuid === cameraUuid) {
        return {
          ...c,
          lifecycle: 'ACTIVE',
          healthStatus: 'ONLINE',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          updatedBy: currentUser.name,
        };
      }
      return c;
    }));

    const targetCam = cameras.find(c => c.cameraUuid === cameraUuid);
    const newLog: AuditLog = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: {
        name: currentUser.name,
        badge: currentUser.badge,
        role: currentRole,
        avatar: currentUser.avatar,
      },
      action: 'RESTORE_CAMERA',
      resource: targetCam ? targetCam.cameraCode : cameraUuid,
      district: targetCam?.district || 'Statewide',
      result: 'Success',
      ip: '10.142.1.25 (State WAN)',
      diffPayload: [
        { field: 'lifecycle', before: 'ARCHIVED', after: 'ACTIVE' },
      ],
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: currentUser.name } : a));
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED' } : a));
  };

  if (!isAuthenticated) {
    return (
      <LoginView 
        onLoginSuccess={(loggedInUser) => {
          setIsAuthenticated(true);
          if (loggedInUser.role === 'CONTROL_ROOM_OPERATOR') {
            setActiveTab('command-center');
          } else if (loggedInUser.role === 'POLICE_OFFICER') {
            setActiveTab('anpr-search');
          } else {
            setActiveTab('overview');
          }
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 flex flex-col font-sans selection:bg-[#0052CC] selection:text-white">
      
      {/* Top Official Dark Navy Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        unreadAlertsCount={alerts.filter(a => a.status === 'NEW').length}
        onToggleNotifications={() => setIsNotificationsOpen(prev => !prev)}
        onOpenSystemStatus={() => setIsSystemStatusOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Clean White Tab Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentLang={currentLang}
        healthAlertsCount={healthEvents.filter(e => !e.resolved).length}
        activeAlertsCount={alerts.filter(a => a.status === 'NEW').length}
      />

      {/* Main Content Area Viewport - Full Widescreen Layout */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5">
        
        {/* MODEL 1: Overview */}
        {activeTab === 'overview' && (
          <OverviewView
            cameras={cameras}
            departments={departments}
            districts={districts}
            healthEvents={healthEvents}
            auditLogs={auditLogs}
            currentLang={currentLang}
            onSelectCamera={(cam) => setSelectedCameraForDetail(cam)}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* MODEL 2: Command Center & Video Wall */}
        {activeTab === 'command-center' && (
          <CommandCenterView
            cameras={cameras}
            anprEvents={anprEvents}
            alerts={alerts}
            departments={departments}
            onSelectCamera={(cam) => setSelectedCameraForDetail(cam)}
            onNavigateTab={setActiveTab}
            onSelectAnprEvent={(evt) => {
              setSelectedPlateForJourney(evt.plateNumber);
              setActiveTab('vehicle-journey');
            }}
          />
        )}

        {/* MODEL 2: Live View Wall */}
        {activeTab === 'live-view' && (
          <CommandCenterView
            cameras={cameras}
            anprEvents={anprEvents}
            alerts={alerts}
            departments={departments}
            onSelectCamera={(cam) => setSelectedCameraForDetail(cam)}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* MODEL 2: ANPR Search Engine */}
        {activeTab === 'anpr-search' && (
          <AnprSearchView
            anprEvents={anprEvents}
            departments={departments}
            districts={districts}
            onSelectPlateForJourney={(plate) => {
              setSelectedPlateForJourney(plate);
              setActiveTab('vehicle-journey');
            }}
          />
        )}

        {/* MODEL 2: Vehicle Intelligence & Journey Tracking */}
        {activeTab === 'vehicle-journey' && (
          <VehicleJourneyView
            initialPlate={selectedPlateForJourney}
            anprEvents={anprEvents}
            onCreateInvestigationCase={(plate) => {
              setActiveTab('investigations');
            }}
          />
        )}

        {/* MODEL 2: Alert Management Center */}
        {activeTab === 'alerts' && (
          <AlertCenterView
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onNavigateToJourney={(plate) => {
              setSelectedPlateForJourney(plate);
              setActiveTab('vehicle-journey');
            }}
          />
        )}

        {/* MODEL 2: Investigations Workspace */}
        {activeTab === 'investigations' && (
          <InvestigationView
            cases={cases}
            onNavigateToJourney={(plate) => {
              setSelectedPlateForJourney(plate);
              setActiveTab('vehicle-journey');
            }}
          />
        )}

        {/* MODEL 3: Federation Overview */}
        {activeTab === 'federation-overview' && (
          <FederationOverviewView
            vmsList={vmsList}
            connectors={connectors}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* MODEL 3: VMS Management */}
        {activeTab === 'vms-management' && (
          <VmsManagementView
            vmsList={vmsList}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* MODEL 3: Connector Registry */}
        {activeTab === 'connectors' && (
          <ConnectorRegistryView
            connectors={connectors}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* MODEL 3: Event Pipeline & DLQ */}
        {activeTab === 'event-flow' && (
          <EventPipelineView
            canonicalEvents={canonicalEvents}
            onNavigateToJourney={(plate) => {
              setSelectedPlateForJourney(plate);
              setActiveTab('vehicle-journey');
            }}
          />
        )}

        {/* MODEL 1: CCTV GIS Viewport */}
        {activeTab === 'gis' && (
          <CctvGisView
            cameras={cameras}
            departments={departments}
            currentLang={currentLang}
            onSelectCamera={(cam) => setSelectedCameraForDetail(cam)}
            selectedDistrictFilter={selectedDistrictFilter}
            selectedDeptFilter={selectedDeptFilter}
          />
        )}

        {/* MODEL 1: Camera Registry */}
        {activeTab === 'registry' && (
          <CameraRegistryView
            cameras={cameras}
            currentLang={currentLang}
            onSelectCamera={(cam) => setSelectedCameraForDetail(cam)}
            onNavigateToGis={(cam) => {
              setActiveTab('gis');
            }}
            onMarkMaintenance={handleMarkMaintenance}
            onArchiveCamera={handleArchiveCamera}
            onRestoreCamera={handleRestoreCamera}
            onOpenOnboarding={() => setActiveTab('onboarding')}
            initialDeptFilter={selectedDeptFilter}
            initialDistrictFilter={selectedDistrictFilter}
          />
        )}

        {/* MODEL 1: Onboarding Wizard */}
        {activeTab === 'onboarding' && (
          <OnboardingView
            departments={departments}
            districts={districts}
            currentLang={currentLang}
            onAddCamera={handleAddCamera}
          />
        )}

        {/* MODEL 1: Health Monitoring */}
        {activeTab === 'health' && (
          <HealthMonitoringView
            events={healthEvents}
            cameras={cameras}
            currentLang={currentLang}
            onSelectCamera={(cam) => setSelectedCameraForDetail(cam)}
            onMarkMaintenance={handleMarkMaintenance}
          />
        )}

        {/* MODEL 1: Departments */}
        {activeTab === 'departments' && (
          <DepartmentsView
            departments={departments}
            currentLang={currentLang}
            onSelectDepartment={(dept) => {
              setSelectedDeptFilter(dept.id);
              setActiveTab('registry');
            }}
          />
        )}

        {/* MODEL 1: Districts */}
        {activeTab === 'districts' && (
          <DistrictsView
            districts={districts}
            currentLang={currentLang}
            onSelectDistrict={(dist) => {
              setSelectedDistrictFilter(dist.name);
              setActiveTab('registry');
            }}
          />
        )}

        {/* MODEL 1: Gap Analysis */}
        {activeTab === 'gap-analysis' && (
          <GapAnalysisView
            gapAreas={INITIAL_GAP_AREAS}
            currentLang={currentLang}
          />
        )}

        {/* MODEL 1: Reports */}
        {activeTab === 'reports' && (
          <ReportsView
            departments={departments}
            districts={districts}
            currentLang={currentLang}
          />
        )}

        {/* MODEL 1: Administration */}
        {activeTab === 'administration' && (
          <AdministrationView />
        )}

        {/* MODEL 1: Audit Logs */}
        {activeTab === 'audit' && (
          <AuditLogsView
            logs={auditLogs}
            currentLang={currentLang}
          />
        )}

      </main>

      {/* Official Government Footer */}
      <footer className="w-full bg-[#00253E] border-t border-[#00385C] text-slate-300 py-6 px-4 sm:px-6 lg:px-8 mt-12 select-none">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Left: Official Government Department Branding */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-slate-700 p-1 flex items-center justify-center shrink-0">
              <span className="text-[#0072CE] font-black text-xs">GJ</span>
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">
                GUJARAT POLICE DEPARTMENT <span className="text-slate-500 font-normal">|</span> GOVERNMENT OF GUJARAT
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Centralised CCTV Infrastructure & Video Intelligence Command Center
              </div>
            </div>
          </div>

          {/* Center: System Status & Security Level Tag */}
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#00385C] border border-[#004B7A] text-emerald-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>STATE WAN CONNECTED (10.142.0.0/16)</span>
            </span>
            <span className="hidden lg:inline text-slate-500">
              RESTRICTED GOVERNMENT SYSTEM
            </span>
          </div>

          {/* Right: Copyright & Compliance */}
          <div className="text-center md:text-right text-[11px] text-slate-400">
            <div>© 2026 Government of Gujarat. All Rights Reserved.</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              PostGIS Spatial Engine • Keycloak OIDC • SHA-256 Audit
            </div>
          </div>

        </div>
      </footer>

      {/* Master Camera Detail Modal */}
      {selectedCameraForDetail && (
        <CameraDetailModal
          camera={selectedCameraForDetail}
          isOpen={true}
          onClose={() => setSelectedCameraForDetail(null)}
          onNavigateToGis={() => {
            setActiveTab('gis');
          }}
          onMarkMaintenance={handleMarkMaintenance}
          onArchiveCamera={handleArchiveCamera}
        />
      )}

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        events={healthEvents}
        onSelectEvent={(evt) => {
          setIsNotificationsOpen(false);
          const cam = cameras.find(c => c.cameraUuid === evt.cameraId || c.cameraCode === evt.cameraCode);
          if (cam) setSelectedCameraForDetail(cam);
        }}
      />

      {/* System Subsystem Status Overlay */}
      <SystemStatusOverlay
        isOpen={isSystemStatusOpen}
        onClose={() => setIsSystemStatusOpen(false)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        cameras={cameras}
        departments={departments}
        districts={districts}
        onSelectCamera={(cam) => setSelectedCameraForDetail(cam)}
        onNavigateTab={setActiveTab}
      />

    </div>
  );
}

export default function App() {
  return (
    <RBACProvider>
      <MainApp />
    </RBACProvider>
  );
}
