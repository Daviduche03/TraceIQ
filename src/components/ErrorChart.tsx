import React from 'react';
import { Activity } from 'lucide-react';

// Simulated error data for the last 24 hours
const errorData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  errors: Math.floor(Math.random() * 50) + 10,
  critical: Math.floor(Math.random() * 20),
}));

const maxErrors = Math.max(...errorData.map(d => d.errors));

export function ErrorChart() {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-red-500" />
          <h2 className="font-semibold text-white">Error Trend</h2>
        </div>
        <select className="bg-[#2A2A2A] text-sm text-gray-400 rounded-lg px-3 py-1.5 border border-[#333]">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end space-x-1">
          {errorData.map((data, i) => (
            <div key={i} className="relative flex-1 group">
              <div
                className="w-full bg-red-500/20 rounded-sm transition-all duration-300 group-hover:bg-red-500/30"
                style={{ height: `${(data.errors / maxErrors) * 100}%` }}
              >
                <div
                  className="w-full bg-red-500/40 rounded-sm absolute bottom-0"
                  style={{ height: `${(data.critical / maxErrors) * 100}%` }}
                />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-[#2A2A2A] text-white text-xs rounded px-2 py-1 mt-2 whitespace-nowrap">
                {data.errors} errors ({data.critical} critical)
                <br />
                {data.hour}:00
              </div>
            </div>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute -left-6 inset-y-0 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxErrors}</span>
          <span>{Math.floor(maxErrors * 0.75)}</span>
          <span>{Math.floor(maxErrors * 0.5)}</span>
          <span>{Math.floor(maxErrors * 0.25)}</span>
          <span>0</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500/20 mr-2" />
          <span className="text-gray-400">All Errors</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500/40 mr-2" />
          <span className="text-gray-400">Critical Errors</span>
        </div>
      </div>
    </div>
  );
}