import React, { useState } from 'react';
import { Camera } from '../types';
import { 
  Video, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Eye, 
  Activity, 
  Layers, 
  TrendingUp, 
  Radio, 
  ShieldAlert, 
  ChevronRight,
  Plus,
  Minus,
  ArrowUpRight,
  Zap,
  Server
} from 'lucide-react';

interface OverviewViewProps {
  onNavigateTab?: (tab: string) => void;
  onOpenLiveStream?: (camera: Camera) => void;
}

interface MapHoverNode {
  id: string;
  name: string;
  category: string;
  district: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  totalCameras: number;
  aiCameras: number;
  vms: string;
  resolution: string;
  fps: number;
  x: number;
  y: number;
}

const MAP_NODES: MapHoverNode[] = [
  { id: 'n-1', name: 'Surendranagar', category: 'State Command Hub', district: 'Surendranagar', status: 'ONLINE', totalCameras: 1240, aiCameras: 840, vms: 'Sentinel Cloud Edge', resolution: '4K UHD', fps: 25, x: 540, y: 180 },
  { id: 'n-2', name: 'Wadhwan', category: 'East Municipal Sector', district: 'Surendranagar', status: 'ONLINE', totalCameras: 480, aiCameras: 210, vms: 'Honeywell MAXPRO', resolution: '1080p FHD', fps: 30, x: 630, y: 205 },
  { id: 'n-3', name: 'Ratanpar', category: 'North Substation Junction', district: 'Surendranagar', status: 'ONLINE', totalCameras: 320, aiCameras: 140, vms: 'Milestone XProtect', resolution: '1080p FHD', fps: 25, x: 540, y: 130 },
  { id: 'n-4', name: 'Godavari', category: 'Highway Checkpoint 17', district: 'Surendranagar', status: 'DEGRADED', totalCameras: 210, aiCameras: 95, vms: 'Dahua SmartVMS', resolution: '1080p FHD', fps: 15, x: 210, y: 160 },
  { id: 'n-5', name: 'Shekhpar', category: 'West Rural Division', district: 'Surendranagar', status: 'ONLINE', totalCameras: 180, aiCameras: 80, vms: 'Hikvision iVMS-4200', resolution: '1080p FHD', fps: 25, x: 300, y: 150 },
  { id: 'n-6', name: 'Gautamgadh', category: 'State Border Post 01', district: 'Surendranagar', status: 'OFFLINE', totalCameras: 150, aiCameras: 60, vms: 'Bosch BVMS', resolution: '720p HD', fps: 0, x: 85, y: 235 },
  { id: 'n-7', name: 'Kukda', category: 'River Bridge Toll Node', district: 'Surendranagar', status: 'ONLINE', totalCameras: 290, aiCameras: 180, vms: 'Axis Camera Station', resolution: '4K UHD', fps: 30, x: 195, y: 290 },
  { id: 'n-8', name: 'Limali', category: 'Central Transit Hub', district: 'Surendranagar', status: 'DEGRADED', totalCameras: 160, aiCameras: 70, vms: 'Sentinel Cloud Edge', resolution: '1080p FHD', fps: 18, x: 350, y: 290 },
  { id: 'n-9', name: 'Malod', category: 'Mid-District Surveillance', district: 'Surendranagar', status: 'ONLINE', totalCameras: 310, aiCameras: 190, vms: 'Honeywell MAXPRO', resolution: '4K UHD', fps: 25, x: 485, y: 300 },
  { id: 'n-10', name: 'Vaghela', category: 'South East Industrial Grid', district: 'Surendranagar', status: 'ONLINE', totalCameras: 240, aiCameras: 120, vms: 'Milestone XProtect', resolution: '1080p FHD', fps: 30, x: 615, y: 335 },
  { id: 'n-11', name: 'Munjpar', category: 'South Junction Post', district: 'Surendranagar', status: 'OFFLINE', totalCameras: 190, aiCameras: 90, vms: 'Dahua SmartVMS', resolution: '1080p FHD', fps: 0, x: 270, y: 365 },
  { id: 'n-12', name: 'Jasapar', category: 'District Patrol Checkpoint', district: 'Surendranagar', status: 'ONLINE', totalCameras: 140, aiCameras: 65, vms: 'Hikvision iVMS-4200', resolution: '1080p FHD', fps: 25, x: 205, y: 415 },
  { id: 'n-13', name: 'Timba', category: 'State Highway Toll Node 51', district: 'Surendranagar', status: 'ONLINE', totalCameras: 380, aiCameras: 260, vms: 'Sentinel Cloud Edge', resolution: '4K UHD', fps: 30, x: 565, y: 440 },
  { id: 'n-14', name: 'Gundiyala', category: 'South West Substation', district: 'Surendranagar', status: 'DEGRADED', totalCameras: 110, aiCameras: 40, vms: 'Bosch BVMS', resolution: '720p HD', fps: 12, x: 490, y: 465 }
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigateTab,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHoverNode, setActiveHoverNode] = useState<{ node: MapHoverNode; clientX: number; clientY: number } | null>(null);

  const handleNodeMouseMove = (node: MapHoverNode, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveHoverNode({
      node,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top - 10,
    });
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      
      {/* 1. Breadcrumb & Page Heading */}
      <div>
        <div className="text-xs text-slate-500 font-medium">
          <span>Gujarat Police</span>
          <span className="mx-1.5 text-slate-400">/</span>
          <span className="text-slate-600">Z-TRACS</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Central Management Suite
        </h1>
      </div>

      {/* 2. Top 5 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* TOTAL REGISTERED */}
        <div className="bg-[#EBF3FE] border border-[#D5E5FA] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              TOTAL REGISTERED
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#DDE9FA] flex items-center justify-center text-[#0052CC]">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
              24,860
            </div>
            <div className="text-[11px] font-semibold text-[#16A34A] mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% this month</span>
            </div>
          </div>
        </div>

        {/* ONLINE */}
        <div className="bg-[#EEF5FE] border border-[#DCE8F8] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              ONLINE
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
              21,740
            </div>
            <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#22C55E] h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>

        {/* DEGRADED */}
        <div className="bg-[#F8F6FA] border border-[#E9E4F0] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              DEGRADED
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
              1,840
            </div>
            <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: '7%' }}></div>
            </div>
          </div>
        </div>

        {/* OFFLINE */}
        <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              OFFLINE
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
              1,280
            </div>
            <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#EF4444] h-full rounded-full" style={{ width: '5%' }}></div>
            </div>
          </div>
        </div>

        {/* SYSTEM HEALTH */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              SYSTEM HEALTH
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#15803D] font-sans tracking-tight">
              96.4%
            </div>
            <div className="text-[11px] font-semibold text-[#15803D] mt-1">
              <span>Optimal Grid Telemetry</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Filter Pills Bar */}
      <div className="flex flex-wrap items-center gap-2.5 py-1">
        <div className="px-4 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-600 shadow-2xs flex items-center">
          <Building2 className="w-3.5 h-3.5 text-[#0052CC] mr-1.5" />
          <span>Departments: </span>
          <strong className="text-slate-900 font-bold ml-1">18</strong>
        </div>

        <div className="px-4 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-600 shadow-2xs flex items-center">
          <MapPin className="w-3.5 h-3.5 text-[#0052CC] mr-1.5" />
          <span>Districts: </span>
          <strong className="text-slate-900 font-bold ml-1">33</strong>
        </div>

        <div className="px-4 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-600 shadow-2xs flex items-center">
          <Server className="w-3.5 h-3.5 text-[#0052CC] mr-1.5" />
          <span>VMS Systems Linked: </span>
          <strong className="text-slate-900 font-bold ml-1">42</strong>
        </div>

        <div className="px-4 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-600 shadow-2xs flex items-center">
          <Zap className="w-3.5 h-3.5 text-[#0052CC] mr-1.5" />
          <span>Cameras with AI: </span>
          <strong className="text-slate-900 font-bold ml-1">8,940</strong>
        </div>
      </div>

      {/* 4. Middle Section: Two Columns (Map & Distribution Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Statewide Coverage Map (Col-8) */}
        <div className="lg:col-span-8 relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200/90 bg-[#F4F1EA] shadow-2xs group">
          
          {/* Detailed SVG Map of Surendranagar / Gujarat Region */}
          <div 
            className="w-full h-full relative cursor-grab active:cursor-grabbing select-none transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <svg 
              className="w-full h-full"
              viewBox="0 0 900 550" 
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Soft Geographic Landmass Tones */}
              <rect width="900" height="550" fill="#F3F0E6" />

              {/* Green Agricultural & Forest Patches */}
              <path d="M 50,300 Q 150,220 280,320 T 450,480 Q 200,560 50,500 Z" fill="#DCF0DE" opacity="0.85" />
              <path d="M 400,20 Q 550,60 700,20 T 880,180 Q 820,320 650,260 Z" fill="#E2F2E4" opacity="0.85" />
              <path d="M 520,380 Q 680,350 820,440 L 890,540 L 480,540 Z" fill="#DCF0DE" opacity="0.75" />

              {/* Water Bodies & Rivers */}
              <path d="M -10,320 Q 120,380 220,300 T 360,490 Q 420,510 500,480" fill="none" stroke="#A8D5F2" strokeWidth="14" strokeLinecap="round" opacity="0.85" />
              <path d="M 220,180 Q 320,140 460,200 T 680,120 Q 750,150 880,90" fill="none" stroke="#A8D5F2" strokeWidth="10" strokeLinecap="round" opacity="0.75" />

              {/* Secondary Road Networks */}
              <path d="M 120,40 L 280,190 L 480,240 L 780,290" fill="none" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 80,480 L 240,360 L 520,380 L 820,490" fill="none" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 420,80 L 460,280 L 560,520" fill="none" stroke="#FFFFFF" strokeWidth="5" />
              <path d="M 280,190 L 160,340 L 320,510" fill="none" stroke="#FFFFFF" strokeWidth="5" />
              <path d="M 640,120 L 720,350 L 610,510" fill="none" stroke="#FFFFFF" strokeWidth="5" />

              {/* Primary State Highways */}
              <path d="M -20,240 Q 200,280 480,220 T 920,300" fill="none" stroke="#F5C067" strokeWidth="4" />
              <path d="M 480,0 Q 510,180 520,320 T 560,560" fill="none" stroke="#F5C067" strokeWidth="4" />

              {/* Highway Badges */}
              <g transform="translate(200, 270)">
                <rect x="-12" y="-9" width="24" height="18" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">17</text>
              </g>
              <g transform="translate(30, 435)">
                <rect x="-12" y="-9" width="24" height="18" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">17</text>
              </g>
              <g transform="translate(500, 240)">
                <rect x="-12" y="-9" width="24" height="18" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">17</text>
              </g>
              <g transform="translate(608, 142)">
                <rect x="-12" y="-9" width="24" height="18" rx="4" fill="#EAB308" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">51</text>
              </g>

              {/* Interactive Node Markers with Hover Callouts */}
              {MAP_NODES.map((node) => {
                const isOnline = node.status === 'ONLINE';
                const isDegraded = node.status === 'DEGRADED';
                const statusColor = isOnline ? '#22C55E' : isDegraded ? '#F59E0B' : '#EF4444';

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer transition-transform duration-150 hover:scale-125"
                    onMouseEnter={(e) => handleNodeMouseMove(node, e)}
                    onMouseLeave={() => setActiveHoverNode(null)}
                  >
                    {/* Node Dot */}
                    <circle cx="0" cy="0" r="4.5" fill="#1E293B" />
                    
                    {/* Status Pulsating Ring */}
                    <circle cx="0" cy="-12" r="5" fill={statusColor} />
                    <circle cx="0" cy="-12" r="10" fill={statusColor} opacity="0.25" className="animate-ping" />

                    {/* Town Text Labels in Clean English */}
                    <text x="0" y="-22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0F172A">
                      {node.name}
                    </text>
                    <text x="0" y="14" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748B">
                      {node.category}
                    </text>
                  </g>
                );
              })}

            </svg>
          </div>

          {/* Floating Hover Tooltip Popup Card */}
          {activeHoverNode && (
            <div 
              className="absolute z-[2000] bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-300 shadow-xl pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
              style={{
                left: `${activeHoverNode.node.x / 900 * 100}%`,
                top: `${activeHoverNode.node.y / 550 * 100 - 15}%`,
                transform: 'translate(-50%, -100%)',
                minWidth: '220px'
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <div>
                  <div className="font-bold text-xs text-slate-900">{activeHoverNode.node.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{activeHoverNode.node.category}</div>
                </div>
                <span 
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    activeHoverNode.node.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    activeHoverNode.node.status === 'DEGRADED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  ● {activeHoverNode.node.status}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] font-sans text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">CCTV Cameras:</span>
                  <strong className="text-slate-900 font-bold">{activeHoverNode.node.totalCameras} Units</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">AI Enabled:</span>
                  <strong className="text-[#0052CC] font-bold">{activeHoverNode.node.aiCameras} Cameras</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">VMS Platform:</span>
                  <span className="font-semibold text-slate-800">{activeHoverNode.node.vms}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">Telemetry:</span>
                  <span className="font-mono font-bold text-slate-700">{activeHoverNode.node.fps} FPS • {activeHoverNode.node.resolution}</span>
                </div>
              </div>
            </div>
          )}

          {/* Floating Legend Box (Top Left) */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/90 shadow-md">
            <div className="text-xs font-bold text-slate-900 mb-2">
              Statewide Coverage
            </div>
            <div className="space-y-1.5 text-[11px] font-medium text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
                <span>Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <span>Offline</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                <span>Degraded</span>
              </div>
            </div>
          </div>

          {/* Floating Zoom Controls (Bottom Right) */}
          <div className="absolute bottom-4 right-4 bg-white rounded-full border border-slate-300 shadow-md flex items-center px-1.5 py-1 space-x-1">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(1.6, prev + 0.15))}
              className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-300"></div>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.15))}
              className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right: Distribution Overview Card (Col-4) */}
        <div className="lg:col-span-4 bg-[#EDF3F9] border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  DISTRICT DISTRIBUTION
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Top 5 Gujarat Districts</p>
              </div>
              <span className="text-[10px] font-bold text-[#0052CC] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                33 Total
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {[
                { name: 'Ahmedabad Urban & Rural', count: '4,820', pct: 85, color: '#0052CC' },
                { name: 'Surat City & Industrial', count: '3,940', pct: 72, color: '#0052CC' },
                { name: 'Vadodara District', count: '2,650', pct: 58, color: '#0052CC' },
                { name: 'Rajkot Zone', count: '2,110', pct: 46, color: '#0052CC' },
                { name: 'Gandhinagar Capital', count: '1,890', pct: 40, color: '#0052CC' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{item.name}</span>
                    <span className="text-slate-900 font-bold">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-200/90 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/70 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Model 3 Federation Active</span>
            <button 
              onClick={() => onNavigateTab && onNavigateTab('districts')}
              className="text-xs font-bold text-[#0052CC] hover:underline flex items-center"
            >
              <span>View All 33 Districts</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
