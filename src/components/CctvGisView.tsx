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
  Globe,
  Camera as CameraIcon,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface CctvGisViewProps {
  cameras: Camera[];
  departments: Department[];
  currentLang?: string;
  onSelectCamera: (camera: Camera) => void;
  selectedDistrictFilter?: string;
  selectedDeptFilter?: string;
}

interface DistrictHubCard {
  name: string;
  districtKey: string;
  onlinePct: string;
  camerasCount: string;
  rawCount: number;
  hubName: string;
  lat: number;
  lng: number;
  zoom: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
}

// Complete 33 Districts of Gujarat Dataset
const GUJARAT_33_DISTRICTS: DistrictHubCard[] = [
  { name: 'Ahmedabad', districtKey: 'Ahmedabad', onlinePct: '100% ONLINE', camerasCount: '2,840', rawCount: 2840, hubName: 'Hub: Ahmedabad City Command', lat: 23.0225, lng: 72.5714, zoom: 12, status: 'ONLINE' },
  { name: 'Surat', districtKey: 'Surat', onlinePct: '98.9% ONLINE', camerasCount: '2,150', rawCount: 2150, hubName: 'Hub: Surat Smart City CCC', lat: 21.1702, lng: 72.8311, zoom: 12, status: 'ONLINE' },
  { name: 'Vadodara', districtKey: 'Vadodara', onlinePct: '99.2% ONLINE', camerasCount: '1,620', rawCount: 1620, hubName: 'Hub: Vadodara Urban CCC', lat: 22.3072, lng: 73.1812, zoom: 12, status: 'ONLINE' },
  { name: 'Rajkot', districtKey: 'Rajkot', onlinePct: '97.5% ONLINE', camerasCount: '1,280', rawCount: 1280, hubName: 'Hub: Rajkot Range Police HQ', lat: 22.3039, lng: 70.8022, zoom: 12, status: 'ONLINE' },
  { name: 'Gandhinagar', districtKey: 'Gandhinagar', onlinePct: '100% ONLINE', camerasCount: '950', rawCount: 950, hubName: 'Hub: State Command Center (HQ)', lat: 23.2156, lng: 72.6369, zoom: 12, status: 'ONLINE' },
  { name: 'Bhavnagar', districtKey: 'Bhavnagar', onlinePct: '96.8% ONLINE', camerasCount: '740', rawCount: 740, hubName: 'Hub: Bhavnagar District Control', lat: 21.7645, lng: 72.1519, zoom: 12, status: 'ONLINE' },
  { name: 'Jamnagar', districtKey: 'Jamnagar', onlinePct: '98.1% ONLINE', camerasCount: '620', rawCount: 620, hubName: 'Hub: Jamnagar Police HQ', lat: 22.4707, lng: 70.0577, zoom: 12, status: 'ONLINE' },
  { name: 'Junagadh', districtKey: 'Junagadh', onlinePct: '97.0% ONLINE', camerasCount: '540', rawCount: 540, hubName: 'Hub: Junagadh Range CCC', lat: 21.5222, lng: 70.4579, zoom: 12, status: 'ONLINE' },
  { name: 'Surendranagar', districtKey: 'Surendranagar', onlinePct: '99.0% ONLINE', camerasCount: '480', rawCount: 480, hubName: 'Hub: Surendranagar SP Office', lat: 22.7224, lng: 71.6370, zoom: 12, status: 'ONLINE' },
  { name: 'Kutch (Bhuj)', districtKey: 'Kutch', onlinePct: '95.9% ONLINE', camerasCount: '690', rawCount: 690, hubName: 'Hub: Kutch Border Range CCC', lat: 23.2420, lng: 69.6669, zoom: 11, status: 'ONLINE' },
  { name: 'Mehsana', districtKey: 'Mehsana', onlinePct: '98.4% ONLINE', camerasCount: '410', rawCount: 410, hubName: 'Hub: Mehsana District Control', lat: 23.5880, lng: 72.3693, zoom: 12, status: 'ONLINE' },
  { name: 'Navsari', districtKey: 'Navsari', onlinePct: '380 CAMS', camerasCount: '380', rawCount: 380, hubName: 'Hub: Navsari Police Control', lat: 20.9467, lng: 72.9520, zoom: 12, status: 'ONLINE' },
  { name: 'Anand', districtKey: 'Anand', onlinePct: '98.6% ONLINE', camerasCount: '520', rawCount: 520, hubName: 'Hub: Anand District Command', lat: 22.5645, lng: 72.9289, zoom: 12, status: 'ONLINE' },
  { name: 'Bharuch', districtKey: 'Bharuch', onlinePct: '97.8% ONLINE', camerasCount: '610', rawCount: 610, hubName: 'Hub: Bharuch Industrial CCC', lat: 21.7051, lng: 72.9959, zoom: 12, status: 'ONLINE' },
  { name: 'Banaskantha', districtKey: 'Banaskantha', onlinePct: '96.2% ONLINE', camerasCount: '490', rawCount: 490, hubName: 'Hub: Palanpur SP Office', lat: 24.1724, lng: 72.4382, zoom: 12, status: 'ONLINE' },
  { name: 'Sabarkantha', districtKey: 'Sabarkantha', onlinePct: '97.4% ONLINE', camerasCount: '360', rawCount: 360, hubName: 'Hub: Himmatnagar Control', lat: 23.5979, lng: 72.9698, zoom: 12, status: 'ONLINE' },
  { name: 'Patan', districtKey: 'Patan', onlinePct: '98.0% ONLINE', camerasCount: '320', rawCount: 320, hubName: 'Hub: Patan District Control', lat: 23.8493, lng: 72.1266, zoom: 12, status: 'ONLINE' },
  { name: 'Amreli', districtKey: 'Amreli', onlinePct: '96.5% ONLINE', camerasCount: '290', rawCount: 290, hubName: 'Hub: Amreli SP Office', lat: 21.6032, lng: 71.2221, zoom: 12, status: 'ONLINE' },
  { name: 'Porbandar', districtKey: 'Porbandar', onlinePct: '98.2% ONLINE', camerasCount: '310', rawCount: 310, hubName: 'Hub: Porbandar Coastal Command', lat: 21.6417, lng: 69.6293, zoom: 12, status: 'ONLINE' },
  { name: 'Gir Somnath', districtKey: 'Gir Somnath', onlinePct: '97.9% ONLINE', camerasCount: '420', rawCount: 420, hubName: 'Hub: Veraval Coastal HQ', lat: 20.9042, lng: 70.3649, zoom: 12, status: 'ONLINE' },
  { name: 'Botad', districtKey: 'Botad', onlinePct: '98.5% ONLINE', camerasCount: '230', rawCount: 230, hubName: 'Hub: Botad SP Office', lat: 22.1704, lng: 71.6687, zoom: 12, status: 'ONLINE' },
  { name: 'Morbi', districtKey: 'Morbi', onlinePct: '97.1% ONLINE', camerasCount: '450', rawCount: 450, hubName: 'Hub: Morbi Ceramic Grid CCC', lat: 22.8173, lng: 70.8370, zoom: 12, status: 'ONLINE' },
  { name: 'Devbhumi Dwarka', districtKey: 'Devbhumi Dwarka', onlinePct: '98.8% ONLINE', camerasCount: '280', rawCount: 280, hubName: 'Hub: Dwarka Pilgrim Security', lat: 22.2394, lng: 68.9678, zoom: 12, status: 'ONLINE' },
  { name: 'Panchmahal', districtKey: 'Panchmahal', onlinePct: '96.9% ONLINE', camerasCount: '340', rawCount: 340, hubName: 'Hub: Godhra Control Room', lat: 22.7780, lng: 73.6143, zoom: 12, status: 'ONLINE' },
  { name: 'Dahod', districtKey: 'Dahod', onlinePct: '95.8% ONLINE', camerasCount: '310', rawCount: 310, hubName: 'Hub: Dahod Tribal Border HQ', lat: 22.8347, lng: 74.2565, zoom: 12, status: 'ONLINE' },
  { name: 'Mahisagar', districtKey: 'Mahisagar', onlinePct: '97.2% ONLINE', camerasCount: '250', rawCount: 250, hubName: 'Hub: Lunawada Control', lat: 23.1319, lng: 73.6143, zoom: 12, status: 'ONLINE' },
  { name: 'Chhota Udepur', districtKey: 'Chhota Udepur', onlinePct: '96.0% ONLINE', camerasCount: '210', rawCount: 210, hubName: 'Hub: Chhota Udepur SP Office', lat: 22.3080, lng: 74.0150, zoom: 12, status: 'ONLINE' },
  { name: 'Narmada', districtKey: 'Narmada', onlinePct: '99.4% ONLINE', camerasCount: '260', rawCount: 260, hubName: 'Hub: Rajpipla SOU CCC', lat: 21.8704, lng: 73.5026, zoom: 12, status: 'ONLINE' },
  { name: 'Tapi', districtKey: 'Tapi', onlinePct: '96.6% ONLINE', camerasCount: '240', rawCount: 240, hubName: 'Hub: Vyara SP Office', lat: 21.1147, lng: 73.3934, zoom: 12, status: 'ONLINE' },
  { name: 'Dang', districtKey: 'Dang', onlinePct: '95.2% ONLINE', camerasCount: '180', rawCount: 180, hubName: 'Hub: Ahwa Forest Post', lat: 20.7534, lng: 73.6853, zoom: 12, status: 'DEGRADED' },
  { name: 'Valsad', districtKey: 'Valsad', onlinePct: '98.7% ONLINE', camerasCount: '390', rawCount: 390, hubName: 'Hub: Valsad Coastal Control', lat: 20.5992, lng: 72.9342, zoom: 12, status: 'ONLINE' },
  { name: 'Aravalli', districtKey: 'Aravalli', onlinePct: '97.3% ONLINE', camerasCount: '220', rawCount: 220, hubName: 'Hub: Modasa Control Room', lat: 23.4647, lng: 73.3005, zoom: 12, status: 'ONLINE' },
  { name: 'Kheda', districtKey: 'Kheda', onlinePct: '98.3% ONLINE', camerasCount: '430', rawCount: 430, hubName: 'Hub: Nadiad SP Office', lat: 22.6916, lng: 72.8634, zoom: 12, status: 'ONLINE' },
];

// Basemap Provider URLs
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

  // Helper for rendering dynamic District Camera Count Pill Markers on Map
  const createDistrictPillIcon = (dist: DistrictHubCard, isSelected: boolean) => {
    const colorHex = dist.status === 'ONLINE' ? '#10B981' : dist.status === 'DEGRADED' ? '#F59E0B' : '#EF4444';
    const border = isSelected ? '2px solid #0052CC' : '1.5px solid rgba(255,255,255,0.9)';
    const bg = isSelected ? '#0052CC' : 'rgba(15, 23, 42, 0.92)';
    const textColor = '#FFFFFF';

    const htmlStr = `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: ${bg};
        color: ${textColor};
        padding: 3px 8px;
        border-radius: 9999px;
        border: ${border};
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        font-family: 'Plus Jakarta Sans', Inter, sans-serif;
        white-space: nowrap;
        cursor: pointer;
        transition: transform 0.15s ease;
      ">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${colorHex}; display: inline-block;"></span>
        <span style="font-weight: 800; font-size: 11px; tracking: -0.01em;">${dist.name}</span>
        <span style="background: rgba(255,255,255,0.2); font-weight: 800; font-size: 10px; padding: 1px 5px; border-radius: 4px; font-family: monospace;">${dist.camerasCount} Cams</span>
      </div>
    `;

    return L.divIcon({
      html: htmlStr,
      className: 'custom-district-pill-marker',
      iconSize: [120, 26],
      iconAnchor: [60, 13],
    });
  };

  // Helper for camera node marker icon
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

  // Render Map Markers (both 33 District Hub Count Markers & Camera Node Markers)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const renderMapMarkers = () => {
      if (!mapInstanceRef.current || !markersGroupRef.current) return;
      markersGroupRef.current.clearLayers();

      const currentZoom = mapInstanceRef.current.getZoom();

      // Render 33 District Camera Count Pill Markers across all Gujarat
      GUJARAT_33_DISTRICTS.forEach(dist => {
        if (selectedDistrict !== 'ALL' && dist.districtKey !== selectedDistrict) return;

        const isSelected = selectedDistrict === dist.districtKey;
        const icon = createDistrictPillIcon(dist, isSelected);
        const marker = L.marker([dist.lat, dist.lng], { icon });

        const popupContent = `
          <div style="font-family:'Plus Jakarta Sans',Inter,sans-serif;font-size:12px;padding:4px 2px;min-width:220px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
              <div style="font-weight:800;color:#0F172A;font-size:13px;">${dist.name} District</div>
              <span style="background:#DCFCE7;color:#166534;font-weight:800;font-size:9px;padding:2px 6px;border-radius:9999px;">
                ${dist.onlinePct}
              </span>
            </div>
            <div style="color:#0052CC;font-weight:800;font-size:13px;margin-top:3px;">${dist.camerasCount} Active CCTV Cameras</div>
            <div style="color:#64748B;font-size:10.5px;margin-top:2px;">${dist.hubName}</div>
          </div>
        `;

        marker.bindPopup(L.popup({ closeButton: false, offset: [0, -10] }).setContent(popupContent));
        marker.on('mouseover', () => marker.openPopup());
        marker.on('mouseout', () => marker.closePopup());
        marker.on('click', () => {
          setSelectedDistrict(dist.districtKey);
          mapInstanceRef.current?.flyTo([dist.lat, dist.lng], 12, { duration: 1.2 });
        });

        markersGroupRef.current?.addLayer(marker);
      });

      // Also render granular camera nodes when zoomed in or filtered
      const bounds = mapInstanceRef.current.getBounds();
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
          </div>
        `;

        marker.bindPopup(L.popup({ closeButton: false, offset: [0, -10] }).setContent(popupContent));
        marker.on('mouseover', () => marker.openPopup());
        marker.on('mouseout', () => marker.closePopup());
        marker.on('click', () => setSelectedCamera(cam));

        markersGroupRef.current?.addLayer(marker);
      });
    };

    renderMapMarkers();

    mapInstanceRef.current.on('moveend', renderMapMarkers);
    mapInstanceRef.current.on('zoomend', renderMapMarkers);

    return () => {
      mapInstanceRef.current?.off('moveend', renderMapMarkers);
      mapInstanceRef.current?.off('zoomend', renderMapMarkers);
    };
  }, [activeCameras, selectedCamera, selectedDistrict]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleSelectDistrictHub = (card: DistrictHubCard) => {
    const targetDist = card.districtKey;
    setSelectedDistrict(prev => prev === targetDist ? 'ALL' : targetDist);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([card.lat, card.lng], card.zoom, { duration: 1.2 });
    }
  };

  // Total active camera count across all 33 districts
  const totalStatewideCamerasCount = GUJARAT_33_DISTRICTS.reduce((sum, d) => sum + d.rawCount, 0).toLocaleString();

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
            <span className="text-xs text-slate-500 font-medium">PostGIS Spatial Vector Layer • 33 Gujarat Districts</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Statewide CCTV GIS Viewport — {totalStatewideCamerasCount} Active Cameras
          </h1>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-medium text-slate-600 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
            <span>33 District Control Hubs</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Online (21,740)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Degraded (1,840)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Offline (1,280)</span>
          </div>
        </div>
      </div>

      {/* Complete 33 Districts Command Hub Cards Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>33 Official Gujarat District Command Hubs ({totalStatewideCamerasCount} Total Cameras)</span>
          </h2>
          {selectedDistrict !== 'ALL' && (
            <button
              onClick={() => { setSelectedDistrict('ALL'); mapInstanceRef.current?.flyTo([22.45, 71.85], 8); }}
              className="text-xs font-bold text-[#0052CC] hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show All 33 Districts</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
          {GUJARAT_33_DISTRICTS.map(card => {
            const isSelected = selectedDistrict === card.districtKey;

            return (
              <div
                key={card.name}
                onClick={() => handleSelectDistrictHub(card)}
                className={`bg-white rounded-xl p-3 border transition-all duration-150 cursor-pointer shadow-2xs flex flex-col justify-between group ${
                  isSelected ? 'border-[#0052CC] ring-2 ring-blue-100 shadow-md bg-blue-50/30' : 'border-slate-200 hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight group-hover:text-[#0052CC] transition truncate pr-1">
                    {card.name}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {card.onlinePct}
                  </span>
                </div>

                <div className="mt-2 space-y-0.5">
                  <div className="text-[11px] font-medium text-slate-500 flex items-center">
                    <CameraIcon className="w-3 h-3 text-[#0052CC] mr-1" />
                    <strong className="text-slate-900 font-extrabold mr-1">{card.camerasCount}</strong>
                    <span>Cameras</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {card.hubName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Leaflet Map & Inspector Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Leaflet Satellite Map Container */}
        <div className="lg:col-span-2 relative bg-slate-100 rounded-xl border border-slate-300 h-[600px] overflow-hidden shadow-inner flex flex-col">
          
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
            <span>•</span>
            <span className="font-bold text-emerald-700">All 33 Districts Rendered</span>
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
                className="w-full py-2.5 bg-[#0052CC] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
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
