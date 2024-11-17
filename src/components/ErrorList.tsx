import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { useErrorStore } from '../stores/useErrorStore';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  critical: 'bg-red-500',
  error: 'bg-orange-500',
  warning: 'bg-yellow-500'
};

export function ErrorList() {
  const { errors } = useErrorStore();

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-indigo-500" />
            <h2 className="font-semibold text-white">Recent Errors</h2>
          </div>
          <select className="bg-[#2A2A2A] text-sm text-gray-400 rounded-lg px-3 py-1.5 border border-[#333]">
            <option>All Types</option>
            <option>Critical Only</option>
            <option>Errors Only</option>
            <option>Warnings Only</option>
          </select>
        </div>
      </div>
      <div className="divide-y divide-[#2A2A2A]">
        {errors.slice(0, 5).map((error) => (
          <button
            key={error.id}
            className="w-full p-4 hover:bg-[#2A2A2A] transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${statusColors[error.severity]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{error.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">{error.type}</p>
                    <span className="text-gray-600">•</span>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(error.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}