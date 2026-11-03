import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  BrainCircuit, 
  Server, 
  AlertTriangle, 
  BarChart3, 
  Workflow, 
  Compass, 
  ChevronRight, 
  UserCheck,
  ShieldCheck,
  Cpu,
  Power,
  Github
} from 'lucide-react';
import { useTelemetry, NavigationTab } from '../../context/TelemetryContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    activeAlertsCount, 
    criticalAlertsCount, 
    user, 
    setIsAuthModalOpen,
    isLiveStreaming,
    setIsLiveStreaming,
    setIsGitHubModalOpen
  } = useTelemetry();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Fleet Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'sensors',
      label: 'IoT Sensor Live',
      icon: <Radio className="w-4 h-4" />,
    },
    {
      id: 'predictions',
      label: 'ML Failure Prediction',
      icon: <BrainCircuit className="w-4 h-4" />,
    },
    {
      id: 'machines',
      label: 'Machine Fleet',
      icon: <Server className="w-4 h-4" />,
    },
    {
      id: 'alerts',
      label: 'Maintenance Alerts',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: activeAlertsCount,
      badgeColor: criticalAlertsCount > 0 ? 'bg-red-500 text-white' : 'bg-amber-500 text-white',
    },
    {
      id: 'analytics',
      label: 'Analytics & Trends',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'pipeline',
      label: 'Solution Pipeline',
      icon: <Workflow className="w-4 h-4" />,
    },
    {
      id: 'landing',
      label: 'Project Overview',
      icon: <Compass className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs" 
          onClick={onClose} 
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight text-base leading-tight flex items-center gap-1.5">
                <span>PredictX</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/50">
                  AI-PdM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">Predictive Maintenance</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Industrial Operations
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick GitHub ZIP Export Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                setIsGitHubModalOpen(true);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left bg-slate-800/60 hover:bg-slate-800 text-blue-300 hover:text-white border border-blue-900/40 group"
            >
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                <span className="font-semibold text-xs">Export for GitHub (.ZIP)</span>
              </div>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800 font-mono">
                ZIP
              </span>
            </button>
          </div>
        </div>

        {/* Ingestion & Telemetry Status Box */}
        <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Telemetry Ingestion</span>
            </span>
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`p-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
                isLiveStreaming 
                  ? 'text-emerald-400 hover:bg-emerald-950/50' 
                  : 'text-amber-400 hover:bg-amber-950/50'
              }`}
              title={isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}
            >
              <Power className="w-3 h-3" />
              <span>{isLiveStreaming ? 'RUNNING' : 'PAUSED'}</span>
            </button>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Gateway:</span>
              <span className="text-slate-200 font-medium">MQTT / Broker 01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rate:</span>
              <span className="text-slate-200 tabular-nums">48.2 packets/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ML Latency:</span>
              <span className="text-blue-400 tabular-nums">4.2 ms</span>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800/70 transition-colors text-left group"
          >
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user.role}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
};
