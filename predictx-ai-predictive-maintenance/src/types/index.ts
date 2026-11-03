export type MachineStatus = 'healthy' | 'warning' | 'critical' | 'maintenance';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type AlertSeverity = 'Healthy' | 'Warning' | 'Critical';
export type PlantZone = 'Zone A - Precision Machining' | 'Zone B - Power & Utilities' | 'Zone C - Fluid Transfer' | 'Zone D - Heavy Stamping';

export interface SensorReading {
  timestamp: string; // ISO string or HH:mm:ss
  temperature: number; // °C
  vibration: number; // mm/s RMS
  current: number; // Amps
  rpm: number;
  anomalyScore: number; // 0 - 100
  healthScore: number; // 0 - 100
}

export interface Machine {
  id: string; // e.g., 'CNC-402'
  name: string; // e.g., '5-Axis CNC Milling Center'
  type: string; // e.g., 'Milling Machine', 'Centrifugal Pump', 'Gas Turbine'
  zone: PlantZone;
  status: MachineStatus;
  healthScore: number; // 0 - 100
  temperature: number; // current °C
  vibration: number; // current mm/s
  current: number; // current Amps
  rpm: number; // operating speed
  operatingHours: number;
  rulDays: number; // Remaining Useful Life
  failureRisk: RiskLevel;
  predictedFailureMode: string;
  anomalyDetected: boolean;
  anomalyScore: number;
  lastMaintenance: string;
  installationDate: string;
  specifications: {
    ratedPower: string;
    maxTemp: number;
    maxVibration: number;
    nominalCurrent: number;
    manufacturer: string;
    modelNumber: string;
  };
  history: SensorReading[];
}

export interface AlertItem {
  id: string;
  machineId: string;
  machineName: string;
  detectedIssue: string;
  riskLevel: AlertSeverity;
  timestamp: string;
  recommendedAction: string;
  status: 'active' | 'investigating' | 'resolved';
  metricTriggered: 'Temperature' | 'Vibration' | 'Current' | 'Multi-Sensor Anomaly';
  value: number;
  threshold: number;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface MaintenanceLog {
  id: string;
  machineId: string;
  machineName: string;
  type: 'Predictive Overhaul' | 'Preventive Service' | 'Corrective Repair' | 'Sensor Calibration';
  date: string;
  technician: string;
  durationHours: number;
  partsReplaced: string[];
  cost: number;
  outcome: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'Lead Reliability Engineer' | 'Plant Operations Director' | 'Maintenance Specialist';
  avatarUrl: string;
  plantId: string;
}

export interface MLPredictionResult {
  healthScore: number;
  failureRisk: RiskLevel;
  rulDays: number;
  anomalyScore: number;
  anomalyDetected: boolean;
  failureProbability: number;
  predictedFailureMode: string;
  rootCauseAnalysis: string;
  recommendedAction: string;
  isoZone: 'Zone A (Good)' | 'Zone B (Acceptable)' | 'Zone C (Warning)' | 'Zone D (Critical)';
  sensorContributions: {
    temperature: number;
    vibration: number;
    current: number;
  };
}
