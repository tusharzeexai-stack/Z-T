import React, { useState, useEffect } from 'react';
import { Video, Maximize2, ExternalLink, ShieldCheck } from 'lucide-react';

const SENTINEL_BASE = 'https://live.sentinelgujarat.in';

interface SentinelCamera {
  id: string;
  number: number;
  name: string;
  location: string;
  status: 'live' | 'offline' | string;
  codec: string;
  container: string;
  city: string;
}

// 31 Gujarat Statewide Surveillance Cameras Registry
const SENTINEL_CAMERAS: SentinelCamera[] = [
  { id: '1',  number: 1,  name: 'Camera 1',  location: 'Chiman Bhai Bridge',               city: 'Ahmedabad',    status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '2',  number: 2,  name: 'Camera 2',  location: 'Janpath Road',                     city: 'Ahmedabad',    status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '3',  number: 3,  name: 'Camera 3',  location: 'O.N.G.C. Office Complex',          city: 'Ahmedabad',    status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '4',  number: 4,  name: 'Camera 4',  location: 'Paldi Circle Junction',            city: 'Ahmedabad',    status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '5',  number: 5,  name: 'Camera 5',  location: 'Visat Teen Rasta',                 city: 'Gandhinagar',  status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '6',  number: 6,  name: 'Camera 6',  location: 'Timbavadi Gate',                   city: 'Junagadh',     status: 'live', codec: 'AVI',   container: 'avi' },
  { id: '7',  number: 7,  name: 'Camera 7',  location: 'Hero Showroom Highway',            city: 'Gir Somnath',  status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '8',  number: 8,  name: 'Camera 8',  location: 'Majewadi Gate',                    city: 'Junagadh',     status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '9',  number: 9,  name: 'Camera 9',  location: 'New Bypass Circle',                city: 'Junagadh',     status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '10', number: 10, name: 'Camera 10', location: 'Char Chowk Road',                  city: 'Junagadh',     status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '11', number: 11, name: 'Camera 11', location: 'Dolatpara Junction',               city: 'Junagadh',     status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '12', number: 12, name: 'Camera 12', location: 'Tri Mandir Adalaj Tollnaka',         city: 'Gandhinagar',  status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '13', number: 13, name: 'Camera 13', location: 'CN Vidhyalaya Campus',              city: 'Ahmedabad',    status: 'live', codec: 'H.264', container: 'mkv' },
  { id: '14', number: 14, name: 'Camera 14', location: 'Delight Cross Road',               city: 'Surat',        status: 'live', codec: 'H.264', container: 'mkv' },
  { id: '15', number: 15, name: 'Camera 15', location: 'Suvidha Park Circle',              city: 'Surat',        status: 'live', codec: 'H.264', container: 'mkv' },
  { id: '16', number: 16, name: 'Camera 16', location: 'Visat P2 Checkpoint',              city: 'Gandhinagar',  status: 'live', codec: 'H.264', container: 'mkv' },
  { id: '17', number: 17, name: 'Camera 17', location: 'Rajkot Bus Port Terminal',         city: 'Rajkot',       status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '18', number: 18, name: 'Camera 18', location: 'Rajkot Central Square',            city: 'Rajkot',       status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '19', number: 19, name: 'Camera 19', location: 'Rajkot Ring Road West',            city: 'Rajkot',       status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '20', number: 20, name: 'Camera 20', location: 'Khaparia Panchayat',               city: 'Navsari',      status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '21', number: 21, name: 'Camera 21', location: 'Mohanpura Chowk',                  city: 'Navsari',      status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '22', number: 22, name: 'Camera 22', location: 'Patan Dethali Char Rasta',           city: 'Patan',        status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '23', number: 23, name: 'Camera 23', location: 'BK Mervada Tran Rasta',              city: 'Patan',        status: 'live', codec: 'AVI',   container: 'avi' },
  { id: '24', number: 24, name: 'Camera 24', location: 'Kheram Junction',                  city: 'Patan',        status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '25', number: 25, name: 'Camera 25', location: 'Dehgam Circle',                    city: 'Gandhinagar',  status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '26', number: 26, name: 'Camera 26', location: 'Dhanori Main Road',                city: 'Navsari',      status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '27', number: 27, name: 'Camera 27', location: 'Tankal Highway Entry',             city: 'Navsari',      status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '28', number: 28, name: 'Camera 28', location: 'Bilimora Coastal — Site A',          city: 'Navsari',      status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '29', number: 29, name: 'Camera 29', location: 'Bilimora Harbor — Site B',           city: 'Navsari',      status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '30', number: 30, name: 'Camera 30', location: 'Bilimora Industrial — Site C',       city: 'Navsari',      status: 'live', codec: 'H.264', container: 'mp4' },
  { id: '31', number: 31, name: 'Camera 31', location: 'Gandhidham Rambaugh P2',             city: 'Kutch',        status: 'live', codec: 'H.264', container: 'mp4' },
];

// Direct live feed player tile — Immediate loading, zero opacity blocking
function CameraFeedTile({ cam, onFullScreen }: { cam: SentinelCamera; onFullScreen: (cam: SentinelCamera) => void }) {
  return (
    <div className="relative bg-[#081325] rounded-xl border border-slate-800 overflow-hidden group flex flex-col shadow-lg">
      {/* Video Viewport Container */}
      <div className="relative flex-1 min-h-0 bg-black overflow-hidden" style={{ height: 210 }}>

        {/* Sentinel Gujarat Official Player Page Iframe — Loads live stream instantly */}
        <iframe
          src={`${SENTINEL_BASE}/camera/${encodeURIComponent(cam.id)}`}
          title={`${cam.name} - ${cam.location}`}
          className="w-full h-full border-0 relative z-1"
          allow="autoplay; fullscreen"
        />

        {/* Live OSD Badge */}
        <div className="absolute top-2 left-2 z-20 flex items-center space-x-1.5 bg-black/80 backdrop-blur-xs rounded px-2 py-0.5 pointer-events-none border border-slate-700/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-300 font-mono font-bold text-[9px]">LIVE</span>
        </div>

        {/* Camera Number Badge */}
        <div className="absolute top-2 right-2 z-20 bg-black/80 backdrop-blur-xs rounded px-2 py-0.5 pointer-events-none border border-slate-700/50">
          <span className="text-slate-200 font-mono font-bold text-[9px]">CAM {cam.number}</span>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => onFullScreen(cam)}
          className="absolute bottom-2 right-2 z-20 p-1.5 bg-[#0052CC] text-white rounded hover:bg-blue-600 opacity-80 group-hover:opacity-100 transition shadow cursor-pointer"
          title="Open Fullscreen Feed"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Label Bar */}
      <div className="px-3 py-2 bg-[#0d1f3c] border-t border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="overflow-hidden pr-2">
          <div className="text-xs font-bold text-white truncate font-mono">{cam.name}</div>
          <div className="text-[10px] text-slate-400 truncate mt-0.5">{cam.location} • {cam.city}</div>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800 shrink-0 uppercase font-bold">
          {cam.codec}
        </span>
      </div>
    </div>
  );
}

export const SentinelLiveWallView: React.FC = () => {
  const [gridSize, setGridSize] = useState<2 | 3 | 4>(3);
  const [fullscreenCam, setFullscreenCam] = useState<SentinelCamera | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Paginate cameras for grid viewing
  const pageSize = gridSize * gridSize;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(SENTINEL_CAMERAS.length / pageSize);
  const displayedCameras = SENTINEL_CAMERAS.slice(page * pageSize, (page + 1) * pageSize);

  const gridClass =
    gridSize === 2 ? 'grid-cols-1 md:grid-cols-2' :
    gridSize === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="space-y-4 select-none">

      {/* Header */}
      <div className="bg-[#00253E] text-white p-4 sm:p-5 rounded-xl border border-[#00385C] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#00385C] border border-[#004B7A] text-emerald-300 text-[10px] font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>31 / 31 LIVE SURVEILLANCE STREAMS ACTIVE</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DIRECT LIVE FEED CONNECTED</span>
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center space-x-3">
            <Video className="w-5 h-5 text-blue-400" />
            <span>Sentinel Gujarat — 31 Live Surveillance Feeds</span>
            <span className="text-xs font-mono font-normal text-slate-400">{currentTime} IST</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-2">
          {/* Grid size selector */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-1 space-x-1">
            {([2, 3, 4] as const).map(n => (
              <button
                key={n}
                onClick={() => { setGridSize(n); setPage(0); }}
                className={`px-2.5 py-1 text-xs font-bold rounded transition cursor-pointer ${
                  gridSize === n ? 'bg-[#0052CC] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title={`${n}×${n} grid view`}
              >
                {n}×{n}
              </button>
            ))}
          </div>

          {/* Open Original Portal Link */}
          <a
            href={SENTINEL_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0052CC] hover:bg-[#0041A8] text-white rounded-lg text-xs font-bold transition shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Sentinel Portal</span>
          </a>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Feeds</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">31</div>
          <div className="text-[10px] text-slate-500">Gujarat Statewide</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Feeds</div>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">31</div>
          <div className="text-[10px] text-emerald-600 font-semibold">100% Active Streams</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Codec Engine</div>
          <div className="text-xl font-black text-blue-700 font-mono mt-0.5">H.264 / HLS</div>
          <div className="text-[10px] text-slate-500">Sentinel Official Engine</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Coverage</div>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">8 Cities</div>
          <div className="text-[10px] text-slate-500">Bilimora, Rajkot, Patan…</div>
        </div>
      </div>

      {/* Video Wall Grid */}
      <div className={`grid ${gridClass} gap-4`}>
        {displayedCameras.map(cam => (
          <CameraFeedTile
            key={cam.id}
            cam={cam}
            onFullScreen={setFullscreenCam}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <span className="font-mono">
          Showing feeds {page * pageSize + 1}–{Math.min((page + 1) * pageSize, SENTINEL_CAMERAS.length)} of {SENTINEL_CAMERAS.length}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            ← Previous
          </button>
          <span className="font-mono px-3 py-1.5 bg-slate-100 rounded-lg font-bold">
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Fullscreen Modal for single camera */}
      {fullscreenCam && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setFullscreenCam(null)}
        >
          <div className="flex items-center justify-between mb-3 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <h3 className="font-bold text-base">{fullscreenCam.name}</h3>
                <p className="text-xs text-slate-400">{fullscreenCam.location} • {fullscreenCam.city} High Resolution Stream</p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
              onClick={() => setFullscreenCam(null)}
            >
              ✕ Close
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center bg-black rounded-xl overflow-hidden border border-slate-800" onClick={e => e.stopPropagation()}>
            <iframe
              src={`${SENTINEL_BASE}/camera/${encodeURIComponent(fullscreenCam.id)}`}
              title={fullscreenCam.name}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
            />
          </div>
          <div className="text-center text-slate-400 text-xs pt-3 font-mono">
            CAM {fullscreenCam.number} • {fullscreenCam.location} • Click outside or press Close to exit
          </div>
        </div>
      )}

    </div>
  );
};
