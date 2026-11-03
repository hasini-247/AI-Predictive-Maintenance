import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Clock, 
  DollarSign, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  Activity,
  Thermometer,
  Wrench
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { TelemetryChart } from '../charts/TelemetryChart';
import { ML_MODEL_METRICS } from '../../data/initialMachines';
import { ReportPrintModal } from '../modals/ReportPrintModal';

export const AnalyticsView: React.FC = () => {
  const { 
    machines, 
    maintenanceLogs, 
    selectedMachine, 
    setSelectedMachineId,
    setActiveTab 
  } = useTelemetry();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Top failure modes distribution
  const failureModesData = [
    { mode: 'Bearing Raceway Fatigue & Micro-Spall', percentage: 42, count: 18, risk: 'High' },
    { mode: 'Shaft Angular & Radial Misalignment', percentage: 24, count: 11, risk: 'Medium' },
    { mode: 'Stator Cooling Inadequacy / Overheating', percentage: 18, count: 8, risk: 'Medium' },
    { mode: 'Hydraulic Seal Degradation & Binding', percentage: 11, count: 5, risk: 'Medium' },
    { mode: 'Electrical Unbalance & Harmonic Slip', percentage: 5, count: 2, risk: 'Low' },
  ];

  // CSV export handler
  const handleExportCSV = () => {
    const headers = ['Machine ID', 'Name', 'Zone', 'Status', 'Health (%)', 'Temp (°C)', 'Vib (mm/s)', 'Current (A)', 'RUL (Days)', 'Predicted Failure'];
    const rows = machines.map(m => [
      m.id,
      `"${m.name}"`,
      `"${m.zone}"`,
      m.status,
      m.healthScore,
      m.temperature,
      m.vibration,
      m.current,
      m.rulDays,
      `"${m.predictedFailureMode}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `predictx_maintenance_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Reliability Analytics & Maintenance Reporting
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mean Time Between Failures (MTBF), sensor trend degradation, and scheduled maintenance history
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Export all machines telemetry to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Maintenance Report</span>
            </button>
          </div>
        </div>

        {/* Industrial KPI Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Mean Time to Failure (MTBF)</span>
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">4,820 hrs</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">+42.5% vs Reactive</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Mean Time to Repair (MTTR)</span>
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">2.4 hrs</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">-62% Reduction</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Total Maintenance Cost Saved</span>
            <span className="text-xl font-bold font-mono text-emerald-600 tabular-nums">$184,200</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Annualized ROI</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Total Monitored Work Orders</span>
            <span className="text-xl font-bold font-mono text-blue-600 tabular-nums">{maintenanceLogs.length} Completed</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">100% Sign-off</span>
          </div>
        </div>
      </div>

      {/* Sensor Trends Comparison (Vibration and Temperature) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Vibration Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Fleet Vibration Distribution (ISO 10816)</h3>
              <p className="text-xs text-slate-500">Peak RMS velocity readings across all operating assets</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              mm/s RMS
            </span>
          </div>

          <div className="space-y-3">
            {machines.map((m) => {
              const vib = m.vibration;
              const maxScale = 12.0;
              const pct = Math.min(100, (vib / maxScale) * 100);
              const isZoneD = vib > 7.1;
              const isZoneC = vib > 2.8 && !isZoneD;

              return (
                <div key={m.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="font-mono text-slate-500">{m.id}</span>
                      <span>{m.name}</span>
                    </span>
                    <span className={`font-mono font-bold tabular-nums ${
                      isZoneD ? 'text-red-600' : isZoneC ? 'text-amber-600' : 'text-slate-800'
                    }`}>
                      {vib} mm/s
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isZoneD ? 'bg-red-500' : isZoneC ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Predicted Failure Modes Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Industrial Failure Mode Distribution</h3>
              <p className="text-xs text-slate-500">Historical & model predicted root causes across fleet</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              P-F Curve Analysis
            </span>
          </div>

          <div className="space-y-3.5">
            {failureModesData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">{item.mode}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-mono">{item.count} events</span>
                    <span className="font-mono font-bold text-blue-600 tabular-nums">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
            <strong>Key Insight:</strong> 42% of mechanical anomalies originate in bearing raceway spalling. Early ultrasonic lubrication detection prevents 88% of secondary shaft deflection.
          </div>
        </div>
      </div>

      {/* Historical Maintenance Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Historical Maintenance Work Order Archive</h3>
            <p className="text-xs text-slate-500">Verified technician interventions, parts replaced, and audited outcomes</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            ISO 55000 Asset Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Work Order</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Machine</th>
                <th className="py-2.5 px-3">Service Type</th>
                <th className="py-2.5 px-3">Technician</th>
                <th className="py-2.5 px-3">Parts Replaced</th>
                <th className="py-2.5 px-3 text-right">Cost</th>
                <th className="py-2.5 px-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {maintenanceLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{log.id}</td>
                  <td className="py-3 px-3 text-slate-500">{log.date}</td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-800">
                    <span className="font-mono text-blue-600 font-bold">{log.machineId}</span> ({log.machineName.split(' ')[0]})
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      log.type === 'Predictive Overhaul' ? 'bg-purple-100 text-purple-700' :
                      log.type === 'Corrective Repair' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-700">{log.technician}</td>
                  <td className="py-3 px-3 font-sans text-slate-600 text-[11px] max-w-xs truncate">
                    {log.partsReplaced.join(', ')}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                    ${log.cost}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-600 text-[11px] max-w-sm">
                    {log.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report Modal */}
      {isReportModalOpen && (
        <ReportPrintModal onClose={() => setIsReportModalOpen(false)} />
      )}
    </div>
  );
};
