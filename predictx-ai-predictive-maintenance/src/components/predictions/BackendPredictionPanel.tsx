import React, { useEffect, useState } from 'react';
import { Activity, Database, Server, Wifi, WifiOff } from 'lucide-react';
import { Machine } from '../../types';

type Props = { machine: Machine };
type Result = {
  machine_id: string;
  failure_probability_percent: number;
  risk_level: string;
  health_score: number;
  iso_vibration_zone: string;
  predicted_failure_mode: string;
  recommended_action: string;
  model_accuracy: number;
  model_note: string;
};
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const BackendPredictionPanel: React.FC<Props> = ({ machine }) => {
  const [online, setOnline] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${API}/health`).then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (active) setOnline(Boolean(data.status === 'ok' && data.model_trained)); })
      .catch(() => { if (active) setOnline(false); });
    return () => { active = false; };
  }, []);

  const runPrediction = async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch(`${API}/api/telemetry`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machine_id: machine.id,
          temperature_c: machine.temperature,
          vibration_mm_s: machine.vibration,
          current_a: machine.current,
          rpm: machine.rpm,
          acoustic_db: 60 + machine.vibration * 1.4,
          source: 'PredictX dashboard',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Prediction request failed');
      setResult(data); setOnline(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not connect to the API');
      setOnline(false);
    } finally { setBusy(false); }
  };

  return <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Server className="w-5 h-5" /></div>
        <div><h3 className="font-bold text-slate-900">Python ML Backend</h3><p className="text-xs text-slate-500">FastAPI · Random Forest · SQLite telemetry history</p></div>
      </div>
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${online ? 'bg-emerald-50 text-emerald-700' : online === false ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
        {online ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
        {online ? 'API + model online' : online === false ? 'Backend not connected' : 'Checking backend…'}
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={runPrediction} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
        <Activity className="w-4 h-4" />{busy ? 'Running prediction…' : 'Run Python ML prediction & save reading'}
      </button>
      <span className="text-xs text-slate-500">Current asset: <strong>{machine.id}</strong></span>
    </div>
    {error && <p className="text-sm text-rose-600">{error}. Start the backend using the instructions in the project README.</p>}
    {result && <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><p className="text-[10px] uppercase tracking-wide text-slate-500">Failure probability</p><p className="text-xl font-bold text-slate-900">{result.failure_probability_percent}%</p></div>
        <div><p className="text-[10px] uppercase tracking-wide text-slate-500">Risk level</p><p className="text-xl font-bold text-slate-900">{result.risk_level}</p></div>
        <div><p className="text-[10px] uppercase tracking-wide text-slate-500">Health score</p><p className="text-xl font-bold text-slate-900">{result.health_score}%</p></div>
        <div><p className="text-[10px] uppercase tracking-wide text-slate-500">Vibration zone</p><p className="text-sm font-bold text-slate-900 mt-1">{result.iso_vibration_zone}</p></div>
      </div>
      <div className="text-sm"><p className="font-semibold text-slate-800">{result.predicted_failure_mode}</p><p className="text-slate-600 mt-1">{result.recommended_action}</p></div>
      <p className="flex items-start gap-2 text-[11px] text-slate-500"><Database className="w-3.5 h-3.5 shrink-0" /> Reading saved to SQLite. Holdout accuracy on generated demo data: {(result.model_accuracy * 100).toFixed(1)}%. {result.model_note}</p>
    </div>}
  </section>;
};
