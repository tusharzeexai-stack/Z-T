import React, { useState } from 'react';
import { 
  Video, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wrench, 
  MapPin, 
  MoreVertical, 
  ArrowRight,
  Building2,
  SlidersHorizontal,
  Database,
  LayoutGrid,
  TrendingUp,
  Plus,
  Minus
} from 'lucide-react';
import { Camera, Department, District, AuditLog, Language } from '../types';

interface OverviewViewProps {
  cameras?: Camera[];
  departments?: Department[];
  districts?: District[];
  auditLogs?: AuditLog[];
  healthEvents?: any[];
  currentLang?: Language;
  onNavigateTab: (tab: any) => void;
  onSelectCamera?: (camera: Camera) => void;
  onOpenLiveStream?: (camera: Camera) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigateTab,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

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
              1,842
            </div>
            <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: '12%' }}></div>
            </div>
          </div>
        </div>

        {/* OFFLINE */}
        <div className="bg-[#FAF5F6] border border-[#F2E0E4] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              OFFLINE
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
              1,278
            </div>
            <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#EF4444] h-full rounded-full" style={{ width: '7%' }}></div>
            </div>
          </div>
        </div>

        {/* MAINTENANCE */}
        <div className="bg-[#F1F5FA] border border-[#DFE7F2] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              MAINTENANCE
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
              214
            </div>
            <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: '3%' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Secondary Summary Pills Row */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <div className="px-4 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-600 shadow-2xs">
          Departments: <strong className="text-slate-900 font-bold ml-1">18</strong>
        </div>
        <div className="px-4 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-600 shadow-2xs">
          Districts: <strong className="text-slate-900 font-bold ml-1">33</strong>
        </div>
        <div className="px-4 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-600 shadow-2xs">
          VMS Systems Linked: <strong className="text-slate-900 font-bold ml-1">42</strong>
        </div>
        <div className="px-4 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-600 shadow-2xs flex items-center">
          <MapPin className="w-3.5 h-3.5 text-[#0052CC] mr-1.5" />
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

              {/* Water Bodies & Rivers (Bhogavo River & Dams) */}
              <path 
                d="M -10,320 Q 120,380 220,300 T 360,490 Q 420,510 500,480" 
                fill="none" 
                stroke="#A8D5F2" 
                strokeWidth="14" 
                strokeLinecap="round" 
                opacity="0.85"
              />
              <path 
                d="M 220,180 Q 320,140 460,200 T 680,120 Q 750,150 880,90" 
                fill="none" 
                stroke="#A8D5F2" 
                strokeWidth="10" 
                strokeLinecap="round" 
                opacity="0.75"
              />

              {/* Secondary Road Networks (White / Light Tan) */}
              <path d="M 120,40 L 280,190 L 480,240 L 780,290" fill="none" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 80,480 L 240,360 L 520,380 L 820,490" fill="none" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 420,80 L 460,280 L 560,520" fill="none" stroke="#FFFFFF" strokeWidth="5" />
              <path d="M 280,190 L 160,340 L 320,510" fill="none" stroke="#FFFFFF" strokeWidth="5" />
              <path d="M 640,120 L 720,350 L 610,510" fill="none" stroke="#FFFFFF" strokeWidth="5" />

              {/* Primary State Highways (Golden / Orange Yellow with Highway Badges) */}
              <path d="M -20,240 Q 200,280 480,220 T 920,300" fill="none" stroke="#F5C067" strokeWidth="4" />
              <path d="M 480,0 Q 510,180 520,320 T 560,560" fill="none" stroke="#F5C067" strokeWidth="4" />

              {/* Highway Badge Markers */}
              {/* Highway 17 */}
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

              {/* Highway 51 */}
              <g transform="translate(608, 142)">
                <rect x="-12" y="-9" width="24" height="18" rx="4" fill="#EAB308" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">51</text>
              </g>

              {/* Town & Village Labels (Bilingual English + Gujarati matching map) */}
              
              {/* Surendranagar (Major City Hub) */}
              <g transform="translate(540, 180)">
                <circle cx="0" cy="0" r="5" fill="#1E293B" />
                <text x="0" y="-14" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#0F172A">Surendranagar</text>
                <text x="0" y="3" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">સુરેન્દ્રનગર</text>
              </g>

              {/* Wadhwan */}
              <g transform="translate(630, 205)">
                <circle cx="0" cy="0" r="3.5" fill="#334155" />
                <text x="0" y="-8" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E293B">WADHWAN</text>
                <text x="0" y="5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">વઢવાણ</text>
              </g>

              {/* Ratanpar */}
              <g transform="translate(540, 130)">
                <circle cx="0" cy="0" r="3.5" fill="#334155" />
                <text x="0" y="-6" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E293B">RATANPAR</text>
                <text x="0" y="6" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">રતનપર</text>
              </g>

              {/* Danawada */}
              <g transform="translate(180, 65)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Danawada</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">દાણવાડા</text>
              </g>

              {/* Shekhpar */}
              <g transform="translate(300, 150)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Shekhpar</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">શેખપર</text>
              </g>

              {/* Godavari */}
              <g transform="translate(210, 160)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Godavari</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">ગોદાવરી</text>
              </g>

              {/* Gautamgadh */}
              <g transform="translate(85, 235)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Gautamgadh</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">ગૌતમગઢ</text>
              </g>

              {/* Kukda */}
              <g transform="translate(195, 290)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Kukda</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">કુકડા</text>
              </g>

              {/* Limali */}
              <g transform="translate(350, 290)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Limali</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">લીમલી</text>
              </g>

              {/* Malod */}
              <g transform="translate(485, 300)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Malod</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">માલોદ</text>
              </g>

              {/* Vaghela */}
              <g transform="translate(615, 335)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Vaghela</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">વાઘેલા</text>
              </g>

              {/* Munjpar */}
              <g transform="translate(270, 365)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Munjpar</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">મુંજપર</text>
              </g>

              {/* Jasapar */}
              <g transform="translate(205, 415)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Jasapar</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">જસાપર</text>
              </g>

              {/* Naliya */}
              <g transform="translate(190, 480)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Naliya</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">નળિયા</text>
              </g>

              {/* Chanpar */}
              <g transform="translate(325, 470)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Chanpar</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">ચણપાર</text>
              </g>

              {/* Gundiyala */}
              <g transform="translate(490, 465)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Gundiyala</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">ગુંદિયાળા</text>
              </g>

              {/* Timba */}
              <g transform="translate(565, 440)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Timba</text>
                <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#475569">ટીંબા</text>
              </g>

              {/* Rampada */}
              <g transform="translate(330, 525)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Rampara</text>
              </g>

              {/* Sidhsar */}
              <g transform="translate(80, 535)">
                <circle cx="0" cy="0" r="3" fill="#475569" />
                <text x="0" y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E293B">Sidhsar</text>
              </g>

              {/* Live CCTV Status Nodes (Green, Red, Orange pulsating dots) */}
              {/* Online Nodes */}
              <g transform="translate(535, 185)"><circle cx="0" cy="0" r="4.5" fill="#22C55E" /><circle cx="0" cy="0" r="9" fill="#22C55E" opacity="0.3" /></g>
              <g transform="translate(625, 210)"><circle cx="0" cy="0" r="4" fill="#22C55E" /></g>
              <g transform="translate(310, 155)"><circle cx="0" cy="0" r="4" fill="#22C55E" /></g>
              <g transform="translate(200, 295)"><circle cx="0" cy="0" r="4" fill="#22C55E" /></g>
              <g transform="translate(480, 305)"><circle cx="0" cy="0" r="4" fill="#22C55E" /></g>
              <g transform="translate(560, 445)"><circle cx="0" cy="0" r="4" fill="#22C55E" /></g>

              {/* Degraded Nodes */}
              <g transform="translate(215, 165)"><circle cx="0" cy="0" r="4" fill="#F59E0B" /></g>
              <g transform="translate(355, 295)"><circle cx="0" cy="0" r="4" fill="#F59E0B" /></g>
              <g transform="translate(495, 470)"><circle cx="0" cy="0" r="4" fill="#F59E0B" /></g>

              {/* Offline Nodes */}
              <g transform="translate(90, 240)"><circle cx="0" cy="0" r="4" fill="#EF4444" /></g>
              <g transform="translate(275, 370)"><circle cx="0" cy="0" r="4" fill="#EF4444" /></g>
              <g transform="translate(195, 485)"><circle cx="0" cy="0" r="4" fill="#EF4444" /></g>

            </svg>
          </div>

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
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Distribution Overview
              </h2>
              <button className="text-slate-400 hover:text-slate-700 transition">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Donut Chart & Legend */}
            <div className="mt-5 flex items-center justify-between gap-3">
              
              {/* SVG Donut Chart */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Track Circle */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                  
                  {/* Police 60% (Dark Navy #06152B) */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="none" 
                    stroke="#06152B" 
                    strokeWidth="12" 
                    strokeDasharray="143 239" 
                    strokeDashoffset="0"
                  />

                  {/* Transport 25% (Blue #0052CC) */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="none" 
                    stroke="#0052CC" 
                    strokeWidth="12" 
                    strokeDasharray="60 239" 
                    strokeDashoffset="-143"
                  />

                  {/* Other 15% (Grey #CBD5E1) */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="none" 
                    stroke="#CBD5E1" 
                    strokeWidth="12" 
                    strokeDasharray="36 239" 
                    strokeDashoffset="-203"
                  />
                </svg>

                {/* Donut Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-bold text-slate-900 leading-none">18</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">DEPTS</span>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="space-y-2 text-xs font-medium text-slate-700">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#06152B]"></span>
                  <span>Police: <strong className="font-bold text-slate-900">60%</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#0052CC]"></span>
                  <span>Transport: <strong className="font-bold text-slate-900">25%</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#CBD5E1]"></span>
                  <span>Other: <strong className="font-bold text-slate-900">15%</strong></span>
                </div>
              </div>

            </div>

          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-slate-300/70 my-5"></div>

          {/* Health Trends Bar Chart */}
          <div>
            <div className="text-[10px] font-bold text-slate-600 tracking-wider uppercase mb-3">
              HEALTH TRENDS (LAST 7 DAYS)
            </div>

            {/* 7 Vertical Bar Columns with Navy/Slate Gradient */}
            <div className="h-20 flex items-end justify-between gap-1.5 px-1">
              <div className="w-full bg-[#94A3B8] rounded-t-xs" style={{ height: '35%' }}></div>
              <div className="w-full bg-[#64748B] rounded-t-xs" style={{ height: '55%' }}></div>
              <div className="w-full bg-[#475569] rounded-t-xs" style={{ height: '50%' }}></div>
              <div className="w-full bg-[#1E293B] rounded-t-xs" style={{ height: '78%' }}></div>
              <div className="w-full bg-[#06152B] rounded-t-xs" style={{ height: '95%' }}></div>
              <div className="w-full bg-[#475569] rounded-t-xs" style={{ height: '70%' }}></div>
              <div className="w-full bg-[#94A3B8] rounded-t-xs" style={{ height: '52%' }}></div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Recent System Activity Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table Header Row */}
        <div className="px-5 py-3.5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Recent System Activity
          </h2>
          <button 
            onClick={() => onNavigateTab('audit')}
            className="text-xs font-semibold text-slate-700 hover:text-[#0052CC] flex items-center space-x-1 transition"
          >
            <span>View All Logs</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#EDF3FA] text-slate-800 font-semibold border-y border-slate-200/90">
              <tr>
                <th className="py-2.5 px-5">Timestamp</th>
                <th className="py-2.5 px-5">User</th>
                <th className="py-2.5 px-5">Action</th>
                <th className="py-2.5 px-5">Camera ID / Scope</th>
                <th className="py-2.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-5 text-slate-600 font-mono text-[11px]">2024-05-20 14:32:10</td>
                <td className="py-3 px-5 font-medium text-slate-900 font-mono text-[11px]">j.doe_admin</td>
                <td className="py-3 px-5 text-slate-800">Camera Registered</td>
                <td className="py-3 px-5 font-mono text-slate-700 text-[11px]">CCTV-AHD-0912</td>
                <td className="py-3 px-5 text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold tracking-wider uppercase">
                    SUCCESS
                  </span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-5 text-slate-600 font-mono text-[11px]">2024-05-20 13:15:05</td>
                <td className="py-3 px-5 font-medium text-slate-900 font-mono text-[11px]">sys_automation</td>
                <td className="py-3 px-5 text-slate-800">Health Check Cycle</td>
                <td className="py-3 px-5 font-mono text-slate-700 text-[11px]">Zone 3 (Surat)</td>
                <td className="py-3 px-5 text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold tracking-wider uppercase">
                    COMPLETED
                  </span>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-5 text-slate-600 font-mono text-[11px]">2024-05-20 11:45:22</td>
                <td className="py-3 px-5 font-medium text-slate-900 font-mono text-[11px]">r.sharma_ips</td>
                <td className="py-3 px-5 text-slate-800">Bulk Import</td>
                <td className="py-3 px-5 font-mono text-slate-700 text-[11px]">batch_vadodara_q2</td>
                <td className="py-3 px-5 text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#DBEAFE] text-[#1D4ED8] text-[10px] font-bold tracking-wider uppercase">
                    PROCESSING
                  </span>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-5 text-slate-600 font-mono text-[11px]">2024-05-20 09:10:01</td>
                <td className="py-3 px-5 font-medium text-slate-900 font-mono text-[11px]">api_gateway</td>
                <td className="py-3 px-5 text-slate-800">Stream Disconnect</td>
                <td className="py-3 px-5 font-mono text-slate-700 text-[11px]">CCTV-RJK-4410</td>
                <td className="py-3 px-5 text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-bold tracking-wider uppercase">
                    FAILED
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

      {/* 6. System Architecture Flow (Model 1) Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-8">
          SYSTEM ARCHITECTURE FLOW (MODEL 1)
        </div>

        {/* 4 Connected Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          
          {/* Node 1: Dept Assets */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-[#F1F5F9] border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-900">Dept Assets</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Edge Devices</div>
            
            {/* Arrow connecting to Node 2 */}
            <div className="hidden lg:flex items-center absolute top-7 -right-5 transform -translate-y-1/2 text-slate-300">
              <div className="w-12 border-t-2 border-dashed border-slate-300"></div>
              <span className="text-slate-400 font-bold ml-1 text-xs">{'>'}</span>
            </div>
          </div>

          {/* Node 2: Onboarding */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-[#06152B] flex items-center justify-center text-white shadow-xs mb-3">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-900">Onboarding</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Validation Engine</div>

            {/* Arrow connecting to Node 3 */}
            <div className="hidden lg:flex items-center absolute top-7 -right-5 transform -translate-y-1/2 text-slate-300">
              <div className="w-12 border-t-2 border-dashed border-slate-300"></div>
              <span className="text-slate-400 font-bold ml-1 text-xs">{'>'}</span>
            </div>
          </div>

          {/* Node 3: Central Registry (Highlighted Hero Node) */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0062D2] flex items-center justify-center text-white shadow-md mb-2">
              <Database className="w-7 h-7" />
            </div>
            <div className="text-sm font-bold text-[#0062D2]">Central Registry</div>
            <div className="text-[11px] text-slate-500 mt-0.5">PostgreSQL/GIS</div>

            {/* Arrow connecting to Node 4 */}
            <div className="hidden lg:flex items-center absolute top-7 -right-5 transform -translate-y-1/2 text-slate-300">
              <div className="w-12 border-t-2 border-dashed border-slate-300"></div>
              <span className="text-slate-400 font-bold ml-1 text-xs">{'>'}</span>
            </div>
          </div>

          {/* Node 4: GIS & APIs */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-[#F1F5F9] border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs mb-3">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-900">GIS & APIs</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Consumption Layer</div>
          </div>

        </div>

      </div>

    </div>
  );
};
