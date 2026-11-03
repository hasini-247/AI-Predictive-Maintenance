import React, { useState } from 'react';
import { 
  Menu, 
  Play, 
  Pause, 
  Flame, 
  Zap, 
  RotateCcw, 
  Bell, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Github,
  Download
} from 'lucide-react';
import { useTelemetry, NavigationTab } from '../../context/TelemetryContext';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const { 
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
    injectAnomaly,
    selectedMachineId,
    machines,
    setIsGitHubModalOpen
  } = useTelemetry();

  const [isAlertsDropdownOpen, setIsAlertsDropdownOpen] = useState(false);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [selectedAnomalyMachine, setSelectedAnomalyMachine] = useState(selectedMachineId);

  const getBreadcrumbTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'dashboard': return 'Fleet Overview & Health Metrics';
      case 'sensors': return 'Real-Time IoT Sensor Monitoring';
      case 'predictions': return 'Machine Learning Predictive Diagnostics';
      case 'machines': return 'Industrial Machinery Asset Management';
      case 'alerts': return 'Maintenance Alert & Work Order Queue';
      case 'analytics': return 'Telemetry Trends & Reliability Analytics';
      case 'pipeline': return 'PredictX End-to-End Solution Architecture';
      case 'landing': return 'Project Architecture & Executive Brief';
      default: return 'PredictX Platform';
    }
  };

  const activeAlertList = alerts.filter(a => a.status === 'active' || a.status === 'investigating').slice(0, 5);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Plant #4</span>
            <span aria-hidden="true">/</span>
            <span>PredictX</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium capitalize">{activeTab}</span>
          </div>
          <h1 className="text-sm lg:text-base font-bold text-slate-900 truncate tracking-tight">
            {getBreadcrumbTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {/* Simulated Telemetry Badge Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulatedData ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulatedData ? 'bg-blue-600' : 'bg-emerald-600'}`}></span>
          </span>
          <span className="text-slate-700 font-medium whitespace-nowrap">
            {isSimulatedData ? 'Simulated Telemetry (Demo Active)' : 'Hardware Telemetry (MQTT)'}
          </span>
          <button
            onClick={() => setIsSimulatedData(!isSimulatedData)}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 ml-1"
          >
            {isSimulatedData ? 'Switch' : 'Simulate'}
          </button>
        </div>

        {/* Telemetry Stream Play/Pause & Speed */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
              isLiveStreaming
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'bg-white text-amber-700 shadow-xs'
            }`}
            title={isLiveStreaming ? 'Pause live IoT telemetry stream' : 'Resume live stream'}
          >
            {isLiveStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span className="hidden md:inline">Live</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden md:inline">Paused</span>
              </>
            )}
          </button>

          <div className="flex items-center px-1 text-slate-400">|</div>

          <button
            onClick={() => setStreamSpeed(streamSpeed === 1 ? 2 : streamSpeed === 2 ? 5 : 1)}
            className="px-2 py-1 text-xs font-mono font-medium text-slate-700 hover:text-slate-900 rounded transition-colors"
            title="Adjust simulation speed"
          >
            {streamSpeed}x
          </button>
        </div>

        {/* Anomaly Injector Sandbox Button */}
        <button
          onClick={() => setIsSimModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs whitespace-nowrap"
          title="Inject artificial hardware anomaly to demonstrate predictive maintenance"
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">Inject Anomaly</span>
          <span className="md:hidden">Sim</span>
        </button>

        {/* GitHub Export / Download ZIP Button */}
        <button
          onClick={() => setIsGitHubModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs whitespace-nowrap"
          title="Download complete project ZIP archive for GitHub and Hackathon faculty submission"
        >
          <Github className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Export for GitHub (.ZIP)</span>
          <span className="sm:hidden">.ZIP</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsDropdownOpen(!isAlertsDropdownOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="View maintenance alerts"
          >
            <Bell className="w-5 h-5" />
            {activeAlertsCount > 0 && (
              <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${criticalAlertsCount > 0 ? 'bg-red-500 ring-2 ring-white' : 'bg-amber-500'}`} />
            )}
          </button>

          {/* Alerts Dropdown */}
          {isAlertsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Active Telemetry Alerts</span>
                  <span className="px-1.5 py-0.5 text-[11px] font-mono font-bold bg-red-100 text-red-700 rounded">
                    {activeAlertsCount}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setIsAlertsDropdownOpen(false);
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  View All Alerts
                </button>
              </div>

              {activeAlertList.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                  All industrial machines operating nominally within ISO standards.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {activeAlertList.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setActiveTab('alerts');
                        setIsAlertsDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-bold text-slate-700">{a.machineId}</span>
                        <span className={`font-semibold ${a.riskLevel === 'Critical' ? 'text-red-600' : 'text-amber-600'}`}>
                          {a.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-900 line-clamp-1">{a.detectedIssue}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{a.recommendedAction}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Anomaly Injection Simulation Modal */}
      {isSimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Inject Machine Anomaly</h3>
                  <p className="text-xs text-slate-500">Demonstrate live ML detection and alert trigger</p>
                </div>
              </div>
              <button
                onClick={() => setIsSimModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Target Machine
                </label>
                <select
                  value={selectedAnomalyMachine}
                  onChange={(e) => setSelectedAnomalyMachine(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-900"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} – {m.name} ({m.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  Select Failure Mode to Simulate
                </div>

                <button
                  onClick={() => {
                    injectAnomaly(selectedAnomalyMachine, 'bearing');
                    setIsSimModalOpen(false);
                    setActiveTab('predictions');
                  }}
                  className="w-full p-3 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50/50 flex items-start gap-3 transition-colors text-left group"
                >
                  <div className="p-1.5 rounded bg-red-100 text-red-700 group-hover:bg-red-200 shrink-0 mt-0.5">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Bearing Outer-Race Fatigue</div>
                    <div className="text-[11px] text-slate-500">
                      Injects ISO Zone D vibration spike (8.8 mm/s) + frictional heat. Tests classification & RUL reduction.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    injectAnomaly(selectedAnomalyMachine, 'thermal');
                    setIsSimModalOpen(false);
                    setActiveTab('sensors');
                  }}
                  className="w-full p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 flex items-start gap-3 transition-colors text-left group"
                >
                  <div className="p-1.5 rounded bg-amber-100 text-amber-700 group-hover:bg-amber-200 shrink-0 mt-0.5">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Stator Thermal Runaway</div>
                    <div className="text-[11px] text-slate-500">
                      Injects 91.2°C temperature surge indicating cooling circuit failure or continuous overloading.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    injectAnomaly(selectedAnomalyMachine, 'overload');
                    setIsSimModalOpen(false);
                    setActiveTab('dashboard');
                  }}
                  className="w-full p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-start gap-3 transition-colors text-left group"
                >
                  <div className="p-1.5 rounded bg-blue-100 text-blue-700 group-hover:bg-blue-200 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Mechanical Jamming & Overcurrent</div>
                    <div className="text-[11px] text-slate-500">
                      Injects 54A current surge representing rotor lockup or heavy mechanical binding.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    injectAnomaly(selectedAnomalyMachine, 'reset');
                    setIsSimModalOpen(false);
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Selected Machine to Healthy Baseline
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsSimModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
