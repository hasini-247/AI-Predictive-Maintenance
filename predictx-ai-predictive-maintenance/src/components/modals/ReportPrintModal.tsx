import React from 'react';
import { Printer, Download, X, ShieldCheck, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface ReportPrintModalProps {
  onClose: () => void;
}

export const ReportPrintModal: React.FC<ReportPrintModalProps> = ({ onClose }) => {
  const { machines, alerts, maintenanceLogs, user } = useTelemetry();

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fleetHealth = Math.round(machines.reduce((a, b) => a + b.healthScore, 0) / (machines.length || 1));
  const criticalCount = machines.filter(m => m.status === 'critical').length;
  const warningCount = machines.filter(m => m.status === 'warning').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full my-6 p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-sm text-slate-800">
              Industrial Condition Monitoring Audit Report Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT CONTENT */}
        <div className="space-y-6 text-xs leading-normal">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b-2 border-slate-900 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  PredictX Industrial Telemetry Systems
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                AI-Powered Predictive Maintenance & Condition Monitoring
              </p>
              <p className="text-[11px] text-slate-600 font-mono mt-1">
                Plant Location: Stuttgart Manufacturing Hub #4 · Zone A-D
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-[11px] space-y-0.5">
              <div><strong>Report ID:</strong> REP-2026-1102-09</div>
              <div><strong>Generation Date:</strong> {currentDate}</div>
              <div><strong>Standards:</strong> ISO 10816-3 / ISO 13374-1</div>
              <div><strong>Auditor:</strong> {user.name} ({user.role})</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              1. Executive Reliability Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-xs">
              Simulated multi-sensor telemetry from {machines.length} machinery assets is displayed in this demonstration. The Python API uses a Random Forest trained on generated sample data. Overall plant fleet health is rated at <strong>{fleetHealth}%</strong>. Currently, <strong>{criticalCount} asset(s)</strong> exhibit critical ISO 10816 Zone D exceedances requiring immediate intervention, while <strong>{warningCount} asset(s)</strong> exhibit early warning wear characteristics.
            </p>

            <div className="grid grid-cols-4 gap-3 text-center py-2 font-mono">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[10px] text-slate-500 font-sans block">Fleet Health Score</span>
                <span className="text-lg font-bold text-slate-900">{fleetHealth}%</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[10px] text-slate-500 font-sans block">Nominal Assets</span>
                <span className="text-lg font-bold text-emerald-600">{machines.filter(m => m.status === 'healthy').length} Units</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[10px] text-slate-500 font-sans block">Early Warning</span>
                <span className="text-lg font-bold text-amber-600">{warningCount} Units</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[10px] text-slate-500 font-sans block">Critical / Urgent</span>
                <span className="text-lg font-bold text-red-600">{criticalCount} Units</span>
              </div>
            </div>
          </div>

          {/* Section 2: Fleet Status Table */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              2. Machinery Condition & Sensor Readings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                    <th className="p-2 border-r border-slate-300">Machine ID</th>
                    <th className="p-2 border-r border-slate-300">Machine Description</th>
                    <th className="p-2 border-r border-slate-300 text-right">Temp (°C)</th>
                    <th className="p-2 border-r border-slate-300 text-right">Vib (mm/s)</th>
                    <th className="p-2 border-r border-slate-300 text-right">Current (A)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Health</th>
                    <th className="p-2 border-r border-slate-300 text-center">Est. RUL</th>
                    <th className="p-2">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {machines.map((m) => (
                    <tr key={m.id} className={m.status === 'critical' ? 'bg-red-50/50' : m.status === 'warning' ? 'bg-amber-50/50' : ''}>
                      <td className="p-2 border-r border-slate-200 font-bold">{m.id}</td>
                      <td className="p-2 border-r border-slate-200 font-sans">{m.name}</td>
                      <td className="p-2 border-r border-slate-200 text-right tabular-nums">{m.temperature}</td>
                      <td className="p-2 border-r border-slate-200 text-right tabular-nums">{m.vibration}</td>
                      <td className="p-2 border-r border-slate-200 text-right tabular-nums">{m.current}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold tabular-nums">{m.healthScore}%</td>
                      <td className="p-2 border-r border-slate-200 text-center tabular-nums">{m.rulDays} days</td>
                      <td className="p-2 font-sans font-semibold uppercase text-[10px]">
                        <span className={
                          m.status === 'critical' ? 'text-red-700' :
                          m.status === 'warning' ? 'text-amber-700' :
                          'text-emerald-700'
                        }>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Machine Learning Failure Analysis */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              3. Prescriptive Diagnostic Actions
            </h2>
            <div className="space-y-2">
              {machines.filter(m => m.status === 'critical' || m.status === 'warning').map((m) => (
                <div key={m.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between items-center font-mono font-bold text-slate-800">
                    <span>{m.id} – {m.name}</span>
                    <span className="text-red-600 uppercase font-sans text-[10px]">{m.status} CONDITION</span>
                  </div>
                  <div className="text-slate-700 mt-1">
                    <strong>Root Cause Diagnosis:</strong> {m.predictedFailureMode}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    <strong>Recommended Procedure:</strong> Immediate inspection of journal bearing housing, acoustic ultrasonic test, and schedule hot-bearing overhaul within 48 hours.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Engineering Sign-off */}
          <div className="pt-6 border-t-2 border-slate-900">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              4. Certified Engineering Sign-Off
            </h2>
            <div className="grid grid-cols-2 gap-8 text-xs font-mono">
              <div className="space-y-4">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-sans block">Lead Reliability Engineer:</span>
                  <div className="font-bold text-slate-900 mt-1">{user.name}</div>
                  <div className="text-slate-500 text-[11px]">{user.role}</div>
                </div>
                <div className="pt-8 border-b border-slate-400">
                  <span className="text-[10px] text-slate-400 font-sans">Signature / Timestamp: 2026-11-02 21:00 UTC</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-sans block">Plant Operations Director:</span>
                  <div className="font-bold text-slate-900 mt-1">Elena Rostova</div>
                  <div className="text-slate-500 text-[11px]">Plant Operations Directorate</div>
                </div>
                <div className="pt-8 border-b border-slate-400">
                  <span className="text-[10px] text-slate-400 font-sans">Authorized CMMS Approval Verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="no-print pt-6 mt-6 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
