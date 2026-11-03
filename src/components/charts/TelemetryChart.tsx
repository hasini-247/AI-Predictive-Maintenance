import React, { useState } from 'react';
import { SensorReading } from '../../types';

interface TelemetryChartProps {
  data: SensorReading[];
  metricKey: 'temperature' | 'vibration' | 'current' | 'healthScore';
  label: string;
  unit: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  lineColor?: string;
  fillColor?: string;
  height?: number;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  metricKey,
  label,
  unit,
  warningThreshold,
  criticalThreshold,
  lineColor = '#2563eb', // blue-600
  fillColor = 'rgba(37, 99, 235, 0.08)',
  height = 200,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<SensorReading | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div 
        className="w-full flex items-center justify-center text-xs text-slate-400 border border-slate-200 border-dashed rounded-lg bg-slate-50/50"
        style={{ height }}
      >
        Waiting for telemetry data points...
      </div>
    );
  }

  // Values calculation
  const values = data.map(d => d[metricKey] as number);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values, criticalThreshold || 0, warningThreshold || 0);

  // Pad min and max for clean chart view
  const padding = (rawMax - rawMin) * 0.15 || 5;
  const minY = Math.max(0, Math.floor(rawMin - padding));
  const maxY = Math.ceil(rawMax + padding);
  const rangeY = maxY - minY || 1;

  const width = 600; // SVG viewBox coordinates
  const svgHeight = height;
  const margin = { top: 15, right: 15, bottom: 25, left: 45 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  const getX = (index: number) => {
    return margin.left + (index / (data.length - 1 || 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return margin.top + innerHeight - ((val - minY) / rangeY) * innerHeight;
  };

  // Generate SVG path for line
  const pointsString = data
    .map((d, i) => `${getX(i).toFixed(1)},${getY(d[metricKey] as number).toFixed(1)}`)
    .join(' ');

  const areaString = `${pointsString} ${getX(data.length - 1)},${margin.top + innerHeight} ${getX(0)},${margin.top + innerHeight}`;

  // Y-axis grid values
  const yTicks = [
    minY,
    minY + rangeY * 0.33,
    minY + rangeY * 0.66,
    maxY
  ].map(v => Math.round(v * 10) / 10);

  return (
    <div className="relative w-full select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">{label}</span>
          <span className="text-[11px] font-mono text-slate-500 tabular-nums">
            Current: {values[values.length - 1]} {unit}
          </span>
        </div>
        {hoveredPoint && (
          <div className="text-[11px] font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {hoveredPoint.timestamp} : <strong className="text-blue-600">{hoveredPoint[metricKey]} {unit}</strong>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${svgHeight}`}
        className="w-full overflow-visible"
        style={{ height }}
        onMouseLeave={() => {
          setHoveredPoint(null);
          setHoverIndex(null);
        }}
      >
        <defs>
          <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {yTicks.map((tick, i) => {
          const y = getY(tick);
          return (
            <g key={i}>
              <line
                x1={margin.left}
                y1={y}
                x2={margin.left + innerWidth}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray={i === 0 ? undefined : '3 3'}
              />
              <text
                x={margin.left - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-400 font-mono text-[9px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Warning Threshold Guideline */}
        {warningThreshold && warningThreshold <= maxY && warningThreshold >= minY && (
          <g>
            <line
              x1={margin.left}
              y1={getY(warningThreshold)}
              x2={margin.left + innerWidth}
              y2={getY(warningThreshold)}
              stroke="#f59e0b"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <text
              x={margin.left + innerWidth}
              y={getY(warningThreshold) - 4}
              textAnchor="end"
              className="fill-amber-600 font-mono text-[9px] font-medium"
            >
              Warning ({warningThreshold} {unit})
            </text>
          </g>
        )}

        {/* Critical Threshold Guideline */}
        {criticalThreshold && criticalThreshold <= maxY && criticalThreshold >= minY && (
          <g>
            <line
              x1={margin.left}
              y1={getY(criticalThreshold)}
              x2={margin.left + innerWidth}
              y2={getY(criticalThreshold)}
              stroke="#ef4444"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <text
              x={margin.left + innerWidth}
              y={getY(criticalThreshold) - 4}
              textAnchor="end"
              className="fill-red-600 font-mono text-[9px] font-medium"
            >
              Critical ({criticalThreshold} {unit})
            </text>
          </g>
        )}

        {/* Shaded Area */}
        <polygon points={areaString} fill={`url(#grad-${metricKey})`} />

        {/* Telemetry Line */}
        <polyline
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsString}
        />

        {/* Hover Crosshair and Points */}
        {hoverIndex !== null && (
          <g>
            <line
              x1={getX(hoverIndex)}
              y1={margin.top}
              x2={getX(hoverIndex)}
              y2={margin.top + innerHeight}
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle
              cx={getX(hoverIndex)}
              cy={getY(values[hoverIndex])}
              r="4.5"
              fill={lineColor}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Invisible interactive overlay bars for smooth hovering */}
        {data.map((point, i) => {
          const x = getX(i) - innerWidth / (data.length * 2);
          const barW = innerWidth / data.length;
          return (
            <rect
              key={i}
              x={Math.max(margin.left, x)}
              y={margin.top}
              width={barW}
              height={innerHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => {
                setHoveredPoint(point);
                setHoverIndex(i);
              }}
            />
          );
        })}

        {/* X-axis labels (first, middle, last) */}
        {data.length > 0 && (
          <>
            <text
              x={margin.left}
              y={svgHeight - 6}
              textAnchor="start"
              className="fill-slate-400 font-mono text-[9px]"
            >
              {data[0].timestamp}
            </text>
            <text
              x={margin.left + innerWidth / 2}
              y={svgHeight - 6}
              textAnchor="middle"
              className="fill-slate-400 font-mono text-[9px]"
            >
              {data[Math.floor(data.length / 2)]?.timestamp}
            </text>
            <text
              x={margin.left + innerWidth}
              y={svgHeight - 6}
              textAnchor="end"
              className="fill-slate-400 font-mono text-[9px]"
            >
              {data[data.length - 1].timestamp}
            </text>
          </>
        )}
      </svg>
    </div>
  );
};
