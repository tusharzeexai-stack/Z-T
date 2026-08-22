import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Camera, Department, CameraHealthStatus } from '../types';
import { 
  Layers, 
  Search, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  List,
  Eye,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

interface CctvGisViewProps {
  cameras: Camera[];
  departments: Department[];
  currentLang?: string;
  onSelectCamera: (camera: Camera) => void;
  selectedDistrictFilter?: string;
  selectedDeptFilter?: string;
}

// Tile Layer URLs
const TILE_LAYERS = {
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors | Gujarat Police GIS',
    name: 'OpenStreetMap Standard',
  },
  cartoDark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap | Gujarat Police GIS',
    name: 'CartoDB Dark Vector',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS | Gujarat GIS',
    name: 'Esri World Satellite',
  },
};

export const CctvGisView: React.FC<CctvGisViewProps> = ({
  cameras,
  departments,
  onSelectCamera,
  selectedDistrictFilter = 'ALL',
  selectedDeptFilter = 'ALL',
}) => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(cameras[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(selectedDeptFilter);
  const [selectedDistrict, setSelectedDistrict] = useState(selectedDistrictFilter);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeTileLayerKey, setActiveTileLayerKey] = useState<'standard' | 'cartoDark' | 'satellite'>('standard');
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Filtered cameras dataset memoized for 80,000 node scale
  const activeCameras = React.useMemo(() => {
    return cameras.filter(cam => {
      if (cam.lifecycle === 'ARCHIVED') return false;
      if (selectedDept !== 'ALL' && cam.departmentId !== selectedDept) return false;
      if (selectedDistrict !== 'ALL' && cam.district !== selectedDistrict) return false;
      if (selectedStatus !== 'ALL' && cam.healthStatus !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          cam.cameraCode.toLowerCase().includes(q) ||
          cam.name.toLowerCase().includes(q) ||
          cam.district.toLowerCase().includes(q) ||
          cam.departmentName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cameras, selectedDept, selectedDistrict, selectedStatus, searchQuery]);

  // Helper for custom Leaflet divIcon
  const createCustomMarkerIcon = (status: CameraHealthStatus, isSelected: boolean) => {
    let colorHex = '#10B981'; // Online - emerald
    if (status === 'DEGRADED') colorHex = '#F59E0B'; // Degraded - amber
    if (status === 'OFFLINE') colorHex = '#EF4444'; // Offline - red
    if (status === 'UNKNOWN') colorHex = '#6B7280'; // Unknown - grey

    const size = isSelected ? 28 : 22;
    const border = isSelected ? '3px solid #0052CC' : '2px solid #FFFFFF';
    const shadow = isSelected ? 'box-shadow: 0 0 12px rgba(0, 82, 204, 0.8); z-index: 1000;' : 'box-shadow: 0 2px 5px rgba(0,0,0,0.4);';

    const htmlStr = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: ${colorHex};
        border: ${border};
        ${shadow}
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
        transition: transform 0.2s ease;
      ">
        ●
      </div>
    `;

    return L.divIcon({
      html: htmlStr,
      className: 'custom-leaflet-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    // Center on Gujarat state (22.2587° N, 71.1924° E)
    const map = L.map(mapContainerRef.current, {
      center: [22.45, 71.85],
      zoom: 8,
      zoomControl: false,
    });

    const tileLayer = L.tileLayer(TILE_LAYERS[activeTileLayerKey].url, {
      attribution: TILE_LAYERS[activeTileLayerKey].attribution,
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    tileLayerRef.current = tileLayer;
    markersGroupRef.current = markersGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when key changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_LAYERS[activeTileLayerKey].url);
  }, [activeTileLayerKey]);

  // Sync Markers on Map with Spatial Viewport Bounding Box (Max 500 DOM markers on screen)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    const map = mapInstanceRef.current;

    const renderViewportMarkers = () => {
      if (!markersGroupRef.current || !mapInstanceRef.current) return;
      markersGroupRef.current.clearLayers();

      const bounds = map.getBounds();
      // Render only cameras inside current map viewport, capped at 500 max for 60FPS DOM rendering
      const visible = activeCameras
        .filter(c => bounds.contains([c.latitude, c.longitude]))
        .slice(0, 500);

      visible.forEach(cam => {
        const isSelected = selectedCamera?.cameraUuid === cam.cameraUuid;
        const icon = createCustomMarkerIcon(cam.healthStatus, isSelected);

        const marker = L.marker([cam.latitude, cam.longitude], { icon });

        const statusColor = cam.healthStatus === 'ONLINE' ? '#166534' : cam.healthStatus === 'DEGRADED' ? '#92400E' : '#991B1B';
        const statusBg   = cam.healthStatus === 'ONLINE' ? '#DCFCE7' : cam.healthStatus === 'DEGRADED' ? '#FEF3C7' : '#FEE2E2';
        const popupContent = `
          <div style="font-family:'Plus Jakarta Sans',Inter,sans-serif;font-size:12px;padding:4px 2px;min-width:210px;">
            <div style="font-weight:800;font-family:monospace;color:#0052CC;letter-spacing:.04em;">${cam.cameraCode}</div>
            <div style="font-weight:700;color:#0F172A;margin-top:3px;font-size:13px;">${cam.name}</div>
            <div style="color:#64748B;font-size:11px;margin-top:2px;">${cam.district} &bull; ${cam.departmentName}</div>
            <hr style="border:none;border-top:1px solid #E2E8F0;margin:6px 0;"/>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="background:${statusBg};color:${statusColor};font-weight:700;font-size:10px;padding:2px 7px;border-radius:9999px;border:1px solid ${statusColor}40;">${cam.healthStatus}</span>
              <span style="color:#64748B;font-size:10px;">${cam.fps} FPS &bull; ${cam.resolution}</span>
            </div>
            <div style="margin-top:5px;color:#475569;font-size:10px;">
              <span style="font-weight:600;">Type:</span> ${cam.type} &nbsp;|&nbsp;
              <span style="font-weight:600;">Lifecycle:</span> ${cam.lifecycle}
            </div>
            <div style="margin-top:3px;color:#64748B;font-size:10px;">
              <span style="font-weight:600;">VMS:</span> ${cam.vmsPlatformName}
            </div>
            <div style="margin-top:3px;color:#94A3B8;font-size:9.5px;font-family:monospace;">
              ${cam.latitude.toFixed(5)}, ${cam.longitude.toFixed(5)}
            </div>
          </div>
        `;

        const popup = L.popup({ closeButton: false, offset: [0, -10], className: 'ztrac-hover-popup' }).setContent(popupContent);
        marker.bindPopup(popup);

        // Open popup on hover, close on mouse-out
        marker.on('mouseover', function() { marker.openPopup(); });
        marker.on('mouseout',  function() { marker.closePopup(); });
        // Click still selects the camera
        marker.on('click', () => setSelectedCamera(cam));
        markersGroupRef.current?.addLayer(marker);
      });
    };

    renderViewportMarkers();

    // Re-render markers on map pan/zoom for smooth 80k node navigation
    map.on('moveend', renderViewportMarkers);
    map.on('zoomend', renderViewportMarkers);

    return () => {
      map.off('moveend', renderViewportMarkers);
      map.off('zoomend', renderViewportMarkers);
    };
  }, [activeCameras, selectedCamera]);

  // Center map on selected camera when row clicked
  const handleSelectCameraInTable = (cam: Camera) => {
    setSelectedCamera(cam);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([cam.latitude, cam.longitude], 14, { duration: 1.2 });
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedDistrict('ALL');
    setSelectedStatus('ALL');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.45, 71.85], 8);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 select-none">
      
      {/* Top GIS Title & Operational Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF3FA] text-[#0052CC] border border-blue-200">
              PostGIS ↔ Leaflet.js
            </span>
            <span className="text-xs text-slate-500 font-medium">OpenStreetMap Real Vector Grid</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Statewide CCTV GIS Viewport</h1>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-medium text-slate-600 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
            <span>Online ({cameras.filter(c => c.healthStatus === 'ONLINE').length})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
            <span>Degraded ({cameras.filter(c => c.healthStatus === 'DEGRADED').length})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200"></span>
            <span>Offline ({cameras.filter(c => c.healthStatus === 'OFFLINE').length})</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Leaflet Map & Inspector Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Leaflet Map Container */}
        <div className="lg:col-span-2 relative bg-slate-100 rounded-xl border border-slate-300 h-[580px] overflow-hidden shadow-inner flex flex-col">
          
          {/* Map Controls Floating Overlay */}
          <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
            <div className="bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-md flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-400 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search node or location..."
                className="px-2 py-1 text-xs bg-transparent border-none focus:outline-hidden w-36 sm:w-44"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-white/95 backdrop-blur-xs px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 shadow-md text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white/95 backdrop-blur-xs px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 shadow-md text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">Health: All</option>
              <option value="ONLINE">Online Only</option>
              <option value="DEGRADED">Degraded Only</option>
              <option value="OFFLINE">Offline Only</option>
            </select>
          </div>

          {/* Right Floating Map Controls */}
          <div className="absolute top-3 right-3 z-[1000] flex flex-col space-y-2">
            <div className="bg-white/95 backdrop-blur-xs rounded-lg border border-slate-200 shadow-md p-1 flex flex-col space-y-1">
              <button
                title="Zoom In"
                onClick={handleZoomIn}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                title="Zoom Out"
                onClick={handleZoomOut}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsLayerDrawerOpen(p => !p)}
              className="bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-slate-200 shadow-md text-slate-700 hover:text-[#0052CC] transition flex items-center space-x-1 text-xs font-semibold"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Tiles</span>
            </button>
          </div>

          {/* Tile Layer Selector Drawer */}
          {isLayerDrawerOpen && (
            <div className="absolute top-16 right-3 z-[1001] bg-white rounded-xl border border-slate-200 shadow-xl p-3 w-56 space-y-2 text-xs animate-in fade-in">
              <span className="font-bold text-slate-800 block">Basemap Provider</span>
              <div className="space-y-1.5">
                {(Object.keys(TILE_LAYERS) as Array<keyof typeof TILE_LAYERS>).map(k => (
                  <button
                    key={k}
                    onClick={() => {
                      setActiveTileLayerKey(k);
                      setIsLayerDrawerOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md font-medium transition ${activeTileLayerKey === k ? 'bg-[#0052CC] text-white font-bold' : 'hover:bg-slate-100 text-slate-700'}`}
                  >
                    {TILE_LAYERS[k].name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leaflet Map Div */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Scale & EPSG Bar */}
          <div className="absolute bottom-2 left-3 z-[1000] bg-white/80 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-mono text-slate-600 border border-slate-200">
            EPSG:4326 • Gujarat Polygon Bounds • Real OSM Tile Stream
          </div>

        </div>

        {/* Right Col: Selected Camera Node Specification Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          {selectedCamera ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-[#0052CC] border border-blue-200">
                    Selected Node Inspector
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">{selectedCamera.cameraCode}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedCamera.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedCamera.address}</p>
              </div>

              <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800 text-right">{selectedCamera.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">District / Taluka:</span>
                  <span className="font-medium text-slate-800">{selectedCamera.district} ({selectedCamera.taluka || 'Central'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hardware & Type:</span>
                  <span className="font-medium text-slate-800">{selectedCamera.manufacturer} • {selectedCamera.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GPS Coordinates:</span>
                  <span className="font-mono text-slate-800">{selectedCamera.latitude.toFixed(4)}°N, {selectedCamera.longitude.toFixed(4)}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Health Telemetry:</span>
                  <span className={`font-bold ${selectedCamera.healthStatus === 'ONLINE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedCamera.healthStatus} ({selectedCamera.fps} FPS)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Linked VMS:</span>
                  <span className="font-mono text-slate-700">{selectedCamera.vmsPlatformName}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500 block font-medium">Nodal Officer in Charge:</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{selectedCamera.responsibleOfficer.name}</span>
                <span className="text-slate-500 text-[11px] font-mono">{selectedCamera.responsibleOfficer.phone}</span>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Click any map node to inspect metadata</p>
            </div>
          )}

          {selectedCamera && (
            <button
              onClick={() => onSelectCamera(selectedCamera)}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 bg-[#0052CC] text-white text-xs font-semibold rounded-lg hover:bg-[#0041A8] transition shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Open Master Specification</span>
            </button>
          )}
        </div>

      </div>

      {/* Synchronized Bottom Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 bg-[#EDF3FA] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <List className="w-4 h-4 text-[#0052CC]" />
            <span className="text-xs font-bold text-slate-800">Synchronized Geospatial Camera Records ({activeCameras.length})</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Bi-directional Map ↔ Table Linkage Active</span>
        </div>

        <div className="max-h-56 overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-[10px] uppercase tracking-wider border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Name & Location</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">District</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeCameras.map(camera => {
                const isSelected = selectedCamera?.cameraUuid === camera.cameraUuid;
                return (
                  <tr 
                    key={camera.cameraUuid}
                    onClick={() => handleSelectCameraInTable(camera)}
                    className={`hover:bg-blue-50/40 transition cursor-pointer ${isSelected ? 'bg-blue-50/70 font-semibold' : ''}`}
                  >
                    <td className="py-2.5 px-4 font-mono text-[#0052CC]">{camera.cameraCode}</td>
                    <td className="py-2.5 px-4 text-slate-900">{camera.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{camera.departmentName}</td>
                    <td className="py-2.5 px-4">{camera.district}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${camera.healthStatus === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {camera.healthStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCameraInTable(camera);
                        }}
                        className="text-[#0052CC] hover:underline font-semibold text-xs"
                      >
                        Locate on Map
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
