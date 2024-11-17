import React, { useEffect, useState } from 'react';
import { X, AlertCircle, Terminal, Globe, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ErrorDetailsProps {
  errorId: string;
  onClose: () => void;
}

interface ErrorData {
  id: string;
  project_id: string;
  message: string;
  type: string;
  created_at: string;
  severity: 'critical' | 'error' | 'warning';
  stack_trace: string | null;
  browser: string | null;
  os: string | null;
  status: 'open' | 'resolved' | 'ignored';
}

export function ErrorDetails({ errorId, onClose }: ErrorDetailsProps) {
  const [error, setError] = useState<ErrorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchErrorDetails() {
      try {
        const { data, error: fetchError } = await supabase
          .from('errors')
          .select('*')
          .eq('id', errorId)
          .single();

        if (fetchError) throw fetchError;
        setError(data);
      } catch (err) {
        console.error('Failed to fetch error details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (errorId) {
      fetchErrorDetails();
    }
  }, [errorId]);

  if (!error) return null;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] w-full max-w-3xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-white">Error Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Error Message</h3>
              <p className="text-white text-lg">{error.message}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Type</h3>
                <p className="text-white">{error.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Timestamp</h3>
                <p className="text-white">{new Date(error.created_at).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Stack Trace</h3>
              <pre className="bg-[#2A2A2A] rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-300 whitespace-pre-wrap">
                {error.stack_trace || 'No stack trace available'}
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Terminal className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">Severity</span>
                </div>
                <p className="text-white capitalize">{error.severity}</p>
              </div>
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">Browser</span>
                </div>
                <p className="text-white">{error.browser || 'Unknown'}</p>
              </div>
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">Status</span>
                </div>
                <p className="text-white capitalize">{error.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}