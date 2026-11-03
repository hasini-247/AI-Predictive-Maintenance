import React, { useState } from 'react';
import { 
  Radio, 
  Thermometer, 
  Activity, 
  Zap, 
  RotateCw, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Info,
  ShieldCheck,
  Cpu,
  Clock,
  Sparkles
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { TelemetryChart } from '../charts/TelemetryChart';
import { VibrationSpectrumChart } from '../charts/VibrationSpectrumChart';
import { SENSOR_THRESHOLDS, getIso10816Zone } from '../../utils/mlEngine';

export const SensorMonitoringView: React.FC = () => {
  const { 
    machines, 
    selectedMachineId, 
    setSelectedMachineId, 
    selectedMachine,
    isLiveStreaming,
    setIsLiveStreaming,
    streamSpeed,
    isSimulatedData,
    injectAnomaly,
    setActiveTab
  } = useTelemetry();

  const [activeSensorTab, setActiveSensorTab] = useState<'all' | 'temperature' | 'vibration' | 'current' | 'fft'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1m' | '5m' | '15m'>('5m');

  const isoZone = getIso10816Zone(selectedMachine.vibration);

  return (
    <div className="space-y-6">
      {/* Sensor Monitoring Header & Machine Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  IoT Sensor Telemetry Workbench
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
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
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedMachine.name} · {selectedMachine.zone} · Rated: {selectedMachine.specifications.ratedPower}
              </p>
            </div>
          </div>

          {/* Machine Selector Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-semibold text-slate-600">Select Asset:</div>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-900 shadow-2xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {machines.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id} – {m.name} ({m.healthScore}% health)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Simulation Notice Banner (Clear Distinction) */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="text-slate-700">
              <span className="font-semibold text-slate-900">
                {isSimulatedData ? 'Live Simulation Stream Active:' : 'Hardware Telemetry Mode:'}
              </span>{' '}
              {isSimulatedData 
                ? 'Emulated telemetry generated via realistic stochastic physical models (bearing micro-harmonics, thermal dissipation & motor current slip).'
                : 'Reading raw telemetry payload directly from MQTT message broker topic (iot/sensors/plant4/telemetry).'}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isLiveStreaming 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              <span>{isLiveStreaming ? 'Streaming Live (1 tick / 2s)' : 'Stream Paused'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Sensor Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Bearing Temperature
              </span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                  {selectedMachine.temperature}
                </span>
                <span className="text-xs font-semibold text-slate-500">°C</span>
              </div>
            </div>
            <div className={`p-2 rounded-lg ${
              selectedMachine.temperature >= 85 ? 'bg-red-100 text-red-600' :
              selectedMachine.temperature >= 72 ? 'bg-amber-100 text-amber-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center text-slate-500">
            <span>Nominal: 40–68°C</span>
            <span className={`font-mono font-semibold ${
              selectedMachine.temperature >= 85 ? 'text-red-600' :
              selectedMachine.temperature >= 72 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {selectedMachine.temperature >= 85 ? 'OVERHEATING' : selectedMachine.temperature >= 72 ? 'WARNING' : 'NORMAL'}
            </span>
          </div>
        </div>

        {/* Vibration Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Vibration Velocity (RMS)
              </span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight tabular-nums ${
                  selectedMachine.vibration > 7.1 ? 'text-red-600' :
                  selectedMachine.vibration > 2.8 ? 'text-amber-600' :
                  'text-slate-900'
                }`}>
                  {selectedMachine.vibration}
                </span>
                <span className="text-xs font-semibold text-slate-500">mm/s</span>
              </div>
            </div>
            <div className={`p-2 rounded-lg ${
              selectedMachine.vibration > 7.1 ? 'bg-red-100 text-red-600' :
              selectedMachine.vibration > 2.8 ? 'bg-amber-100 text-amber-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center text-slate-500">
            <span>ISO Standard 10816-3</span>
            <span className="font-mono font-semibold text-blue-600">
              {isoZone}
            </span>
          </div>
        </div>

        {/* Current Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Motor Current Load
              </span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                  {selectedMachine.current}
                </span>
                <span className="text-xs font-semibold text-slate-500">Amps</span>
              </div>
            </div>
            <div className={`p-2 rounded-lg ${
              selectedMachine.current >= 48 ? 'bg-red-100 text-red-600' :
              selectedMachine.current >= 38 ? 'bg-amber-100 text-amber-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center text-slate-500">
            <span>Nominal: {selectedMachine.specifications.nominalCurrent} A</span>
            <span className={`font-mono font-semibold ${
              selectedMachine.current >= 48 ? 'text-red-600' :
              selectedMachine.current >= 38 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {selectedMachine.current >= 48 ? 'OVERCURRENT' : 'STABLE'}
            </span>
          </div>
        </div>

        {/* Operating Speed Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Operating Shaft Speed
              </span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                  {selectedMachine.rpm}
                </span>
                <span className="text-xs font-semibold text-slate-500">RPM</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <RotateCw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center text-slate-500">
            <span>Fundamental: {(selectedMachine.rpm / 60).toFixed(1)} Hz</span>
            <span className="font-mono font-semibold text-slate-700">1X Rotational</span>
          </div>
        </div>
      </div>

      {/* Sensor Interactive Charts Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Real-Time Telemetry Waveforms</h3>
            <p className="text-xs text-slate-500">Streaming time-series data with safety envelope thresholds</p>
          </div>

          {/* View filter buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveSensorTab('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeSensorTab === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Channels
            </button>
            <button
              onClick={() => setActiveSensorTab('vibration')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeSensorTab === 'vibration' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vibration
            </button>
            <button
              onClick={() => setActiveSensorTab('temperature')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeSensorTab === 'temperature' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Temperature
            </button>
            <button
              onClick={() => setActiveSensorTab('current')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeSensorTab === 'current' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setActiveSensorTab('fft')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeSensorTab === 'fft' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FFT Spectrum
            </button>
          </div>
        </div>

        {/* Charts display */}
        {activeSensorTab === 'all' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <TelemetryChart
                data={selectedMachine.history}
                metricKey="vibration"
                label="Tri-axial Vibration Velocity (ISO 10816 Standard)"
                unit="mm/s"
                warningThreshold={SENSOR_THRESHOLDS.vibration.zoneB}
                criticalThreshold={SENSOR_THRESHOLDS.vibration.zoneC}
                lineColor="#2563eb"
                height={160}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                <TelemetryChart
                  data={selectedMachine.history}
                  metricKey="temperature"
                  label="Bearing Housing Surface Temperature"
                  unit="°C"
                  warningThreshold={SENSOR_THRESHOLDS.temperature.warning}
                  criticalThreshold={SENSOR_THRESHOLDS.temperature.critical}
                  lineColor="#ea580c"
                  height={150}
                />
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                <TelemetryChart
                  data={selectedMachine.history}
                  metricKey="current"
                  label="Motor Phase Current"
                  unit="A"
                  warningThreshold={SENSOR_THRESHOLDS.current.warning}
                  criticalThreshold={SENSOR_THRESHOLDS.current.critical}
                  lineColor="#7c3aed"
                  height={150}
                />
              </div>
            </div>
          </div>
        )}

        {activeSensorTab === 'vibration' && (
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
            <TelemetryChart
              data={selectedMachine.history}
              metricKey="vibration"
              label="Tri-axial Vibration Velocity (mm/s RMS)"
              unit="mm/s"
              warningThreshold={2.8}
              criticalThreshold={7.1}
              lineColor="#2563eb"
              height={260}
            />
          </div>
        )}

        {activeSensorTab === 'temperature' && (
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
            <TelemetryChart
              data={selectedMachine.history}
              metricKey="temperature"
              label="Bearing Housing Temperature (°C)"
              unit="°C"
              warningThreshold={72}
              criticalThreshold={85}
              lineColor="#ea580c"
              height={260}
            />
          </div>
        )}

        {activeSensorTab === 'current' && (
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
            <TelemetryChart
              data={selectedMachine.history}
              metricKey="current"
              label="Motor Phase Operating Current (A)"
              unit="A"
              warningThreshold={38}
              criticalThreshold={48}
              lineColor="#7c3aed"
              height={260}
            />
          </div>
        )}

        {activeSensorTab === 'fft' && (
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <VibrationSpectrumChart
              rpm={selectedMachine.rpm}
              vibrationRms={selectedMachine.vibration}
              isAnomaly={selectedMachine.anomalyDetected}
              predictedMode={selectedMachine.predictedFailureMode}
            />
          </div>
        )}
      </div>

      {/* ISO 10816 Vibration Severity Standards & Physical Hardware Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ISO 10816 Reference Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">ISO 10816-3 Vibration Severity Classification</h3>
              <p className="text-xs text-slate-500">Evaluation standard for industrial rotating machines (15kW to 300kW)</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Class II / III Machinery
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Velocity Range (RMS)</th>
                  <th className="py-2.5 px-3">Operating Condition</th>
                  <th className="py-2.5 px-3">Machine Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                <tr className={selectedMachine.vibration <= 1.8 ? 'bg-emerald-50 font-bold' : ''}>
                  <td className="py-2 px-3 text-emerald-700">Zone A</td>
                  <td className="py-2 px-3">&lt; 1.8 mm/s</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Newly commissioned / Excellent condition</td>
                  <td className="py-2 px-3"><span className="text-emerald-700 font-semibold">Healthy</span></td>
                </tr>
                <tr className={selectedMachine.vibration > 1.8 && selectedMachine.vibration <= 2.8 ? 'bg-emerald-50 font-bold' : ''}>
                  <td className="py-2 px-3 text-blue-700">Zone B</td>
                  <td className="py-2 px-3">1.8 – 2.8 mm/s</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Acceptable for unrestricted continuous operation</td>
                  <td className="py-2 px-3"><span className="text-blue-700 font-semibold">Nominal</span></td>
                </tr>
                <tr className={selectedMachine.vibration > 2.8 && selectedMachine.vibration <= 7.1 ? 'bg-amber-50 font-bold' : ''}>
                  <td className="py-2 px-3 text-amber-700">Zone C</td>
                  <td className="py-2 px-3">2.8 – 7.1 mm/s</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Unsatisfactory for continuous run; degradation active</td>
                  <td className="py-2 px-3"><span className="text-amber-700 font-semibold">Warning</span></td>
                </tr>
                <tr className={selectedMachine.vibration > 7.1 ? 'bg-red-50 font-bold' : ''}>
                  <td className="py-2 px-3 text-red-700">Zone D</td>
                  <td className="py-2 px-3">&gt; 7.1 mm/s</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Severe danger; damage imminent; immediate intervention</td>
                  <td className="py-2 px-3"><span className="text-red-700 font-semibold">Critical</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Real Hardware Sensor Telemetry Spec */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Edge Sensor Hardware Node</h3>
          </div>

          <div className="rounded-lg overflow-hidden border border-slate-200">
            <img 
              src="/assets/bearing-placeholder.svg" 
              alt="Industrial sensor node" 
              className="w-full h-32 object-cover" 
            />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Transducer:</span>
              <span className="font-mono text-slate-800 font-medium">Piezoelectric Tri-axial</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Temperature RTD:</span>
              <span className="font-mono text-slate-800 font-medium">Pt100 4-Wire Platinum</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Current Sensor:</span>
              <span className="font-mono text-slate-800 font-medium">Closed-Loop Hall Effect</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Sampling Rate:</span>
              <span className="font-mono text-blue-600 font-medium">10 kHz (Edge Buffered)</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('predictions')}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
          >
            <span>Evaluate in ML Predictor</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
