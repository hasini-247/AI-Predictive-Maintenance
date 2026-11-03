import React from 'react';
import { 
  Cpu, 
  Activity, 
  BrainCircuit, 
  Workflow, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign, 
  Server, 
  Radio, 
  Layers, 
  FileText,
  Award,
  Github,
  Download
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export const LandingPageView: React.FC = () => {
  const { setActiveTab, setIsGitHubModalOpen } = useTelemetry();

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-lg">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/factory-placeholder.svg" 
            alt="Smart Manufacturing Facility" 
            className="w-full h-full object-cover opacity-25" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/60">
              Industry 4.0 · Predictive Maintenance (PdM)
            </span>
            <span className="text-xs text-slate-300 font-mono">
              College Engineering Capstone Demonstration
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            PredictX – AI-Powered Predictive Maintenance for Industry
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            An intelligent industrial telemetry and machine learning platform that monitors rotating machinery via IoT sensors to detect micro-anomalies and predict equipment failures before catastrophic downtime occurs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/25 hover:shadow-lg"
            >
              <span>Launch Live Fleet Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Workflow className="w-4 h-4 text-blue-400" />
              <span>Explore Solution Pipeline</span>
            </button>
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-blue-300 hover:text-white border border-blue-500/40 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4 text-blue-400" />
              <span>Export for GitHub (.ZIP)</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] font-sans uppercase">Unplanned Downtime</span>
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">-38.2%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans uppercase">Maintenance Costs</span>
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">-25.4%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans uppercase">Model Accuracy</span>
              <span className="text-2xl font-bold text-blue-400 tabular-nums">Demo</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans uppercase">ISO Standard</span>
              <span className="text-2xl font-bold text-white tabular-nums">10816-3</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">01. Real-Time IoT Telemetry</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Continuous high-frequency sampling of bearing temperature (°C), tri-axial vibration velocity (mm/s RMS), and motor phase current (A) streaming via industrial MQTT protocol.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">02. Machine Learning Diagnostics</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            A Python Random Forest demo API estimates failure risk from sensor readings; the dashboard also provides illustrative failure-mode diagnostics.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">03. Weibull RUL & Alerts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dynamic Remaining Useful Life (RUL) estimation calculating days before functional failure, automatically triggering prescriptive CMMS work orders for technicians.
          </p>
        </div>
      </div>

      {/* Engineering Project Architecture Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">
            System Design & Technology Stack
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Engineered for Modern Smart Factories & Autonomous Manufacturing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1 leading-relaxed">
            PredictX transitions plants from traditional reactive "run-to-failure" and rigid time-based preventive maintenance into condition-based autonomous intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block font-mono">Frontend Interface</span>
            <div className="font-bold text-slate-900 text-sm">React 19 & TypeScript</div>
            <p className="text-xs text-slate-600">Tailwind CSS, high-density SVG telemetry charts, responsive sidebar layout.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block font-mono">Telemetry Streaming</span>
            <div className="font-bold text-slate-900 text-sm">MQTT Broker & Kafka</div>
            <p className="text-xs text-slate-600">Time-series data bus with QoS 1 guaranteed delivery and edge buffering.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block font-mono">Machine Learning</span>
            <div className="font-bold text-slate-900 text-sm">Python Random Forest API</div>
            <p className="text-xs text-slate-600">Scikit-learn feature extraction, Fast Fourier Transform (FFT), and Weibull survival.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block font-mono">Standards Compliance</span>
            <div className="font-bold text-slate-900 text-sm">ISO 10816-3 & ISO 13374</div>
            <p className="text-xs text-slate-600">Class II & III vibration severity zoning and open system condition monitoring.</p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Demonstration Ready for Academic Engineering Review & Industrial Evaluation</span>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Enter Operational Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
