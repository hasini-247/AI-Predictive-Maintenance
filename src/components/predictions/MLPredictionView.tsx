import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  SlidersHorizontal, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Flame, 
  Clock, 
  HelpCircle,
  FileText,
  BarChart2,
  TrendingDown,
  Layers
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { HealthGauge } from '../charts/HealthGauge';
import { runMLInference } from '../../utils/mlEngine';
import { ML_MODEL_METRICS } from '../../data/initialMachines';

export const MLPredictionView: React.FC = () => {
  const { 
    machines, 
    selectedMachineId, 
    setSelectedMachineId, 
    selectedMachine,
    setActiveTab
  } = useTelemetry();

  // What-If Simulator state
  const [simTemp, setSimTemp] = useState<number>(selectedMachine.temperature);
  const [simVib, setSimVib] = useState<number>(selectedMachine.vibration);
  const [simCurrent, setSimCurrent] = useState<number>(selectedMachine.current);

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'inference' | 'whatif' | 'metrics'>('inference');

  // Run ML on current machine
  const currentInference = runMLInference(
    selectedMachine.temperature,
    selectedMachine.vibration,
    selectedMachine.current
  );

  // Run ML on simulator sliders
  const simInference = runMLInference(simTemp, simVib, simCurrent);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Machine Learning Predictive Maintenance Engine
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                  {selectedMachine.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                XGBoost Classifier & Autoencoder Anomaly Detector · Trained on 1.2M multi-sensor industrial cycles
              </p>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('inference')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'inference' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Current Asset Prediction
            </button>
            <button
              onClick={() => {
                setActiveSubTab('whatif');
                setSimTemp(selectedMachine.temperature);
                setSimVib(selectedMachine.vibration);
                setSimCurrent(selectedMachine.current);
              }}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'whatif' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>What-If Simulator</span>
            </button>
            <button
              onClick={() => setActiveSubTab('metrics')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'metrics' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Model Metrics & Validation
            </button>
          </div>
        </div>

        {/* Machine Switcher Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Target Asset:</span>
            <select
              value={selectedMachineId}
              onChange={(e) => {
                setSelectedMachineId(e.target.value);
                const target = machines.find(m => m.id === e.target.value);
                if (target) {
                  setSimTemp(target.temperature);
                  setSimVib(target.vibration);
                  setSimCurrent(target.current);
                }
              }}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:ring-1 focus:ring-blue-500"
            >
              {machines.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id} – {m.name} ({m.healthScore}% health)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Hours Logged: <strong className="font-mono text-slate-800">{selectedMachine.operatingHours} hrs</strong></span>
            <span>·</span>
            <span>Last Maintenance: <strong className="font-mono text-slate-800">{selectedMachine.lastMaintenance}</strong></span>
          </div>
        </div>
      </div>

      {/* VIEW 1: CURRENT ASSET PREDICTION */}
      {activeSubTab === 'inference' && (
        <div className="space-y-6">
          {/* Main 4 ML Inference Outcome Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Health Score Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Predicted Health Score
                  </span>
                  <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums mt-1.5">
                    {currentInference.healthScore}%
                  </div>
                </div>
                <div className="w-12 h-12 flex items-center justify-center">
                  <HealthGauge score={currentInference.healthScore} size={48} strokeWidth={5} />
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between text-slate-500">
                <span>Degradation Penalty</span>
                <span className="font-mono font-semibold text-slate-700">
                  -{(100 - currentInference.healthScore)} pts
                </span>
              </div>
            </div>

            {/* Failure Risk Level Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Failure Risk Level
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight uppercase ${
                    currentInference.failureRisk === 'High' ? 'text-red-600' :
                    currentInference.failureRisk === 'Medium' ? 'text-amber-600' :
                    'text-emerald-600'
                  }`}>
                    {currentInference.failureRisk}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    currentInference.failureRisk === 'High' ? 'bg-red-100 text-red-700' :
                    currentInference.failureRisk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {currentInference.failureProbability}% PROB
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between text-slate-500">
                <span>Confidence Level</span>
                <span className="font-mono font-semibold text-blue-600">96.8% (XGBoost)</span>
              </div>
            </div>

            {/* Estimated RUL (Remaining Useful Life) Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Estimated Useful Life (RUL)
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight tabular-nums ${
                    currentInference.rulDays <= 7 ? 'text-red-600' :
                    currentInference.rulDays <= 30 ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>
                    {currentInference.rulDays}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Days</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between text-slate-500">
                <span>Weibull Fatigue Model</span>
                <span className="font-mono font-semibold text-slate-700">β = 2.14 shape</span>
              </div>
            </div>

            {/* Anomaly Detection Status Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Reconstruction Anomaly
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight tabular-nums ${
                    currentInference.anomalyDetected ? 'text-red-600' : 'text-slate-900'
                  }`}>
                    {currentInference.anomalyScore}
                  </span>
                  <span className="text-xs font-medium text-slate-500">/ 100</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between text-slate-500">
                <span>Detection Threshold</span>
                <span className={`font-mono font-semibold ${currentInference.anomalyDetected ? 'text-red-600' : 'text-emerald-600'}`}>
                  {currentInference.anomalyDetected ? 'FLAGGED ANOMALOUS' : 'NOMINAL (<55)'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Diagnostic & Prescriptive Action Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-5 h-5 ${
                  currentInference.failureRisk === 'High' ? 'text-red-600' :
                  currentInference.failureRisk === 'Medium' ? 'text-amber-600' :
                  'text-emerald-600'
                }`} />
                <h3 className="font-bold text-slate-900 text-sm">
                  Model Diagnostic Diagnosis & Root Cause Classification
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                Inference Code: INF-{selectedMachine.id}-09
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Predicted Failure Mode
                </div>
                <div className="text-base font-bold text-slate-900">
                  {currentInference.predictedFailureMode}
                </div>
                <div className="text-xs text-slate-600 leading-relaxed pt-1">
                  <strong>Physics Mechanism:</strong> {currentInference.rootCauseAnalysis}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                  Prescriptive Maintenance Recommendation
                </div>
                <div className="text-sm font-bold text-blue-900">
                  Action Required
                </div>
                <div className="text-xs text-slate-700 leading-relaxed pt-1">
                  {currentInference.recommendedAction}
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors"
                  >
                    View Maintenance Alerts
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-medium transition-colors"
                  >
                    Download Audit Report
                  </button>
                </div>
              </div>
            </div>

            {/* Sensor Relative Contribution Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Multi-Sensor Anomaly Attribution:</span>
                <span className="font-mono text-slate-500">Reconstruction Error Weighting</span>
              </div>
              <div className="w-full bg-slate-100 rounded-lg h-4 flex overflow-hidden text-[10px] font-mono font-bold text-white">
                <div 
                  className="bg-blue-600 flex items-center justify-center transition-all duration-500" 
                  style={{ width: `${currentInference.sensorContributions.vibration}%` }}
                  title="Vibration RMS contribution"
                >
                  {currentInference.sensorContributions.vibration > 15 && `Vib ${currentInference.sensorContributions.vibration}%`}
                </div>
                <div 
                  className="bg-amber-500 flex items-center justify-center transition-all duration-500" 
                  style={{ width: `${currentInference.sensorContributions.temperature}%` }}
                  title="Temperature gradient contribution"
                >
                  {currentInference.sensorContributions.temperature > 15 && `Temp ${currentInference.sensorContributions.temperature}%`}
                </div>
                <div 
                  className="bg-purple-600 flex items-center justify-center transition-all duration-500" 
                  style={{ width: `${currentInference.sensorContributions.current}%` }}
                  title="Phase current load contribution"
                >
                  {currentInference.sensorContributions.current > 15 && `Curr ${currentInference.sensorContributions.current}%`}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>Vibration (RMS Velocity)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Temperature (Bearing RTD)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <span>Motor Phase Current</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE WHAT-IF MACHINE LEARNING SIMULATOR */}
      {activeSubTab === 'whatif' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Interactive Machine Learning "What-If" Inference Sandbox
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust simulated sensor inputs to observe how the ML classifier reacts, recalculates RUL, and identifies failure modes in real time.
                </p>
              </div>
              <button
                onClick={() => {
                  setSimTemp(50.0);
                  setSimVib(1.4);
                  setSimCurrent(20.0);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Ideal Baseline</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sliders Input Panel */}
            <div className="space-y-5">
              {/* Temperature Slider */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Bearing Temperature (°C)</span>
                  <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 tabular-nums">
                    {simTemp} °C
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="105"
                  step="0.5"
                  value={simTemp}
                  onChange={(e) => setSimTemp(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>30°C (Cold)</span>
                  <span className="text-amber-600">72°C (Warning)</span>
                  <span className="text-red-600">85°C (Critical)</span>
                  <span>105°C</span>
                </div>
              </div>

              {/* Vibration Slider */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Vibration Velocity (mm/s RMS)</span>
                  <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 tabular-nums">
                    {simVib} mm/s
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15.0"
                  step="0.1"
                  value={simVib}
                  onChange={(e) => setSimVib(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.5 mm/s (Zone A)</span>
                  <span className="text-blue-600">2.8 mm/s (Zone B)</span>
                  <span className="text-amber-600">7.1 mm/s (Zone C)</span>
                  <span className="text-red-600">15.0 mm/s (Zone D)</span>
                </div>
              </div>

              {/* Current Slider */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Motor Phase Current (Amps)</span>
                  <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 tabular-nums">
                    {simCurrent} A
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="65"
                  step="0.5"
                  value={simCurrent}
                  onChange={(e) => setSimCurrent(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5A (Idle)</span>
                  <span className="text-emerald-600">20A (Nominal)</span>
                  <span className="text-amber-600">38A (High Load)</span>
                  <span className="text-red-600">65A (Jamming)</span>
                </div>
              </div>

              {/* Quick Scenarios buttons */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Preset Failure Scenarios:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSimTemp(82.0);
                      setSimVib(8.2);
                      setSimCurrent(26.0);
                    }}
                    className="p-2 text-xs rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50/50 text-left transition-colors"
                  >
                    <div className="font-semibold text-red-700">Bearing Fatigue Spall</div>
                    <div className="text-[10px] text-slate-500">High Vib + Thermal Rise</div>
                  </button>
                  <button
                    onClick={() => {
                      setSimTemp(52.0);
                      setSimVib(6.8);
                      setSimCurrent(22.0);
                    }}
                    className="p-2 text-xs rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-colors"
                  >
                    <div className="font-semibold text-amber-700">Shaft Misalignment</div>
                    <div className="text-[10px] text-slate-500">Pure 1X/2X Dynamic Vib</div>
                  </button>
                  <button
                    onClick={() => {
                      setSimTemp(92.0);
                      setSimVib(2.1);
                      setSimCurrent(28.0);
                    }}
                    className="p-2 text-xs rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-colors"
                  >
                    <div className="font-semibold text-amber-700">Cooling Channel Block</div>
                    <div className="text-[10px] text-slate-500">Isolated Thermal Spike</div>
                  </button>
                  <button
                    onClick={() => {
                      setSimTemp(74.0);
                      setSimVib(4.2);
                      setSimCurrent(52.0);
                    }}
                    className="p-2 text-xs rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-colors"
                  >
                    <div className="font-semibold text-purple-700">Mechanical Jamming</div>
                    <div className="text-[10px] text-slate-500">Severe Overcurrent Surge</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Model Output Display */}
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4" />
                    <span>Real-Time Model Inference</span>
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    simInference.failureRisk === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    simInference.failureRisk === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {simInference.failureRisk} Risk
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Health Index</span>
                    <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                      {simInference.healthScore}%
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Predicted RUL</span>
                    <div className="text-2xl font-bold font-mono tabular-nums text-blue-400 mt-1">
                      {simInference.rulDays} <span className="text-xs font-normal text-slate-400">days</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Classified Failure Mode:
                  </div>
                  <div className="text-sm font-bold text-white">
                    {simInference.predictedFailureMode}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {simInference.rootCauseAnalysis}
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-blue-950/40 border border-blue-800/50 space-y-1">
                  <div className="text-[10px] text-blue-400 uppercase font-semibold">
                    Recommended Maintenance Strategy:
                  </div>
                  <div className="text-xs text-slate-200">
                    {simInference.recommendedAction}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Anomaly Score: {simInference.anomalyScore}/100</span>
                <span>ISO 10816: {simInference.isoZone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MODEL METRICS & VALIDATION */}
      {activeSubTab === 'metrics' && (
        <div className="space-y-6">
          {/* Top Model Performance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Model Accuracy
              </span>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums mt-1.5">
                {ML_MODEL_METRICS.accuracy}%
              </div>
              <div className="mt-2 text-xs text-slate-500">Validated on 10-fold cross validation</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Precision & Recall
              </span>
              <div className="flex items-baseline gap-2 mt-1.5 font-mono">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {ML_MODEL_METRICS.precision}%
                </span>
                <span className="text-xs text-slate-500">/</span>
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {ML_MODEL_METRICS.recall}%
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500">F1-Score: {ML_MODEL_METRICS.f1Score}%</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                ROC - AUC Score
              </span>
              <div className="text-2xl lg:text-3xl font-extrabold text-blue-600 font-mono tracking-tight tabular-nums mt-1.5">
                {ML_MODEL_METRICS.rocAuc}
              </div>
              <div className="mt-2 text-xs text-slate-500">Excellent discrimination capability</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Unplanned Downtime Reduction
              </span>
              <div className="text-2xl lg:text-3xl font-extrabold text-emerald-600 font-mono tracking-tight tabular-nums mt-1.5">
                {ML_MODEL_METRICS.downtimeReduction}
              </div>
              <div className="mt-2 text-xs text-slate-500">Savings: {ML_MODEL_METRICS.maintenanceCostSavings}</div>
            </div>
          </div>

          {/* Feature Importance & Confusion Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Importance Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Feature Importance Analysis (SHAP / Gini)</h3>
                <p className="text-xs text-slate-500">Relative contribution of physical sensor features to failure prediction</p>
              </div>

              <div className="space-y-3">
                {ML_MODEL_METRICS.featuresImportance.map((feat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{feat.feature}</span>
                      <span className="font-mono font-bold text-blue-600 tabular-nums">{feat.importance}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${feat.importance}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confusion Matrix & Model Specs */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Model Confusion Matrix & Architecture</h3>
                <p className="text-xs text-slate-500">Binary failure classification evaluated across 10,112 test cycles</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">True Nominal (TN)</div>
                  <div className="text-2xl font-bold font-mono text-emerald-900 mt-1 tabular-nums">
                    {ML_MODEL_METRICS.confusionMatrix.trueHealthy}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Correctly Classified Healthy</div>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="text-[10px] uppercase font-bold text-amber-700">False Positive (FP)</div>
                  <div className="text-2xl font-bold font-mono text-amber-900 mt-1 tabular-nums">
                    {ML_MODEL_METRICS.confusionMatrix.falseWarning}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Precautionary False Alarm</div>
                </div>

                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="text-[10px] uppercase font-bold text-red-700">False Negative (FN)</div>
                  <div className="text-2xl font-bold font-mono text-red-900 mt-1 tabular-nums">
                    {ML_MODEL_METRICS.confusionMatrix.falseHealthy}
                  </div>
                  <div className="text-[11px] text-red-700 mt-0.5">Missed Anomaly Event</div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-[10px] uppercase font-bold text-blue-700">True Positive (TP)</div>
                  <div className="text-2xl font-bold font-mono text-blue-900 mt-1 tabular-nums">
                    {ML_MODEL_METRICS.confusionMatrix.trueWarning}
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Correctly Identified Failure</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div><strong>Algorithm:</strong> Extreme Gradient Boosting (XGBoost) + Deep Autoencoder</div>
                <div><strong>Training Set:</strong> NASA Turbofan C-MAPSS + Industrial Centrifugal Pump Telemetry</div>
                <div><strong>Latency:</strong> 4.2 ms per batch inference running on edge micro-gateway</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
