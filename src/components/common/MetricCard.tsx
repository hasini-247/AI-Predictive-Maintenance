import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  unit?: string;
  change?: string;
  isPositive?: boolean;
  statusColor?: 'emerald' | 'blue' | 'amber' | 'red' | 'slate';
  icon?: React.ReactNode;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  unit,
  change,
  isPositive,
  statusColor = 'blue',
  icon,
  badge,
}) => {
  const colorBorders = {
    emerald: 'border-emerald-200 bg-emerald-50/20 text-emerald-700',
    blue: 'border-blue-200 bg-blue-50/20 text-blue-700',
    amber: 'border-amber-200 bg-amber-50/20 text-amber-700',
    red: 'border-red-200 bg-red-50/20 text-red-700',
    slate: 'border-slate-200 bg-slate-50/40 text-slate-700',
  };

  const accentIcons = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-semibold text-slate-500">{unit}</span>
            )}
          </div>
        </div>

        {icon && (
          <div className={`p-2 rounded-lg ${accentIcons[statusColor]} shrink-0`}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || change || badge) && (
        <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-slate-100">
          {subtitle && (
            <span className="text-slate-500 truncate">{subtitle}</span>
          )}
          {change && (
            <span className={`font-mono text-[11px] font-semibold tabular-nums ml-auto ${
              isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {change}
            </span>
          )}
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ml-auto ${colorBorders[statusColor]}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
