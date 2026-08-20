import React, { useState } from 'react';
import { Camera, Department, District } from '../types';
import { 
  Plus, 
  Upload, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  FileSpreadsheet, 
  Server, 
  FileCheck,
  ShieldCheck,
  Database,
  Radio,
  Cpu,
  MapPin,
  Check
} from 'lucide-react';

interface OnboardingViewProps {
  departments: Department[];
  districts: District[];
  currentLang?: string;
  onAddCamera: (camera: Camera) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  departments,
  districts,
  onAddCamera,
}) => {
  const [activeMethod, setActiveMethod] = useState<'manual' | 'bulk' | 'api'>('manual');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdCamera, setCreatedCamera] = useState<Camera | null>(null);

  // Manual Form State (8-Step Comprehensive Pipeline)
  const [formData, setFormData] = useState({
    // Step 1: Identity
    cameraCode: `CAM-GJ-AHM-POL-${Math.floor(100000 + Math.random() * 900000)}`,
    name: '',
    type: 'Fixed Bullet' as const,
    
    // Step 2: Location
    latitude: '23.0225',
    longitude: '72.5714',
    address: '',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    taluka: 'City Central',

    // Step 3: Ownership
    departmentId: departments[0]?.id || 'DEPT-POL-01',
    owner: 'Gujarat Police',
    officerName: 'P. M. Chudasama',
    officerRank: 'DySP (Traffic)',
    officerPhone: '+91 79 2658 0001',
    officerEmail: 'dysp.traffic@gujarat.gov.in',

    // Step 4: Technical
    manufacturer: 'Hikvision',
    model: 'DS-2CD2043G2-I',
    firmwareVersion: 'v5.7.12',
    resolution: '4MP (2560x1440)',
    ptzSupport: false,
    installationDate: new Date().toISOString().slice(0, 10),

    // Step 5: Connectivity & VMS Reference
    networkType: 'Fiber WAN' as const,
    vmsPlatformId: 'VMS-MIL-01',
    vmsPlatformName: 'Milestone XProtect Corporate',
    protocol: 'ONVIF Profile S' as const,
    endpointReference: 'vms://ahm-police-wan/cam-new-reg',

    // Step 6: Storage
    storageType: 'Department SAN' as const,
    retentionDays: 30,

    // Step 7: Capabilities
    anpr: true,
    vehicleDetection: true,
    personDetection: true,
    edgeAI: false,
  });

  // Bulk Ingestion State
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkStatus, setBulkStatus] = useState<'idle' | 'validating' | 'preview' | 'completed'>('idle');

  // API Ingestion State
  const [apiEndpoint, setApiEndpoint] = useState('https://smartcity-api.ahmedabadcity.gov.in/v1/cctv-registry');
  const [apiToken, setApiToken] = useState('ztracs_live_tok_99182a8bf32e');
  const [apiSyncStatus, setApiSyncStatus] = useState<'idle' | 'testing' | 'connected'>('idle');

  const handleStepSubmit = () => {
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Create master record
      const selectedDept = departments.find(d => d.id === formData.departmentId);
      const newCam: Camera = {
        cameraUuid: `uuid-gen-${Date.now()}`,
        cameraCode: formData.cameraCode,
        name: formData.name || 'New Registered Surveillance Node',
        type: formData.type as any,
        lifecycle: 'ACTIVE',
        healthStatus: 'ONLINE',
        latitude: parseFloat(formData.latitude) || 23.0225,
        longitude: parseFloat(formData.longitude) || 72.5714,
        address: formData.address || 'Civil Lines Ring Road Sector 4',
        city: formData.city,
        district: formData.district,
        taluka: formData.taluka,
        departmentId: formData.departmentId,
        departmentName: selectedDept?.name || 'Gujarat Police',
        owner: formData.owner,
        responsibleOfficer: {
          name: formData.officerName,
          designation: formData.officerRank,
          phone: formData.officerPhone,
          email: formData.officerEmail,
        },
        manufacturer: formData.manufacturer,
        model: formData.model,
        firmwareVersion: formData.firmwareVersion,
        resolution: formData.resolution,
        ptzSupport: formData.ptzSupport,
        installationDate: formData.installationDate,
        networkType: formData.networkType,
        vmsPlatformId: formData.vmsPlatformId,
        vmsPlatformName: formData.vmsPlatformName,
        protocol: formData.protocol,
        endpointReference: formData.endpointReference,
        storageType: formData.storageType,
        retentionDays: Number(formData.retentionDays),
        capabilities: {
          anpr: formData.anpr,
          vehicleDetection: formData.vehicleDetection,
          personDetection: formData.personDetection,
          edgeAI: formData.edgeAI,
          otherAnalytics: ['Standard Edge Flagging'],
        },
        lastHeartbeat: 'Just now (Initial Provisioning Complete)',
        fps: 30,
        bitrate: 4096,
        availability: 100,
        deviceHealth: 'Nominal',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        createdBy: 'Admin / Rajesh K. Sharma, IPS',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updatedBy: 'Admin',
      };

      onAddCamera(newCam);
      setCreatedCamera(newCam);
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF3FA] text-[#0052CC] border border-blue-200">
              Camera Onboarding Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">Model 1 Ingestion Suite</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Surveillance Asset Registration</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register new institutional CCTV nodes into the Central Master Registry & PostGIS foundation
          </p>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex items-center bg-[#EDF3FA] p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveMethod('manual')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition ${activeMethod === 'manual' ? 'bg-[#0052CC] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Registration</span>
          </button>
          <button
            onClick={() => setActiveMethod('bulk')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition ${activeMethod === 'bulk' ? 'bg-[#0052CC] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk CSV/XLSX</span>
          </button>
          <button
            onClick={() => setActiveMethod('api')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition ${activeMethod === 'api' ? 'bg-[#0052CC] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Department API</span>
          </button>
        </div>
      </div>

      {/* METHOD 1: 8-STEP MANUAL ONBOARDING */}
      {activeMethod === 'manual' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {/* Step Progress Tracker */}
          <div className="bg-[#EDF3FA] p-4 border-b border-slate-200 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px]">
              {[
                '1. Identity',
                '2. Location',
                '3. Ownership',
                '4. Specs',
                '5. Connectivity',
                '6. Storage',
                '7. Capabilities',
                '8. Review',
              ].map((stepLabel, idx) => {
                const stepNum = idx + 1;
                const isCurrent = currentStep === stepNum;
                const isDone = currentStep > stepNum;
                return (
                  <div key={stepNum} className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-[#0052CC] text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isDone ? <Check className="w-3.5 h-3.5" /> : stepNum}
                    </div>
                    <span className={`text-xs font-medium ${isCurrent ? 'text-[#0052CC] font-bold' : 'text-slate-600'}`}>
                      {stepLabel}
                    </span>
                    {stepNum < 8 && <div className="w-4 h-0.5 bg-slate-300"></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 max-w-3xl mx-auto space-y-6">
            
            {/* Step 1: Camera Identity */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 1: Camera Identity & Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Generated Master Camera Code (Mandatory):</label>
                    <input
                      type="text"
                      value={formData.cameraCode}
                      onChange={(e) => setFormData({ ...formData, cameraCode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:ring-1 focus:ring-[#0052CC]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Camera Optical Type:</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                    >
                      <option value="Fixed Bullet">Fixed Bullet Camera</option>
                      <option value="PTZ">PTZ (Pan-Tilt-Zoom)</option>
                      <option value="Dome">Dome Surveillance Camera</option>
                      <option value="ANPR">ANPR Automatic Number Plate Capture</option>
                      <option value="Thermal">Thermal Perimeter Camera</option>
                      <option value="360 Panoramic">360-Degree Panoramic</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Landmark / Installation Site Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Ring Road Junction Gate 2 North"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 2: Geospatial Coordinates & Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Latitude (WGS84 N):</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Longitude (WGS84 E):</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">District:</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    >
                      {districts.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City / Municipality:</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Full Physical Street Address:</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Near Old Collector Office, Main Station Chowk"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Ownership */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 3: Departmental Ownership & Nodal Officer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Parent Department:</label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Asset Owning Entity:</label>
                    <input
                      type="text"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Responsible Nodal Officer:</label>
                    <input
                      type="text"
                      value={formData.officerName}
                      onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Officer Official Email:</label>
                    <input
                      type="email"
                      value={formData.officerEmail}
                      onChange={(e) => setFormData({ ...formData, officerEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Technical Specifications */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 4: Hardware Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Manufacturer:</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hardware Model Number:</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Firmware Version:</label>
                    <input
                      type="text"
                      value={formData.firmwareVersion}
                      onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Optical Resolution:</label>
                    <select
                      value={formData.resolution}
                      onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    >
                      <option value="4K (3840x2160)">4K Ultra HD (3840x2160)</option>
                      <option value="4MP (2560x1440)">4MP Quad HD (2560x1440)</option>
                      <option value="1080p Full HD">1080p Full HD (1920x1080)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Connectivity & VMS Reference */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 5: Connectivity & Linked VMS Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Network Transmission:</label>
                    <select
                      value={formData.networkType}
                      onChange={(e) => setFormData({ ...formData, networkType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    >
                      <option value="Fiber WAN">Fiber WAN (Government Closed Grid)</option>
                      <option value="SWAN Leased Line">SWAN Leased Line</option>
                      <option value="4G/5G Wireless">4G/5G Encrypted Wireless</option>
                      <option value="Municipal LAN">Municipal Dedicated LAN</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Linked VMS Platform:</label>
                    <input
                      type="text"
                      value={formData.vmsPlatformName}
                      onChange={(e) => setFormData({ ...formData, vmsPlatformName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Restricted Endpoint Reference ID:</label>
                    <input
                      type="text"
                      value={formData.endpointReference}
                      onChange={(e) => setFormData({ ...formData, endpointReference: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-700"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Internal pointer for VMS association; not accessible for raw stream playback.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Storage */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 6: Storage Architecture & Retention</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Storage Location:</label>
                    <select
                      value={formData.storageType}
                      onChange={(e) => setFormData({ ...formData, storageType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    >
                      <option value="Department SAN">Department SAN (State Data Centre)</option>
                      <option value="District Command NAS">District Command NAS</option>
                      <option value="Local NVR">Local Police Station NVR</option>
                      <option value="Edge SD">Edge SD Storage</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mandatory Retention (Days):</label>
                    <input
                      type="number"
                      value={formData.retentionDays}
                      onChange={(e) => setFormData({ ...formData, retentionDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Capabilities */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 7: Capability Flags (Metadata Only)</h3>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center space-x-2 p-3 bg-slate-50 border rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.anpr}
                      onChange={(e) => setFormData({ ...formData, anpr: e.target.checked })}
                      className="rounded text-[#0052CC]"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">ANPR Capability</span>
                      <span className="text-slate-500">Node has hardware suitable for number plate capture</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 bg-slate-50 border rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vehicleDetection}
                      onChange={(e) => setFormData({ ...formData, vehicleDetection: e.target.checked })}
                      className="rounded text-[#0052CC]"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Vehicle Detection</span>
                      <span className="text-slate-500">Asset supports vehicular movement logging</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 bg-slate-50 border rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.edgeAI}
                      onChange={(e) => setFormData({ ...formData, edgeAI: e.target.checked })}
                      className="rounded text-[#0052CC]"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Edge AI On-Chip</span>
                      <span className="text-slate-500">Camera hardware possesses local AI inference chip</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 8: Review & Submit */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 8: Final Schema Review & Submission</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Asset Code:</span>
                    <span className="font-mono font-bold text-[#0052CC]">{formData.cameraCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-slate-800">{formData.name || 'Surveillance Node'} ({formData.district})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="font-mono">{formData.latitude}°N, {formData.longitude}°E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hardware:</span>
                    <span>{formData.manufacturer} {formData.model} ({formData.resolution})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">VMS Platform:</span>
                    <span>{formData.vmsPlatformName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Retention:</span>
                    <span>{formData.retentionDays} Days ({formData.storageType})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>

              <button
                onClick={handleStepSubmit}
                className="flex items-center space-x-1.5 px-5 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-lg hover:bg-[#0041A8] transition shadow-xs"
              >
                <span>{currentStep === 8 ? 'Confirm & Register Camera' : 'Proceed to Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* METHOD 2: BULK INGESTION */}
      {activeMethod === 'bulk' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bulk CSV/XLSX Ingestion Pipeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Upload validated batch camera registry documents for mass onboarding.</p>
          </div>

          <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-[#0052CC] mx-auto" />
            <div>
              <p className="text-xs font-bold text-slate-800">Drag and drop verified .CSV or .XLSX registry file here</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Adheres to Gujarat Police Standard CCTV Metadata Schema v2.1</p>
            </div>
            <button
              onClick={() => setBulkStatus('completed')}
              className="px-4 py-2 bg-[#0052CC] text-white text-xs font-semibold rounded-lg hover:bg-[#0041A8] transition shadow-xs"
            >
              Simulate Ingestion of 1,183 Validated Records
            </button>
          </div>

          {bulkStatus === 'completed' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-emerald-900 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                Batch Ingestion Successful
              </span>
              <p className="text-slate-600">1,183 camera assets provisioned. Master Registry and PostGIS vector layers updated.</p>
            </div>
          )}
        </div>
      )}

      {/* METHOD 3: DEPARTMENT API */}
      {activeMethod === 'api' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Registry API Integration</h3>
            <p className="text-xs text-slate-500 mt-0.5">Connect departmental VMS platforms via authenticated registry sync tokens.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Sync Endpoint Gateway URL:</label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Statewide Authentication Token:</label>
              <input
                type="text"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Automated Sync Schedule</span>
              <span className="text-slate-500">Every 15 minutes via PostGIS transactional sync</span>
            </div>
            <button
              onClick={() => setApiSyncStatus('connected')}
              className="px-4 py-2 bg-[#0052CC] text-white font-semibold rounded-lg hover:bg-[#0041A8] transition"
            >
              Test Gateway Handshake
            </button>
          </div>

          {apiSyncStatus === 'connected' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-emerald-900 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                API Handshake Nominal
              </span>
              <p className="text-slate-600">Connected to Ahmedabad Smart City Central Hub. 5,210 reference nodes synchronized.</p>
            </div>
          )}
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && createdCamera && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Camera Successfully Registered</h3>
              <p className="text-xs text-slate-500 mt-1">Asset committed to Master Registry & PostGIS foundation.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-left space-y-1.5 font-mono">
              <div><span className="text-slate-400">UUID:</span> {createdCamera.cameraUuid}</div>
              <div><span className="text-slate-400">Code:</span> <span className="font-bold text-[#0052CC]">{createdCamera.cameraCode}</span></div>
              <div><span className="text-slate-400">Status:</span> <span className="text-emerald-700 font-bold">Active (Online)</span></div>
            </div>
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                setCurrentStep(1);
              }}
              className="w-full py-2 bg-[#0052CC] text-white text-xs font-bold rounded-lg hover:bg-[#0041A8] transition"
            >
              Done & Return to Registry
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
