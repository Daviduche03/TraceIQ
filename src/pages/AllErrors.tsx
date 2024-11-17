import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { ErrorDetails } from '../components/ErrorDetails';
import { useErrorStore } from '../stores/useErrorStore';
import { formatDistanceToNow } from 'date-fns';

const errorTypes = ['All Types', 'Runtime Error', 'Network Error', 'Database Error', 'Memory Leak'];
const environments = ['All Environments', 'Production', 'Staging', 'Development'];
const severities = ['All Severities', 'Critical', 'Error', 'Warning'];

export function AllErrors() {
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedEnv, setSelectedEnv] = useState('All Environments');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities');
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { errors, loading, fetchErrors } = useErrorStore();
  const projectId = new URLSearchParams(window.location.search).get('projectId');

  useEffect(() => {
    if (projectId) {
      fetchErrors(projectId);
    }
  }, [projectId]);

  const filteredErrors = errors.filter(error => {
    if (selectedType !== 'All Types' && error.type !== selectedType) return false;
    if (selectedSeverity !== 'All Severities' && error.severity !== selectedSeverity.toLowerCase()) return false;
    if (searchQuery && !error.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="text-white">Loading errors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Project Errors</h1>
          <p className="text-gray-400">Project ID: {projectId}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] mb-6">
        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search errors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {errorTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {environments.map((env) => (
                <option key={env} value={env}>{env}</option>
              ))}
            </select>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {severities.map((severity) => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#2a2a2a]">
                <th className="p-4 text-gray-400 font-medium">Error</th>
                <th className="p-4 text-gray-400 font-medium">Type</th>
                <th className="p-4 text-gray-400 font-medium">Environment</th>
                <th className="p-4 text-gray-400 font-medium">Timestamp</th>
                <th className="p-4 text-gray-400 font-medium">Status</th>
                <th className="p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filteredErrors.map((error) => (
                <tr key={error.id} className="hover:bg-[#2a2a2a] transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{error.message}</p>
                      <p className="text-gray-400 text-sm">{error.stack_trace?.split('\n')[0]}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{error.type}</td>
                  <td className="p-4 text-gray-300">{error.browser || 'Unknown'}</td>
                  <td className="p-4 text-gray-300">
                    {formatDistanceToNow(new Date(error.created_at), { addSuffix: true })}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 ${
                      error.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                      error.severity === 'error' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    } rounded-full text-sm`}>
                      {error.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedErrorId(error.id)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between">
          <p className="text-gray-400">Showing {filteredErrors.length} of {errors.length} errors</p>
        </div>
      </div>

      {selectedErrorId && (
        <ErrorDetails 
          errorId={selectedErrorId} 
          onClose={() => setSelectedErrorId(null)} 
        />
      )}
    </div>
  );
}