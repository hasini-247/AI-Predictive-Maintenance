import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  ShieldAlert, 
  ArrowUpRight, 
  Wrench, 
  RotateCcw,
  UserCheck,
  Check,
  X
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { AlertItem, AlertSeverity } from '../../types';

export const AlertManagementView: React.FC = () => {
  const { 
    alerts, 
    resolveAlert, 
    setSelectedMachineId, 
    setActiveTab,
    criticalAlertsCount,
    activeAlertsCount,
    user
  } = useTelemetry();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'investigating' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'Critical' | 'Warning' | 'Healthy'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Resolve modal state
  const [resolvingAlert, setResolvingAlert] = useState<AlertItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const filteredAlerts = alerts.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || a.riskLevel === severityFilter;
    const matchesSearch = 
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.detectedIssue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingAlert) return;
    resolveAlert(resolvingAlert.id, resolutionNotes);
    setResolvingAlert(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary KPIs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Maintenance Alert & Fault Management Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated anomaly triggers according to ISO 10816 standards and multi-sensor ML classifiers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold">
              {criticalAlertsCount} Critical Hazards Active
            </span>
            <span className="text-xs font-mono px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold">
              {activeAlertsCount} Total Open
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alert ID, machine, or fault type..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="Critical">Critical (Red)</option>
              <option value="Warning">Warning (Yellow)</option>
              <option value="Healthy">Healthy / Info (Green)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Alert Statuses</option>
              <option value="active">Active Unresolved</option>
              <option value="investigating">Under Investigation</option>
              <option value="resolved">Resolved / Cleared</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert List Table / Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 text-base">No Matching Maintenance Alerts</h3>
            <p className="text-xs max-w-sm mx-auto">
              No anomalies found matching current filters. All machinery sensors report values within normal operational tolerance.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.riskLevel === 'Critical';
            const isWarning = alert.riskLevel === 'Warning';
            const isResolved = alert.status === 'resolved';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border p-4 sm:p-5 shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isResolved 
                    ? 'border-slate-200 opacity-75 bg-slate-50/40' 
                    : isCritical 
                    ? 'border-red-300 bg-red-50/10' 
                    : isWarning 
                    ? 'border-amber-300 bg-amber-50/10' 
                    : 'border-emerald-200'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Indicator Icon */}
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isResolved ? 'bg-slate-100 text-slate-500' :
                    isCritical ? 'bg-red-100 text-red-600' :
                    isWarning ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {isResolved ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>

                  {/* Alert Core Info */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{alert.id}</span>
                      <span className="text-slate-300">·</span>
                      <button
                        onClick={() => {
                          setSelectedMachineId(alert.machineId);
                          setActiveTab('sensors');
                        }}
                        className="font-mono text-xs font-bold text-blue-600 hover:underline"
                      >
                        {alert.machineId} ({alert.machineName})
                      </button>
                      <span className="text-slate-300">·</span>
                      {/* Risk Level Badge */}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isCritical ? 'bg-red-100 text-red-700' :
                        isWarning ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {alert.riskLevel} Risk
                      </span>

                      {/* Status Badge */}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        isResolved ? 'bg-slate-200 text-slate-700' :
                        alert.status === 'investigating' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {alert.detectedIssue}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Recommended Action:</strong> {alert.recommendedAction}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                      <span>Trigger: <strong>{alert.metricTriggered} ({alert.value})</strong> vs threshold <strong>{alert.threshold}</strong></span>
                      <span>·</span>
                      <span>Logged: {alert.timestamp}</span>
                    </div>

                    {/* Resolution info if resolved */}
                    {isResolved && alert.resolvedAt && (
                      <div className="mt-2 p-2 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-800">Resolved at {alert.resolvedAt} by {alert.resolvedBy}:</span>{' '}
                        {alert.resolutionNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex sm:flex-col md:flex-row items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedMachineId(alert.machineId);
                      setActiveTab('sensors');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {!isResolved && (
                    <button
                      onClick={() => {
                        setResolvingAlert(alert);
                        setResolutionNotes(`Verified sensor telemetry and inspected ${alert.machineName}. Corrective procedure executed successfully.`);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1 transition-colors shadow-2xs whitespace-nowrap"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve Alert</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolve Alert Confirmation Modal */}
      {resolvingAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Mark Maintenance Alert Resolved</h3>
              </div>
              <button
                onClick={() => setResolvingAlert(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="py-4 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-mono text-slate-500 font-bold">{resolvingAlert.id} · {resolvingAlert.machineId}</div>
                <div className="font-bold text-slate-900">{resolvingAlert.detectedIssue}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Technician Resolution & Corrective Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe parts replaced, grease applied, or sensor recalibration..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Sign-off: <strong>{user.name}</strong> ({user.role})</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingAlert(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-2xs"
                >
                  Confirm & Archive Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
