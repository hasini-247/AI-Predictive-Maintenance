import React, { useState } from 'react';
import { 
  Server, 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Activity, 
  Clock, 
  Calendar, 
  FileText, 
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Machine, PlantZone, MachineStatus } from '../../types';
import { TelemetryChart } from '../charts/TelemetryChart';

export const MachineManagementView: React.FC = () => {
  const { 
    machines, 
    setSelectedMachineId, 
    setActiveTab, 
    addMachine 
  } = useTelemetry();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [inspectMachine, setInspectMachine] = useState<Machine | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Machine Form State
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Centrifugal Pump');
  const [newZone, setNewZone] = useState<PlantZone>('Zone A - Precision Machining');
  const [newTemp, setNewTemp] = useState(48.5);
  const [newVib, setNewVib] = useState(1.45);
  const [newCurr, setNewCurr] = useState(18.0);
  const [newRpm, setNewRpm] = useState(3000);
  const [newPower, setNewPower] = useState('30 kW');

  // Filter machines
  const filteredMachines = machines.filter(m => {
    const matchesSearch = 
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesZone = zoneFilter === 'all' || m.zone.includes(zoneFilter);
    return matchesSearch && matchesStatus && matchesZone;
  });

  const handleAddNewMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newName) return;

    addMachine({
      id: newId.toUpperCase(),
      name: newName,
      type: newType,
      zone: newZone,
      status: 'healthy',
      temperature: newTemp,
      vibration: newVib,
      current: newCurr,
      rpm: newRpm,
      operatingHours: 120,
      lastMaintenance: new Date().toISOString().split('T')[0],
      installationDate: new Date().toISOString().split('T')[0],
      specifications: {
        ratedPower: newPower,
        maxTemp: 78,
        maxVibration: 2.8,
        nominalCurrent: 22,
        manufacturer: 'Industrial Dynamics',
        modelNumber: 'ID-5000',
      },
    });

    setIsAddModalOpen(false);
    setNewId('');
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Industrial Machine Fleet Inventory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Managing {machines.length} monitored assets across 4 manufacturing zones with IoT telemetry
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register Machine</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machine ID, name, or type..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="healthy">Healthy Only</option>
              <option value="warning">At Risk (Warning)</option>
              <option value="critical">Critical Action</option>
              <option value="maintenance">In Maintenance</option>
            </select>

            {/* Zone Filter */}
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Plant Zones</option>
              <option value="Zone A">Zone A - Precision Machining</option>
              <option value="Zone B">Zone B - Power & Utilities</option>
              <option value="Zone C">Zone C - Fluid Transfer</option>
              <option value="Zone D">Zone D - Heavy Stamping</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMachines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-900">{machine.id}</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        machine.status === 'critical' ? 'bg-red-100 text-red-700' :
                        machine.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                        machine.status === 'maintenance' ? 'bg-slate-200 text-slate-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {machine.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug line-clamp-1">
                      {machine.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">{machine.zone.split(' - ')[0]}</p>
                  </div>

                  <div className="text-right">
                    <span className={`text-xl font-extrabold font-mono tabular-nums ${
                      machine.healthScore < 50 ? 'text-red-600' :
                      machine.healthScore < 80 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {machine.healthScore}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Health</span>
                  </div>
                </div>

                {/* 3 Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-mono text-center">
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase block">Temp</span>
                    <span className="font-bold text-slate-800 tabular-nums">{machine.temperature}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase block">Vib</span>
                    <span className={`font-bold tabular-nums ${
                      machine.vibration > 7.1 ? 'text-red-600' : machine.vibration > 2.8 ? 'text-amber-600' : 'text-slate-800'
                    }`}>
                      {machine.vibration} <span className="text-[9px] text-slate-400">mm/s</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase block">Current</span>
                    <span className="font-bold text-slate-800 tabular-nums">{machine.current} A</span>
                  </div>
                </div>

                {/* Status or Diagnostic Note */}
                <div className="mt-3 text-[11px] text-slate-600 line-clamp-1">
                  <strong>Diagnostic:</strong> {machine.predictedFailureMode}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectMachine(machine)}
                  className="px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setSelectedMachineId(machine.id);
                    setActiveTab('sensors');
                  }}
                  className="px-2.5 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Sensor History</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Machine ID</th>
                <th className="py-3 px-4">Machine Name</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4 text-right">Temp (°C)</th>
                <th className="py-3 px-4 text-right">Vib (mm/s)</th>
                <th className="py-3 px-4 text-right">Current (A)</th>
                <th className="py-3 px-4 text-center">Health</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filteredMachines.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{m.id}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">{m.name}</td>
                  <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">{m.zone.split(' - ')[0]}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{m.temperature}</td>
                  <td className={`py-3 px-4 text-right tabular-nums font-semibold ${
                    m.vibration > 7.1 ? 'text-red-600' : m.vibration > 2.8 ? 'text-amber-600' : 'text-slate-800'
                  }`}>
                    {m.vibration}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">{m.current}</td>
                  <td className="py-3 px-4 text-center tabular-nums font-bold">
                    <span className={
                      m.healthScore < 50 ? 'text-red-600' :
                      m.healthScore < 80 ? 'text-amber-600' : 'text-emerald-600'
                    }>
                      {m.healthScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-sans uppercase font-bold px-2 py-0.5 rounded-full ${
                      m.status === 'critical' ? 'bg-red-100 text-red-700' :
                      m.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                      m.status === 'maintenance' ? 'bg-slate-200 text-slate-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 font-sans">
                    <button
                      onClick={() => setInspectMachine(m)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMachineId(m.id);
                        setActiveTab('sensors');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Sensors
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Machine Details Modal */}
      {inspectMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {inspectMachine.id}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    inspectMachine.status === 'critical' ? 'bg-red-100 text-red-700' :
                    inspectMachine.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {inspectMachine.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{inspectMachine.name}</h3>
                <p className="text-xs text-slate-500">{inspectMachine.zone} · Installed {inspectMachine.installationDate}</p>
              </div>
              <button
                onClick={() => setInspectMachine(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Telemetry Summary */}
              <div className="grid grid-cols-4 gap-3 text-center p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-sans">Temp</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">{inspectMachine.temperature}°C</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-sans">Vibration</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">{inspectMachine.vibration} mm/s</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-sans">Current</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">{inspectMachine.current} A</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-sans">Health</span>
                  <span className="text-base font-bold text-blue-600 tabular-nums">{inspectMachine.healthScore}%</span>
                </div>
              </div>

              {/* Hardware Specifications */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">Manufacturer Specifications</span>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Manufacturer / Model</span>
                    <span className="font-medium text-slate-800">{inspectMachine.specifications.manufacturer} ({inspectMachine.specifications.modelNumber})</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Rated Power</span>
                    <span className="font-medium text-slate-800">{inspectMachine.specifications.ratedPower}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Max Safe Vibration (ISO Zone C)</span>
                    <span className="font-medium text-slate-800">{inspectMachine.specifications.maxVibration} mm/s</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Nominal Current Draw</span>
                    <span className="font-medium text-slate-800">{inspectMachine.specifications.nominalCurrent} Amps</span>
                  </div>
                </div>
              </div>

              {/* Mini Sparkline Chart */}
              <div>
                <span className="font-bold text-slate-900 text-xs block mb-2">Vibration Velocity History</span>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <TelemetryChart
                    data={inspectMachine.history}
                    metricKey="vibration"
                    label="Vibration Telemetry"
                    unit="mm/s"
                    height={130}
                    warningThreshold={2.8}
                    criticalThreshold={7.1}
                  />
                </div>
              </div>

              {/* Diagnostic Recommendation */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-700">
                <span className="font-bold text-blue-900 block mb-1">AI Diagnostic Assessment:</span>
                <p><strong>Predicted Mode:</strong> {inspectMachine.predictedFailureMode}</p>
                <p className="mt-1"><strong>Estimated RUL:</strong> {inspectMachine.rulDays} days remaining before critical threshold crossing.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedMachineId(inspectMachine.id);
                  setInspectMachine(null);
                  setActiveTab('sensors');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                Open in Sensor Workbench
              </button>
              <button
                onClick={() => setInspectMachine(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Machine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Register New Industrial Machine</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewMachine} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Machine Tag / ID (e.g. CNC-505)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TURB-202"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Machine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Pressure Waterjet Cutter"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Machine Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="CNC Machining Center">CNC Machining Center</option>
                  <option value="Centrifugal Pump">Centrifugal Pump</option>
                  <option value="Industrial Turbine">Industrial Turbine</option>
                  <option value="Hydraulic Press">Hydraulic Press</option>
                  <option value="Air Compressor">Air Compressor</option>
                  <option value="Industrial Robot">Industrial Robot</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plant Zone</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value as PlantZone)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Zone A - Precision Machining">Zone A - Precision Machining</option>
                  <option value="Zone B - Power & Utilities">Zone B - Power & Utilities</option>
                  <option value="Zone C - Fluid Transfer">Zone C - Fluid Transfer</option>
                  <option value="Zone D - Heavy Stamping">Zone D - Heavy Stamping</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTemp}
                    onChange={(e) => setNewTemp(parseFloat(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vib (mm/s)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newVib}
                    onChange={(e) => setNewVib(parseFloat(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current (A)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCurr}
                    onChange={(e) => setNewCurr(parseFloat(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
                >
                  Add to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
