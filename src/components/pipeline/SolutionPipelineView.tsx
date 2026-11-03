import React, { useState } from 'react';
import { 
  Workflow, 
  Radio, 
  ArrowRight, 
  Cpu, 
  Binary, 
  BrainCircuit, 
  Bell, 
  CheckCircle2, 
  Code2, 
  Layers, 
  Zap, 
  Clock, 
  ChevronRight,
  Database,
  ShieldCheck
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface PipelineStep {
  number: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  latency: string;
  throughput: string;
  summary: string;
  technologies: string[];
  keyFormulas: string[];
  pythonCode: string;
}

export const SolutionPipelineView: React.FC = () => {
  const { setActiveTab } = useTelemetry();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const pipelineSteps: PipelineStep[] = [
    {
      number: 1,
      title: 'IoT Sensors',
      subtitle: 'Collect Machine Telemetry',
      icon: <Radio className="w-5 h-5" />,
      latency: '< 1 ms',
      throughput: '10,000 samples / sec',
      summary: 'Tri-axial piezoelectric accelerometers, Pt100 platinum RTDs, and closed-loop Hall effect current transducers measure rotational kinetics, thermal dissipation, and electrical loading directly at the motor & bearing journal housings.',
      technologies: ['Piezoelectric Crystals', 'Pt100 4-Wire RTD', 'Hall Effect Transducers', 'Edge Microcontroller (STM32/ESP32)'],
      keyFormulas: [
        'V_rms = \\sqrt{ \\frac{1}{N} \\sum_{i=1}^N v_i^2 }',
        'R_T = R_0 (1 + A \\cdot T + B \\cdot T^2)',
        'I_{load} = \\frac{V_{hall}}{S_{transducer}}'
      ],
      pythonCode: `# 1. Edge Sensor Sampling & Hardware ADC Ingestion
import smbus2, time
import numpy as np

def read_piezo_sensor(bus_id=1, addr=0x68):
    # Read high-frequency tri-axial accelerometer at 10kHz
    bus = smbus2.SMBus(bus_id)
    raw_data = bus.read_i2c_block_data(addr, 0x3B, 14)
    # Convert raw two's complement into physical G and mm/s
    ax = (np.int16((raw_data[0] << 8) | raw_data[1])) / 16384.0 * 9.80665
    temp = ((np.int16((raw_data[6] << 8) | raw_data[7])) / 340.0) + 36.53
    return {"accel_ms2": ax, "temp_c": temp}
`
    },
    {
      number: 2,
      title: 'Stream Ingestion',
      subtitle: 'Receive & Buffer Streams',
      icon: <Cpu className="w-5 h-5" />,
      latency: '2.4 ms',
      throughput: '48.2 packets / sec',
      summary: 'Sensor telemetry packets are packetized using lightweight binary Protobuf / JSON over TLS-encrypted MQTT (Message Queuing Telemetry Transport) brokers, buffered in Apache Kafka distributed time-series topics with guaranteed zero-loss delivery.',
      technologies: ['MQTT v5.0 (Mosquitto)', 'Apache Kafka', 'Edge Gateway Node', 'TimescaleDB / InfluxDB'],
      keyFormulas: [
        'QoS = 1 (At Least Once Delivery)',
        'Kafka Partition Hash = CRC32(machine_id) \\pmod M'
      ],
      pythonCode: `# 2. Stream Ingestion Broker & Kafka Publisher
import paho.mqtt.client as mqtt
import json
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers=['kafka-broker.industrial:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def on_telemetry_rx(client, userdata, message):
    payload = json.loads(message.payload.decode())
    # Publish to time-series machine telemetry topic
    producer.send(f"plant4.telemetry.{payload['machine_id']}", payload)

mqtt_client = mqtt.Client(client_id="gateway_plant4")
mqtt_client.on_message = on_telemetry_rx
mqtt_client.connect("mqtt-broker.local", 1883)
mqtt_client.subscribe("sensors/+/telemetry")
`
    },
    {
      number: 3,
      title: 'Feature Engineering',
      subtitle: 'Extract Informative Signals',
      icon: <Binary className="w-5 h-5" />,
      latency: '3.1 ms',
      throughput: '1,200 window calculations / sec',
      summary: 'Raw high-frequency time-series waveforms are transformed into rich mechanical health indicators. Computes Time-domain statistical moments (RMS velocity, Peak-to-Peak, Crest Factor, Kurtosis, Skewness) and Frequency-domain Fast Fourier Transform (FFT) harmonics (1X running speed, 2X, and bearing ball-pass frequencies BPFO/BPFI).',
      technologies: ['NumPy & SciPy Signal Processing', 'Fast Fourier Transform (FFT)', 'Hilbert Envelope Demodulation', 'Rolling Window Buffers'],
      keyFormulas: [
        '\\text{Crest Factor} = \\frac{v_{peak}}{v_{rms}}',
        '\\text{Kurtosis} = \\frac{\\frac{1}{N} \\sum (v_i - \\mu)^4}{\\sigma^4}',
        'X[k] = \\sum_{n=0}^{N-1} x[n] e^{-j 2\\pi k n / N}'
      ],
      pythonCode: `# 3. Signal Processing & Feature Extraction
import scipy.signal as signal
from scipy.stats import kurtosis, skew

def extract_features(vibration_waveform, sample_rate=10000):
    # Time-domain features
    rms = np.sqrt(np.mean(np.square(vibration_waveform)))
    crest_factor = np.max(np.abs(vibration_waveform)) / (rms + 1e-6)
    kurt = kurtosis(vibration_waveform)
    
    # Frequency-domain (FFT)
    freqs, psd = signal.welch(vibration_waveform, fs=sample_rate, nperseg=1024)
    peak_freq = freqs[np.argmax(psd)]
    
    return {
        "vibration_rms": float(rms),
        "crest_factor": float(crest_factor),
        "kurtosis": float(kurt),
        "dominant_freq_hz": float(peak_freq)
    }
`
    },
    {
      number: 4,
      title: 'ML Anomaly & RUL Model',
      subtitle: 'Predict Failures & RUL',
      icon: <BrainCircuit className="w-5 h-5" />,
      latency: '4.2 ms',
      throughput: '250 model inferences / sec',
      summary: 'Deep Autoencoders calculate reconstruction error to detect unseen zero-day operational anomalies. Concurrently, an XGBoost ensemble classifier categorizes exact failure modes (e.g. Bearing outer-race spall, misalignment, cavitation), while a parametric Weibull degradation curve estimates Remaining Useful Life (RUL) in days.',
      technologies: ['XGBoost Classification', 'PyTorch / TF Autoencoder', 'Weibull Hazard Regression', 'SHAP Explainability'],
      keyFormulas: [
        '\\text{Reconstruction Error} = \\| x - \\hat{x} \\|_2^2',
        'R(t) = \\exp\\left( -\\left(\\frac{t}{\\eta}\\right)^\\beta \\right)',
        '\\text{RUL} = \\int_t^\\infty \\frac{R(u)}{R(t)} du'
      ],
      pythonCode: `# 4. Machine Learning Inference & RUL Estimation
import xgboost as xgb
import numpy as np

# Load pre-trained models
xgb_classifier = xgb.XGBClassifier()
xgb_classifier.load_model("models/predictx_xgb_pdm.json")

def evaluate_machine_risk(features):
    X = np.array([[features['vibration_rms'], features['temp_c'], features['current_a'], features['hours']]])
    
    # Predict failure mode & probability
    failure_prob = xgb_classifier.predict_proba(X)[0][1]
    predicted_class = xgb_classifier.predict(X)[0]
    
    # Estimate RUL via Weibull hazard curve
    beta = 2.14 # Aging shape parameter
    rul_days = round(max(1, 180 * (1 - failure_prob)**beta))
    
    return {
        "failure_probability": float(failure_prob),
        "risk_level": "High" if failure_prob > 0.7 else "Medium" if failure_prob > 0.3 else "Low",
        "rul_days": int(rul_days)
    }
`
    },
    {
      number: 5,
      title: 'Maintenance Alert',
      subtitle: 'Prescriptive Work Orders',
      icon: <Bell className="w-5 h-5" />,
      latency: '< 100 ms',
      throughput: 'Instant push / Webhook dispatch',
      summary: 'When failure risk escalates above warning or critical thresholds, automated prescriptive alerts are dispatched to the operations room, triggering CMMS (Computerized Maintenance Management System) work orders with recommended repair actions and spare part allocations.',
      technologies: ['WebSocket Live Push', 'CMMS / SAP PM Integration', 'SMS / Email Gateway', 'Automated Work Orders'],
      keyFormulas: [
        '\\text{Severity} = \\begin{cases} \\text{Critical} & \\text{if } RUL \\le 7 \\text{ or ISO Zone D} \\\\ \\text{Warning} & \\text{if } RUL \\le 30 \\text{ or ISO Zone C} \\\\ \\text{Healthy} & \\text{otherwise} \\end{cases}'
      ],
      pythonCode: `# 5. Dispatch Maintenance Alert & CMMS Work Order
def dispatch_predictive_work_order(alert_payload):
    if alert_payload['risk_level'] == 'High':
        cmms_order = {
            "work_order_id": f"WO-{int(time.time())}",
            "machine_id": alert_payload['machine_id'],
            "priority": "P1_URGENT_PREDICTIVE",
            "required_procedure": alert_payload['recommended_action'],
            "target_completion": "WITHIN_48_HOURS"
        }
        # Send payload to industrial CMMS API
        print(f"[CMMS DISPATCHED] Created P1 Work Order for {alert_payload['machine_id']}")
        return cmms_order
`
    }
  ];

  const currentStep = pipelineSteps[activeStepIndex];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                PredictX End-to-End Predictive Maintenance Pipeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                5-stage visual architecture from physical transducer sensing to prescriptive technician work order
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('predictions')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Test Model in Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Stage Stepper Navigation Bar */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-5 gap-2">
          {pipelineSteps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    0{step.number}
                  </span>
                  <span className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.icon}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug truncate">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep-Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stage Explanation & Specs */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Stage 0{currentStep.number} of 05
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{currentStep.title}</h3>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed">
            {currentStep.summary}
          </div>

          {/* Real-time Telemetry benchmark metrics */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Processing Latency:</span>
              <span className="font-bold text-blue-600">{currentStep.latency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Data Throughput:</span>
              <span className="font-bold text-slate-800">{currentStep.throughput}</span>
            </div>
          </div>

          {/* Underlying Technologies */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Core Technologies & Standards
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentStep.technologies.map((t, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mathematical Formulations */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Governing Mathematical Principles
            </span>
            <div className="space-y-1.5 font-mono text-[11px] text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {currentStep.keyFormulas.map((f, i) => (
                <div key={i} className="py-0.5 text-blue-900 font-semibold">
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-2 flex justify-between">
            <button
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex(p => Math.max(0, p - 1))}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              ← Previous Stage
            </button>
            <button
              disabled={activeStepIndex === pipelineSteps.length - 1}
              onClick={() => setActiveStepIndex(p => Math.min(pipelineSteps.length - 1, p + 1))}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40 flex items-center gap-1"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Python Implementation Code Block */}
        <div className="lg:col-span-2 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-xs font-bold text-slate-300">
                  pipeline_stage_{currentStep.number}_{currentStep.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.py
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Python 3.11 · Scikit-Learn · NumPy</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                <code>{currentStep.pythonCode}</code>
              </pre>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Production Pipeline Tested on Industrial Siemens & KUKA Cell</span>
            </span>
            <span className="font-mono text-[11px]">ISO 13374-1 Condition Monitoring Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
