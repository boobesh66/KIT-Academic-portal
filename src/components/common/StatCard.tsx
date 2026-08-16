import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'red' | 'green' | 'amber' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'red',
  onClick,
}) => {
  const accentClasses = {
    red: 'bg-red-50 text-[#B71C1C] border-red-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-sky-50 text-sky-700 border-sky-100',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-5 shadow-xs transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-red-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg border ${accentClasses[accentColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          <span className={trend.isPositive ? 'text-emerald-600' : 'text-red-600'}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-gray-400">vs last assessment</span>
        </div>
      )}
    </div>
  );
};
