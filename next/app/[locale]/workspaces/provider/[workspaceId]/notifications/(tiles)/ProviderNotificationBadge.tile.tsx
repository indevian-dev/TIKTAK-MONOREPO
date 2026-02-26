"use client";

import {
  useState,
  useEffect
} from 'react';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import type { Notification } from '@tiktak/shared/types/domain/Notification.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
type NotificationType = Notification.PrivateAccess;
import {
  PiBell,
  PiBellRinging
} from 'react-icons/pi';
import { Link }
  from '@/i18n/routing';

interface ProviderNotificationBadgeTileProps {
  className?: string;
}

export function ProviderNotificationBadgeTile({ className = "" }: ProviderNotificationBadgeTileProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotificationSummary();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotificationSummary, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificationSummary = async () => {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/api/provider/notifications?page=1&limit=5',
      });

      if (response.status === 200) {
        setUnreadCount(response.data.unreadCount);
        setRecentNotifications(response.data.notifications.slice(0, 3));
      }
    } catch (error) {
      ConsoleLogger.error('Error fetching notification summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="flex gap-2 items-center relative hover:cursor-pointer justify-end">
        <span className="hidden sm:block text-white font-bold text-xs">
          Notifications
        </span>
        <div className="relative">
          {unreadCount > 0 ? (
            <PiBellRinging className="text-white text-xl" />
          ) : (
            <PiBell className="text-white text-xl" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-app-bright-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-4 hidden group-hover:block w-80 z-50">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-gray-800 font-bold whitespace-nowrap">
            Recent Notifications
          </h5>
          {unreadCount > 0 && (
            <span className="bg-app-bright-purple text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : recentNotifications.length > 0 ? (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {recentNotifications.map((notification) => (
              <li key={notification.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                <div className="flex items-start gap-2">
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-app-bright-purple rounded-full mt-2 shrink-0"></span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.createdAt.toISOString())}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No notifications yet</p>
        )}

        <Link
          href="/provider/notifications"
          className="block w-full bg-app-bright-purple text-white px-4 py-2 rounded-md text-center text-sm font-medium hover:bg-red-600 transition-colors mt-4"
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
}