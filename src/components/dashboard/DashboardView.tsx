import React from 'react';
import { 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  HeartPulse, 
  ArrowUpRight, 
  TrendingUp, 
  Activity, 
  Flame, 
  ChevronRight,
  ShieldAlert,
  Zap,
  Gauge
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { MetricCard } from '../common/MetricCard';
import { HealthGauge } from '../charts/HealthGauge';
import { TelemetryChart } from '../charts/TelemetryChart';

export const DashboardView: React.FC = () => {
  const { 
    machines, 
    alerts, 
    setActiveTab, 
    setSelectedMachineId, 
    selectedMachine,
    injectAnomaly 
  } = useTelemetry();

  const totalMachines = machines.length;
  const healthyCount = machines.filter(m => m.status === 'healthy').length;
  const atRiskCount = machines.filter(m => m.status === 'warning').length;
  const maintenanceCount = machines.filter(m => m.status === 'critical' || m.status === 'maintenance').length;

  const fleetHealthScore = Math.round(
    machines.reduce((acc, m) => acc + m.healthScore, 0) / (totalMachines || 1)
  );

  const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'investigating').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Industrial Plant Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <img 
            src="/src/assets/images/smart_factory_telemetry_1793682098130.jpg" 
            alt="Smart Factory" 
            className="w-full h-full object-cover mix-blend-luminosity" 
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono tracking-wider uppercase text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50">
                Stuttgart Plant #4 · Live Supervisory Control
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Industrial Fleet Reliability & Health Overview
            </h2>
            <p className="text-slate-300 text-xs lg:text-sm mt-1 leading-relaxed">
              Real-time ISO 10816 vibration classification and XGBoost anomaly detection actively monitoring rotating equipment to eliminate unplanned downtime.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('sensors')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Activity className="w-4 h-4" />
              <span>Inspect Live Sensors</span>
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>ML Diagnostics</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Monitored Fleet"
          value={totalMachines}
          unit="units"
          subtitle="4 Plant Zones"
          statusColor="blue"
          icon={<Server className="w-5 h-5 text-blue-600" />}
        />
        <MetricCard
          title="Healthy Machines"
          value={healthyCount}
          unit="nominal"
          subtitle="ISO Zone A / B"
          isPositive={true}
          change={`${Math.round((healthyCount / totalMachines) * 100)}%`}
          statusColor="emerald"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <MetricCard
          title="Machines At Risk"
          value={atRiskCount}
          unit="warning"
          subtitle="ISO Zone C"
          isPositive={false}
          change={atRiskCount > 0 ? "Requires Review" : "Zero"}
          statusColor="amber"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
        <MetricCard
          title="Critical Maintenance"
          value={maintenanceCount}
          unit="action"
          subtitle="Urgent Intervention"
          isPositive={false}
          change={maintenanceCount > 0 ? "Dispatch Tech" : "All Clear"}
          statusColor="red"
          icon={<Wrench className="w-5 h-5 text-red-600" />}
        />
        <MetricCard
          title="Fleet Health Score"
          value={fleetHealthScore}
          unit="%"
          subtitle="Target: ≥ 85%"
          isPositive={fleetHealthScore >= 80}
          change={fleetHealthScore >= 80 ? "Nominal" : "Degraded"}
          statusColor={fleetHealthScore >= 80 ? "emerald" : "amber"}
          icon={<HeartPulse className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Middle Section: Fleet Health Analysis & Selected Machine Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Fleet Health & ISO Zone Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Overall Fleet Health Index</h3>
              <p className="text-xs text-slate-500">Aggregated multi-sensor weighted metric</p>
            </div>
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              ISO 10816 Standard
            </span>
          </div>

          <div className="py-2 flex justify-center">
            <HealthGauge score={fleetHealthScore} size={160} label="Fleet Composite Health" />
          </div>

          {/* Machine Health distribution bars */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Nominal Condition (&gt;80%)</span>
              </span>
              <span className="font-mono font-bold text-slate-800">{healthyCount} Assets</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(healthyCount / totalMachines) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-slate-600 mt-2">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Early Degradation Warning (50-80%)</span>
              </span>
              <span className="font-mono font-bold text-slate-800">{atRiskCount} Assets</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(atRiskCount / totalMachines) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-slate-600 mt-2">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Critical / Impending Failure (&lt;50%)</span>
              </span>
              <span className="font-mono font-bold text-slate-800">{maintenanceCount} Assets</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-red-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(maintenanceCount / totalMachines) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => setActiveTab('machines')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View All {totalMachines} Machine Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Live Highlight Machine Telemetry Waveform */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Active Telemetry Stream</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                  {selectedMachine.id}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  selectedMachine.status === 'critical' ? 'bg-red-100 text-red-700' :
                  selectedMachine.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {selectedMachine.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{selectedMachine.name} · {selectedMachine.zone}</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedMachine.id}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {machines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.id} ({m.healthScore}%)
                  </option>
                ))}
              </select>
              <button
                onClick={() => setActiveTab('sensors')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>Full Telemetry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar for Selected Machine */}
          <div className="grid grid-cols-4 gap-2 text-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</div>
              <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {selectedMachine.temperature}°C
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Vibration</div>
              <div className={`text-base font-bold font-mono tabular-nums ${
                selectedMachine.vibration > 7.1 ? 'text-red-600' : selectedMachine.vibration > 2.8 ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {selectedMachine.vibration} <span className="text-xs font-normal text-slate-500">mm/s</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Current</div>
              <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {selectedMachine.current} <span className="text-xs font-normal text-slate-500">A</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Est. RUL</div>
              <div className="text-base font-bold font-mono text-blue-600 tabular-nums">
                {selectedMachine.rulDays} <span className="text-xs font-normal text-slate-500">days</span>
              </div>
            </div>
          </div>

          {/* Live Multi-Metric Chart */}
          <div className="pt-1">
            <TelemetryChart
              data={selectedMachine.history}
              metricKey="vibration"
              label="Live Vibration Trend (ISO 10816 RMS Velocity)"
              unit="mm/s"
              warningThreshold={2.8}
              criticalThreshold={7.1}
              lineColor="#2563eb"
              height={190}
            />
          </div>

          {/* Quick Anomaly Testing Sandbox Bar */}
          <div className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-blue-50/60 border border-blue-100 gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-slate-900">Simulate Anomaly on {selectedMachine.id}:</span>
                <span className="text-slate-500 text-[11px] ml-1 hidden sm:inline">Observe model classification in real-time</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => injectAnomaly(selectedMachine.id, 'bearing')}
                className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded text-xs font-semibold transition-colors shadow-2xs"
              >
                + Bearing Fault
              </button>
              <button
                onClick={() => injectAnomaly(selectedMachine.id, 'thermal')}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-semibold transition-colors shadow-2xs"
              >
                + Overheat
              </button>
              <button
                onClick={() => injectAnomaly(selectedMachine.id, 'reset')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs font-medium transition-colors"
                title="Reset to normal"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Fleet Machines Grid Preview & Recent Maintenance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Machine Quick Status Cards (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Equipment Status Roster</h3>
              <p className="text-xs text-slate-500">Click any machine to inspect telemetry & ML prediction</p>
            </div>
            <button
              onClick={() => setActiveTab('machines')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Manage Fleet →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {machines.map((machine) => {
              const isSelected = machine.id === selectedMachine.id;
              return (
                <div
                  key={machine.id}
                  onClick={() => setSelectedMachineId(machine.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/30 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-900">{machine.id}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full uppercase ${
                          machine.status === 'critical' ? 'bg-red-100 text-red-700' :
                          machine.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                          machine.status === 'maintenance' ? 'bg-slate-200 text-slate-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {machine.status}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 mt-1 truncate">
                        {machine.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-base font-extrabold font-mono tabular-nums ${
                        machine.healthScore < 50 ? 'text-red-600' :
                        machine.healthScore < 80 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {machine.healthScore}%
                      </div>
                      <span className="text-[10px] text-slate-400 block">Health</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Temp</span>
                      <span className="tabular-nums font-semibold">{machine.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Vib</span>
                      <span className="tabular-nums font-semibold">{machine.vibration} mm/s</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">RUL</span>
                      <span className="tabular-nums font-semibold text-blue-600">{machine.rulDays}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Maintenance Alerts List (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Active Failure Alerts</h3>
              <p className="text-xs text-slate-500">Real-time sensor threshold events</p>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Alert Queue ({alerts.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div 
                key={alert.id}
                onClick={() => {
                  setSelectedMachineId(alert.machineId);
                  setActiveTab('alerts');
                }}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900">{alert.machineId}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono text-[11px]">{alert.id}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    alert.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.riskLevel}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 leading-snug">
                  {alert.detectedIssue}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Action: {alert.recommendedAction}
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center justify-between">
                  <span>Trigger: {alert.metricTriggered} ({alert.value})</span>
                  <span>{alert.timestamp.split(' ')[1] || alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('alerts')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Manage & Resolve Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
