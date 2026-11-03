import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Machine, AlertItem, MaintenanceLog, UserProfile } from '../types';
import { INITIAL_MACHINES, INITIAL_ALERTS, INITIAL_MAINTENANCE_LOGS } from '../data/initialMachines';
import { runMLInference, SENSOR_THRESHOLDS } from '../utils/mlEngine';

export type NavigationTab = 
  | 'landing'
  | 'dashboard'
  | 'sensors'
  | 'predictions'
  | 'machines'
  | 'alerts'
  | 'analytics'
  | 'pipeline'
  | 'reports';

interface TelemetryContextType {
  machines: Machine[];
  selectedMachineId: string;
  selectedMachine: Machine;
  setSelectedMachineId: (id: string) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: (live: boolean) => void;
  streamSpeed: number; // 1, 2, 5
  setStreamSpeed: (speed: number) => void;
  isSimulatedData: boolean;
  setIsSimulatedData: (val: boolean) => void;
  alerts: AlertItem[];
  activeAlertsCount: number;
  criticalAlertsCount: number;
  maintenanceLogs: MaintenanceLog[];
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isGitHubModalOpen: boolean;
  setIsGitHubModalOpen: (open: boolean) => void;
  injectAnomaly: (machineId: string, anomalyType: 'bearing' | 'thermal' | 'overload' | 'reset') => void;
  resolveAlert: (alertId: string, resolutionNotes: string) => void;
  addMachine: (newMachine: Omit<Machine, 'history' | 'healthScore' | 'rulDays' | 'failureRisk' | 'predictedFailureMode' | 'anomalyDetected' | 'anomalyScore'>) => void;
  triggerSound: boolean;
  setTriggerSound: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [selectedMachineId, setSelectedMachineId] = useState<string>('CNC-402');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1);
  const [isSimulatedData, setIsSimulatedData] = useState<boolean>(true); // Clearly labeled demo simulated stream
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(INITIAL_MAINTENANCE_LOGS);
  const [triggerSound, setTriggerSound] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [user, setUser] = useState<UserProfile>({
    name: 'Dr. Michael Chen',
    email: 'm.chen@industria-predictx.com',
    role: 'Lead Reliability Engineer',
    avatarUrl: '/assets/avatar-placeholder.svg',
    plantId: 'Plant #4 - Stuttgart Automation Hub',
  });

  const selectedMachine = useMemo(() => {
    return machines.find(m => m.id === selectedMachineId) || machines[0];
  }, [machines, selectedMachineId]);

  const activeAlertsCount = useMemo(() => {
    return alerts.filter(a => a.status === 'active' || a.status === 'investigating').length;
  }, [alerts]);

  const criticalAlertsCount = useMemo(() => {
    return alerts.filter(a => (a.status === 'active' || a.status === 'investigating') && a.riskLevel === 'Critical').length;
  }, [alerts]);

  // Live telemetry stream simulator
  useEffect(() => {
    if (!isLiveStreaming) return;

    const intervalTime = Math.max(600, 2400 / streamSpeed);

    const interval = setInterval(() => {
      setMachines(prevMachines => {
        return prevMachines.map(machine => {
          // If machine is in maintenance, keep readings low and steady
          if (machine.status === 'maintenance') {
            return machine;
          }

          // Natural fluctuation dynamics
          let tempDelta = (Math.random() - 0.49) * 0.4;
          let vibDelta = (Math.random() - 0.49) * 0.08;
          let currDelta = (Math.random() - 0.49) * 0.5;

          // If machine is critical/warning, induce realistic slight upward or oscillation drift
          if (machine.status === 'critical') {
            tempDelta += 0.08;
            vibDelta += 0.03;
          } else if (machine.status === 'warning') {
            tempDelta += (Math.random() - 0.48) * 0.3;
            vibDelta += (Math.random() - 0.48) * 0.1;
          }

          const newTemp = Math.max(30, Math.min(105, Math.round((machine.temperature + tempDelta) * 10) / 10));
          const newVib = Math.max(0.3, Math.min(16, Math.round((machine.vibration + vibDelta) * 100) / 100));
          const newCurr = Math.max(5, Math.min(75, Math.round((machine.current + currDelta) * 10) / 10));

          // Run ML inference on new telemetry
          const ml = runMLInference(newTemp, newVib, newCurr);

          // Determine current status
          let newStatus = machine.status;
          if (ml.failureRisk === 'High' || newTemp >= SENSOR_THRESHOLDS.temperature.critical || newVib >= SENSOR_THRESHOLDS.vibration.zoneC) {
            newStatus = 'critical';
          } else if (ml.failureRisk === 'Medium' || newTemp >= SENSOR_THRESHOLDS.temperature.warning || newVib >= SENSOR_THRESHOLDS.vibration.zoneB) {
            newStatus = 'warning';
          } else {
            newStatus = 'healthy';
          }

          const now = new Date();
          const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          const newPoint = {
            timestamp,
            temperature: newTemp,
            vibration: newVib,
            current: newCurr,
            rpm: Math.round(machine.rpm + (Math.random() - 0.5) * 20),
            anomalyScore: ml.anomalyScore,
            healthScore: ml.healthScore,
          };

          // Maintain rolling history of 30 points
          const updatedHistory = [...machine.history.slice(-29), newPoint];

          // Check if new alert should be automatically spawned
          if (newStatus === 'critical' && machine.status !== 'critical') {
            setAlerts(prevAlerts => [
              {
                id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
                machineId: machine.id,
                machineName: machine.name,
                detectedIssue: `${ml.predictedFailureMode} (Risk: High)`,
                riskLevel: 'Critical',
                timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
                recommendedAction: ml.recommendedAction,
                status: 'active',
                metricTriggered: newVib >= 7.1 ? 'Vibration' : newTemp >= 85 ? 'Temperature' : 'Multi-Sensor Anomaly',
                value: newVib >= 7.1 ? newVib : newTemp,
                threshold: newVib >= 7.1 ? 7.1 : 85.0,
              },
              ...prevAlerts,
            ]);
          }

          return {
            ...machine,
            temperature: newTemp,
            vibration: newVib,
            current: newCurr,
            healthScore: ml.healthScore,
            rulDays: ml.rulDays,
            failureRisk: ml.failureRisk,
            predictedFailureMode: ml.predictedFailureMode,
            anomalyDetected: ml.anomalyDetected,
            anomalyScore: ml.anomalyScore,
            status: newStatus,
            history: updatedHistory,
          };
        });
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isLiveStreaming, streamSpeed]);

  // Inject anomaly into specific machine
  const injectAnomaly = useCallback((machineId: string, anomalyType: 'bearing' | 'thermal' | 'overload' | 'reset') => {
    setMachines(prev => prev.map(m => {
      if (m.id !== machineId) return m;

      let targetTemp = m.temperature;
      let targetVib = m.vibration;
      let targetCurr = m.current;
      let targetStatus = m.status;

      if (anomalyType === 'bearing') {
        targetVib = 8.85; // Massive ISO Zone D spike
        targetTemp = Math.max(targetTemp, 78.5);
      } else if (anomalyType === 'thermal') {
        targetTemp = 91.2; // Critical overheating
        targetCurr = Math.max(targetCurr, 46.5);
      } else if (anomalyType === 'overload') {
        targetCurr = 54.0; // Overcurrent jamming
        targetVib = Math.max(targetVib, 5.2);
        targetTemp = Math.max(targetTemp, 76.0);
      } else if (anomalyType === 'reset') {
        targetTemp = 50.5;
        targetVib = 1.35;
        targetCurr = 18.2;
        targetStatus = 'healthy';
      }

      const ml = runMLInference(targetTemp, targetVib, targetCurr);
      targetStatus = anomalyType === 'reset' ? 'healthy' : (ml.failureRisk === 'High' ? 'critical' : 'warning');

      // Generate alert if anomaly injected
      if (anomalyType !== 'reset') {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        setAlerts(prevA => [
          {
            id: `ALT-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
            machineId: m.id,
            machineName: m.name,
            detectedIssue: `[SIMULATED INJECTION] ${ml.predictedFailureMode}`,
            riskLevel: targetStatus === 'critical' ? 'Critical' : 'Warning',
            timestamp: now,
            recommendedAction: ml.recommendedAction,
            status: 'active',
            metricTriggered: anomalyType === 'bearing' ? 'Vibration' : anomalyType === 'thermal' ? 'Temperature' : 'Current',
            value: anomalyType === 'bearing' ? targetVib : anomalyType === 'thermal' ? targetTemp : targetCurr,
            threshold: anomalyType === 'bearing' ? 7.1 : anomalyType === 'thermal' ? 85.0 : 48.0,
          },
          ...prevA,
        ]);
      }

      return {
        ...m,
        temperature: targetTemp,
        vibration: targetVib,
        current: targetCurr,
        status: targetStatus,
        healthScore: ml.healthScore,
        rulDays: ml.rulDays,
        failureRisk: ml.failureRisk,
        predictedFailureMode: ml.predictedFailureMode,
        anomalyDetected: ml.anomalyDetected,
        anomalyScore: ml.anomalyScore,
      };
    }));
  }, []);

  // Mark alert as resolved
  const resolveAlert = useCallback((alertId: string, resolutionNotes: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'resolved',
          resolvedAt: now,
          resolvedBy: `${user.name} (${user.role})`,
          resolutionNotes: resolutionNotes || 'Issue verified and marked resolved by engineer.',
        };
      }
      return a;
    }));
  }, [user]);

  // Add new machine
  const addMachine = useCallback((newMachineData: Omit<Machine, 'history' | 'healthScore' | 'rulDays' | 'failureRisk' | 'predictedFailureMode' | 'anomalyDetected' | 'anomalyScore'>) => {
    const ml = runMLInference(newMachineData.temperature, newMachineData.vibration, newMachineData.current);
    const newMachine: Machine = {
      ...newMachineData,
      healthScore: ml.healthScore,
      rulDays: ml.rulDays,
      failureRisk: ml.failureRisk,
      predictedFailureMode: ml.predictedFailureMode,
      anomalyDetected: ml.anomalyDetected,
      anomalyScore: ml.anomalyScore,
      history: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          temperature: newMachineData.temperature,
          vibration: newMachineData.vibration,
          current: newMachineData.current,
          rpm: newMachineData.rpm,
          anomalyScore: ml.anomalyScore,
          healthScore: ml.healthScore,
        }
      ],
    };

    setMachines(prev => [newMachine, ...prev]);
    setSelectedMachineId(newMachine.id);
  }, []);

  return (
    <TelemetryContext.Provider
      value={{
        machines,
        selectedMachineId,
        selectedMachine,
        setSelectedMachineId,
        activeTab,
        setActiveTab,
        isLiveStreaming,
        setIsLiveStreaming,
        streamSpeed,
        setStreamSpeed,
        isSimulatedData,
        setIsSimulatedData,
        alerts,
        activeAlertsCount,
        criticalAlertsCount,
        maintenanceLogs,
        user,
        setUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isGitHubModalOpen,
        setIsGitHubModalOpen,
        injectAnomaly,
        resolveAlert,
        addMachine,
        triggerSound,
        setTriggerSound,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export function useTelemetry(): TelemetryContextType {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}
