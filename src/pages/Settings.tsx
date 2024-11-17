import React, { useState, useEffect } from 'react';
import { Save, Trash2, Bell, Shield, Key, Archive } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useApiKeyStore } from '../stores/useApiKeyStore';
import { useToast } from '../hooks/useToast';

export function Settings() {
  const projectId = new URLSearchParams(window.location.search).get('projectId');
  const { settings, loading, fetchSettings, updateSettings } = useSettingsStore();
  const { keys, fetchApiKeys, generateApiKey, revokeApiKey } = useApiKeyStore();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchSettings(projectId);
      fetchApiKeys(projectId);
    }
  }, [projectId]);

  const handleSave = async () => {
    if (!projectId || !settings) return;
    
    setIsSaving(true);
    try {
      await updateSettings(projectId, settings);
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Settings saved successfully'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateKey = async (keyType: 'production' | 'development') => {
    if (!projectId) return;
    
    try {
      await generateApiKey(projectId, keyType);
      addToast({
        type: 'success',
        title: 'Success',
        message: `${keyType} API key generated successfully`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to generate API key'
      });
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      await revokeApiKey(keyId);
      addToast({
        type: 'success',
        title: 'Success',
        message: 'API key revoked successfully'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to revoke API key'
      });
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Project Settings</h1>
        <p className="text-gray-400">Project ID: {projectId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notification_email}
                  onChange={(e) => updateSettings(projectId!, {
                    notification_email: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Slack Integration</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notification_slack}
                  onChange={(e) => updateSettings(projectId!, {
                    notification_slack: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Error Threshold
              </label>
              <select
                value={settings.notification_threshold}
                onChange={(e) => updateSettings(projectId!, {
                  notification_threshold: parseInt(e.target.value)
                })}
                className="w-full bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="5">5 errors</option>
                <option value="10">10 errors</option>
                <option value="20">20 errors</option>
                <option value="50">50 errors</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                IP Whitelist
              </label>
              <input
                type="text"
                value={settings.ip_whitelist?.join(', ') || ''}
                onChange={(e) => updateSettings(projectId!, {
                  ip_whitelist: e.target.value.split(',').map(ip => ip.trim())
                })}
                placeholder="192.168.1.1, 10.0.0.0/24"
                className="w-full bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Rate Limit (requests/hour)
              </label>
              <input
                type="number"
                value={settings.rate_limit}
                onChange={(e) => updateSettings(projectId!, {
                  rate_limit: parseInt(e.target.value)
                })}
                className="w-full bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Enable Source Maps</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_source_maps}
                  onChange={(e) => updateSettings(projectId!, {
                    enable_source_maps: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <div className="flex items-center space-x-3 mb-6">
            <Archive className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-white">Data Retention</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Error Retention (days)
              </label>
              <select
                value={settings.error_retention_days}
                onChange={(e) => updateSettings(projectId!, {
                  error_retention_days: parseInt(e.target.value)
                })}
                className="w-full bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Logs Retention (days)
              </label>
              <select
                value={settings.logs_retention_days}
                onChange={(e) => updateSettings(projectId!, {
                  logs_retention_days: parseInt(e.target.value)
                })}
                className="w-full bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <div className="flex items-center space-x-3 mb-6">
            <Key className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-white">API Keys</h2>
          </div>
          
          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key.id} className="bg-black rounded-lg p-4 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">{key.key_type === 'production' ? 'Production' : 'Development'} Key</span>
                  {key.is_active ? (
                    <button 
                      onClick={() => handleRevokeKey(key.id)}
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      Revoke
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">Revoked</span>
                  )}
                </div>
                <code className="text-sm text-gray-300">{key.key_value}</code>
              </div>
            ))}
            
            <div className="flex space-x-4">
              <button
                onClick={() => handleGenerateKey('production')}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                Generate Production Key
              </button>
              <button
                onClick={() => handleGenerateKey('development')}
                className="flex-1 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm"
              >
                Generate Development Key
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
          <Trash2 className="w-4 h-4" />
          <span>Delete Project</span>
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}