import { useEffect } from 'react';
import { Header } from '../components/Header';
import { MetricCard } from '../components/MetricCard';
import { ErrorList } from '../components/ErrorList';
import { ErrorChart } from '../components/ErrorChart';
import { AlertCircle, Database, Clock, Activity } from 'lucide-react';
import { useProjectStore } from '../stores/useProjectStore';
import { useErrorStore } from '../stores/useErrorStore';
import { errorTracker } from '../lib/errorTracking';


// await errorTracker.trackError({
//   message: "new.message",
//   type: 'AuthError',
//   severity: 'error',
//   environment: import.meta.env.MODE,
//   metadata: { email: 'email', operation: 'signIn' }
// });

export function Dashboard() {
  const { selectedProject } = useProjectStore();
  const { stats, fetchErrorStats, fetchErrors } = useErrorStore();

  useEffect(() => {
    if (selectedProject) {
      fetchErrorStats(selectedProject.id);
      fetchErrors(selectedProject.id);
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Project Selected</h1>
          <p className="text-gray-400 mb-4">Create a project to start tracking errors</p>
          <a 
            href="/projects" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
          >
            Go to Projects
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400">Monitor and track your application errors in real-time</p>
          </div>
          <div className="flex gap-4">
            <select className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 rounded-lg px-4 py-2">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={AlertCircle}
            title="Total Errors"
            value={stats.total.toString()}
            trend={{ value: "12%", isUp: true }}
          />
          <MetricCard
            icon={Database}
            title="Critical Errors"
            value={stats.critical.toString()}
            status={{ text: "Critical", color: "text-red-500" }}
          />
          <MetricCard
            icon={Clock}
            title="Error Rate"
            value={stats.error.toString()}
            status={{ text: "High", color: "text-yellow-500" }}
          />
          <MetricCard
            icon={Activity}
            title="Warnings"
            value={stats.warning.toString()}
            trend={{ value: "0.8%", isUp: false }}
          />
        </div>

        {stats.total === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Errors Yet</h2>
            <p className="text-gray-400 mb-4">Integrate the error tracking SDK to start monitoring errors</p>
            <a 
              href="/integration" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
            >
              View Integration Guide
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorChart />
            <ErrorList />
          </div>
        )}
      </main>
    </div>
  );
}