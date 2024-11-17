import React, { useState, useEffect } from 'react';
import { Bell, X, Filter, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotificationStore } from '../stores/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';

const typeIcons = {
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
  success: CheckCircle
};

const typeColors = {
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  success: 'text-green-500'
};

export function NotificationCenter() {
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info' | 'success'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(
    (notification) => filter === 'all' || notification.type === filter
  );

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 hover:bg-[#2A2A2A] rounded-lg"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
            <h3 className="font-semibold text-white">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Mark all as read
              </button>
              <button
                onClick={() => clearNotifications()}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-[#2a2a2a] rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-2 border-b border-[#2a2a2a] flex items-center space-x-2">
            {(['all', 'error', 'warning', 'info', 'success'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === type
                    ? 'bg-red-500 text-white'
                    : 'text-gray-400 hover:bg-[#2a2a2a]'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = typeIcons[notification.type];
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`w-full p-4 border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors text-left ${
                      !notification.read_at ? 'bg-[#2a2a2a]/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 ${typeColors[notification.type]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white">{notification.title}</h4>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{notification.message}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}