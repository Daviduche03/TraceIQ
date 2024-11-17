import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  status?: {
    text: string;
    color: string;
  };
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export function MetricCard({ icon: Icon, title, value, status, trend }: MetricCardProps) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#3A3A3A] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-[#2A2A2A] rounded-lg">
          <Icon className="w-5 h-5 text-red-500" />
        </div>
        {status && (
          <span className={`text-sm font-medium ${status.color} bg-[#2A2A2A] px-2 py-1 rounded`}>
            {status.text}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className="text-3xl font-bold text-white">{value}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-sm">
          <span className={trend.isUp ? 'text-red-500' : 'text-green-500'}>
            {trend.isUp ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-gray-500 ml-2">vs last hour</span>
        </div>
      )}
    </div>
  );
}