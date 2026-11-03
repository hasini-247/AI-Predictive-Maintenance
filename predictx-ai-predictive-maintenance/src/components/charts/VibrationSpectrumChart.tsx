import React from 'react';

interface VibrationSpectrumChartProps {
  rpm: number;
  vibrationRms: number;
  isAnomaly: boolean;
  predictedMode?: string;
}

export const VibrationSpectrumChart: React.FC<VibrationSpectrumChartProps> = ({
  rpm,
  vibrationRms,
  isAnomaly,
  predictedMode = '',
}) => {
  // Running speed fundamental frequency 1X in Hz
  const f1 = Math.round((rpm / 60) * 10) / 10 || 50; // e.g. 3000 rpm -> 50 Hz
  const f2 = Math.round(f1 * 2 * 10) / 10;
  const f3 = Math.round(f1 * 3 * 10) / 10;
  // Bearing BPFO (Ball Pass Frequency Outer Race) typically ~ 3.58 * f1
  const bpfo = Math.round(f1 * 3.58 * 10) / 10;

  // Synthesize realistic FFT frequency spectrum bins (0 to 300 Hz)
  const binsCount = 50;
  const maxFreq = 300;
  const bins: { freq: number; amplitude: number; label?: string }[] = [];

  for (let i = 0; i < binsCount; i++) {
    const freq = Math.round((i / binsCount) * maxFreq);
    let amp = 0.05 + Math.random() * 0.08; // noise floor

    // Check proximities to harmonics
    if (Math.abs(freq - f1) < 4) {
      amp = (vibrationRms * 0.5) + Math.random() * 0.2;
    } else if (Math.abs(freq - f2) < 4) {
      amp = (vibrationRms * (isAnomaly ? 0.45 : 0.2)) + Math.random() * 0.1;
    } else if (Math.abs(freq - f3) < 4) {
      amp = (vibrationRms * 0.15) + Math.random() * 0.05;
    } else if (isAnomaly && Math.abs(freq - bpfo) < 5) {
      // High BPFO spike characteristic of bearing fault
      amp = (vibrationRms * 0.65) + Math.random() * 0.2;
    }

    let label: string | undefined = undefined;
    if (Math.abs(freq - f1) < 4) label = '1X';
    else if (Math.abs(freq - f2) < 4) label = '2X';
    else if (Math.abs(freq - f3) < 4) label = '3X';
    else if (isAnomaly && Math.abs(freq - bpfo) < 5) label = 'BPFO';

    bins.push({ freq, amplitude: Math.round(amp * 100) / 100, label });
  }

  const maxAmp = Math.max(...bins.map(b => b.amplitude), 4);
  const chartHeight = 130;
  const chartWidth = 500;

  return (
    <div className="w-full bg-slate-900 rounded-lg p-3 text-slate-200 border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">FFT Frequency Spectrum</span>
          <span className="text-[11px] font-mono text-slate-400">
            Base: {f1} Hz (1X) · RMS: {vibrationRms} mm/s
          </span>
        </div>
        {isAnomaly && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-400 font-bold">
            Defect Harmonic Detected ({predictedMode})
          </span>
        )}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32 overflow-visible">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const y = chartHeight - frac * (chartHeight - 20) - 15;
            return (
              <g key={idx}>
                <line x1="30" y1={y} x2={chartWidth} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <text x="25" y={y + 3} textAnchor="end" className="fill-slate-500 font-mono text-[8px]">
                  {(maxAmp * frac).toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* FFT Spectrum Bars */}
          {bins.map((bin, idx) => {
            const barW = (chartWidth - 40) / binsCount - 1.5;
            const x = 35 + idx * ((chartWidth - 40) / binsCount);
            const barH = (bin.amplitude / maxAmp) * (chartHeight - 35);
            const y = chartHeight - 20 - barH;
            const isSpike = bin.label !== undefined;
            const barColor = bin.label === 'BPFO' 
              ? '#ef4444' 
              : isSpike 
              ? '#3b82f6' 
              : '#475569';

            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  fill={barColor}
                  rx="1"
                  className="transition-all duration-300"
                />
                {isSpike && (
                  <text
                    x={x + barW / 2}
                    y={y - 4}
                    textAnchor="middle"
                    className="font-mono text-[8px] font-bold fill-slate-200"
                  >
                    {bin.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Frequency Axis Line & Ticks */}
          <line x1="35" y1={chartHeight - 20} x2={chartWidth} y2={chartHeight - 20} stroke="#334155" strokeWidth="1" />
          {[0, 50, 100, 150, 200, 250, 300].map((freqVal) => {
            const x = 35 + (freqVal / maxFreq) * (chartWidth - 40);
            return (
              <g key={freqVal}>
                <line x1={x} y1={chartHeight - 20} x2={x} y2={chartHeight - 16} stroke="#475569" strokeWidth="1" />
                <text x={x} y={chartHeight - 6} textAnchor="middle" className="fill-slate-400 font-mono text-[8px]">
                  {freqVal}Hz
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
