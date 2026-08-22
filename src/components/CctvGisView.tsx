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
  SlidersHorizontal,
  Globe
} from 'lucide-react';

interface CctvGisViewProps {
  cameras: Camera[];
  departments: Department[];
  currentLang?: string;
  onSelectCamera: (camera: Camera) => void;
  selectedDistrictFilter?: string;
  selectedDeptFilter?: string;
}

// Basemap Provider URLs (Google Maps Satellite, Google Hybrid, Esri, CartoDB, OSM)
const TILE_LAYERS = {
  googleHybrid: {
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Satellite + Road Overlay | Gujarat Police GIS',
    name: 'Google Maps Satellite Hybrid 🛰️',
  },
  googleSat: {
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Satellite Imagery | Gujarat Police GIS',
    name: 'Google Maps Satellite (Pure)',
  },
  googleStreets: {
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Vector | Gujarat Police GIS',
    name: 'Google Maps Vector Streets',
  },
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
  const [activeTileLayerKey, setActiveTileLayerKey] = useState<keyof typeof TILE_LAYERS>('googleHybrid');
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Filtered cameras dataset
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
    let colorHex = '#10B981';
    if (status === 'DEGRADED') colorHex = '#F59E0B';
    if (status === 'OFFLINE') colorHex = '#EF4444';
    if (status === 'UNKNOWN') colorHex = '#6B7280';

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
      className: 'custom-gis-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.45, 71.85],
      zoom: 8,
      zoomControl: false,
    });

    const activeConfig = TILE_LAYERS[activeTileLayerKey];
    const initialTileLayer = L.tileLayer(activeConfig.url, {
      attribution: activeConfig.attribution,
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = initialTileLayer;

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when key changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const config = TILE_LAYERS[activeTileLayerKey];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 20,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [activeTileLayerKey]);

  // Update Markers inside map viewport
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const renderViewportMarkers = () => {
      if (!mapInstanceRef.current || !markersGroupRef.current) return;
      const bounds = mapInstanceRef.current.getBounds();

      markersGroupRef.current.clearLayers();

      const visibleCameras = activeCameras.filter(cam =>
        bounds.contains([cam.latitude, cam.longitude])
      ).slice(0, 500);

      visibleCameras.forEach(cam => {
        const isSelected = selectedCamera?.cameraUuid === cam.cameraUuid;
        const icon = createCustomMarkerIcon(cam.healthStatus, isSelected);

        const marker = L.marker([cam.latitude, cam.longitude], { icon });

        const statusBg = cam.healthStatus === 'ONLINE' ? '#DCFCE7' : cam.healthStatus === 'DEGRADED' ? '#FEF3C7' : '#FEE2E2';
        const statusColor = cam.healthStatus === 'ONLINE' ? '#166534' : cam.healthStatus === 'DEGRADED' ? '#92400E' : '#991B1B';

        const popupContent = `
          <div style="font-family:'Plus Jakarta Sans',Inter,sans-serif;font-size:12px;padding:4px 2px;min-width:210px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
              <div style="font-weight:800;color:#0F172A;font-size:12.5px;">${cam.cameraCode}</div>
              <span style="background:${statusBg};color:${statusColor};font-weight:800;font-size:9px;padding:2px 6px;border-radius:9999px;">
                ● ${cam.healthStatus}
              </span>
            </div>
            <div style="color:#334155;font-weight:600;margin-top:2px;">${cam.name}</div>
            <div style="color:#64748B;font-size:10.5px;margin-top:1px;">${cam.address}</div>
            <hr style="border:none;border-top:1px solid #E2E8F0;margin:6px 0;"/>
            <div style="color:#64748B;font-size:10px;">
              <span style="font-weight:600;">Dept:</span> ${cam.departmentName}
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

        marker.on('mouseover', function() { marker.openPopup(); });
        marker.on('mouseout',  function() { marker.closePopup(); });
        marker.on('click', () => setSelectedCamera(cam));
        markersGroupRef.current?.addLayer(marker);
      });
    };

    renderViewportMarkers();

    mapInstanceRef.current.on('moveend', renderViewportMarkers);
    mapInstanceRef.current.on('zoomend', renderViewportMarkers);

    return () => {
      mapInstanceRef.current?.off('moveend', renderViewportMarkers);
      mapInstanceRef.current?.off('zoomend', renderViewportMarkers);
    };
  }, [activeCameras, selectedCamera]);

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

  return (
    <div className="space-y-4 animate-in fade-in duration-150 select-none">
      
      {/* Top GIS Title & Operational Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0052CC] border border-blue-200 flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>Google Maps Satellite & Hybrid Tiles Active</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">PostGIS Spatial Vector Layer</span>
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
              className="bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-slate-200 shadow-md text-[#0052CC] hover:bg-blue-50 transition flex items-center space-x-1.5 text-xs font-bold"
            >
              <Layers className="w-4 h-4 text-[#0052CC]" />
              <span>Satellite & Map Layers</span>
            </button>
          </div>

          {/* Tile Layer Selector Drawer */}
          {isLayerDrawerOpen && (
            <div className="absolute top-16 right-3 z-[1001] bg-white rounded-xl border border-slate-200 shadow-2xl p-3.5 w-64 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900">Basemap Layer Provider</span>
                <span className="text-[10px] bg-blue-100 text-[#0052CC] px-2 py-0.5 rounded font-bold">HD Satellite</span>
              </div>
              <div className="space-y-1.5">
                {(Object.keys(TILE_LAYERS) as Array<keyof typeof TILE_LAYERS>).map(k => (
                  <button
                    key={k}
                    onClick={() => {
                      setActiveTileLayerKey(k);
                      setIsLayerDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition flex items-center justify-between ${
                      activeTileLayerKey === k ? 'bg-[#0052CC] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{TILE_LAYERS[k].name}</span>
                    {activeTileLayerKey === k && <span className="text-[10px]">✓ Active</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leaflet Map Div */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Scale & EPSG Bar */}
          <div className="absolute bottom-2 left-3 z-[1000] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-slate-700 border border-slate-300 shadow-xs flex items-center space-x-2">
            <span>EPSG:4326</span>
            <span>•</span>
            <span className="font-bold text-[#0052CC]">{TILE_LAYERS[activeTileLayerKey].name}</span>
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
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedCamera.healthStatus === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' :
                    selectedCamera.healthStatus === 'DEGRADED' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    ● {selectedCamera.healthStatus}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 tracking-tight">{selectedCamera.cameraCode}</h3>
                <p className="text-xs text-slate-600 font-medium">{selectedCamera.name}</p>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">District / City:</span>
                  <span className="font-bold text-slate-900">{selectedCamera.district}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-900">{selectedCamera.departmentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">VMS Platform:</span>
                  <span className="font-bold text-[#0052CC]">{selectedCamera.vmsPlatformName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Manufacturer & Model:</span>
                  <span className="font-mono text-slate-800">{selectedCamera.manufacturer} {selectedCamera.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="font-mono text-slate-900">{selectedCamera.latitude.toFixed(5)}, {selectedCamera.longitude.toFixed(5)}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectCamera(selectedCamera)}
                className="w-full py-2.5 bg-[#0052CC] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>Open Full Node Dossier & Live Stream</span>
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select a camera node on the satellite map to view details
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
