import React from 'react';

interface HealthGaugeProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'Health Index',
}) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // 240 degree gauge arc (opening at bottom)
  const arcLength = circumference * 0.75;
  const dashOffset = arcLength - (normalizedScore / 100) * arcLength;

  let colorClass = '#10b981'; // emerald-500
  let statusText = 'Optimal';
  if (normalizedScore < 50) {
    colorClass = '#ef4444'; // red-500
    statusText = 'Critical';
  } else if (normalizedScore < 75) {
    colorClass = '#f59e0b'; // amber-500
    statusText = 'Warning';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-135 origin-center"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
            {normalizedScore}
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
          <span 
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mt-0.5"
            style={{ 
              backgroundColor: `${colorClass}15`,
              color: colorClass 
            }}
          >
            {statusText}
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-600 mt-1">{label}</span>
    </div>
  );
};
