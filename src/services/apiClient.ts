// Frontend API Client connecting to Z-TRACS FastAPI Backend
import { CameraMasterRecord, CanonicalVms, CanonicalConnector, CanonicalEvent, AnprEvent, SystemAlert, InvestigationCase } from '../types';

const API_BASE = 'http://localhost:5000/api/v1';

export class ApiClient {
  static async getHealth(): Promise<{ status: string }> {
    try {
      const res = await fetch('http://localhost:5000/health/live');
      const json = await res.json();
      return json.data || { status: 'ONLINE' };
    } catch {
      return { status: 'OFFLINE_FALLBACK' };
    }
  }

  static async getCameras(): Promise<CameraMasterRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/cameras`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  }

  static async getVmsList(): Promise<CanonicalVms[]> {
    try {
      const res = await fetch(`${API_BASE}/vms`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  }

  static async getConnectors(): Promise<CanonicalConnector[]> {
    try {
      const res = await fetch(`${API_BASE}/federation/connectors`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  }

  static async getCanonicalEvents(): Promise<CanonicalEvent[]> {
    try {
      const res = await fetch(`${API_BASE}/events/pipeline`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  }
}
