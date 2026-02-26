"use client";

import { useState, useEffect } from 'react';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { toast } from 'react-toastify';
import type { Notification } from '@tiktak/shared/types/domain/Notification.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
type NotificationType = Notification.PrivateAccess;
import {
  PiBell,
  PiBellRinging,
  PiCheck,
  PiX,
  PiCaretLeft,
  PiCaretRight
} from 'react-icons/pi';

interface PaginationInfo {
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  total: number;
}

function NotificationsList() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalPages: 0,
    hasPrev: false,
    hasNext: false,
    total: 0
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const limit = 10;

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiCall({
        method: 'GET',
        url: `/api/provider/notifications?page=${page}&limit=${limit}`,
      });

      if (response.status === 200) {
        setNotifications(response.data.notifications);
        setPagination(response.data.pagination);
        setUnreadCount(response.data.unread_count);
      } else {
        toast.error('Error fetching notifications');
      }
    } catch (error) {
      ConsoleLogger.error('Error:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string, currentStatus: boolean) => {
    try {
      const response = await apiCall({
        method: 'PATCH',
        url: `/api/provider/notifications/update/${notificationId}`,
        body: { mark_as_read: !currentStatus }
      });

      if (response.status === 200) {
        // Update local state
        setNotifications(notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, mark_as_read: !currentStatus }
            : notification
        ));

        // Update unread count
        if (currentStatus) {
          setUnreadCount(unreadCount + 1);
        } else {
          setUnreadCount(Math.max(0, unreadCount - 1));
        }

        toast.success(!currentStatus ? 'Marked as read' : 'Marked as unread');
      } else {
        toast.error('Failed to update notification');
      }
    } catch (error) {
      ConsoleLogger.error('Error:', error);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);

      for (const notification of unreadNotifications) {
        await apiCall({
          method: 'PATCH',
          url: `/api/provider/notifications/update/${notification.id}`,
          body: { mark_as_read: true }
        });
      }

      // Update local state
      setNotifications(notifications.map(notification =>
        ({ ...notification, mark_as_read: true })
      ));
      setUnreadCount(0);

      toast.success('All notifications marked as read');
    } catch (error) {
      ConsoleLogger.error('Error:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PiBell className="text-2xl text-gray-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <PiCheck className="text-lg" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mt-4">
          {([
            { key: 'all' as const, label: 'All', count: notifications.length },
            { key: 'unread' as const, label: 'Unread', count: unreadCount },
            { key: 'read' as const, label: 'Read', count: notifications.length - unreadCount }
          ]).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === key
                ? 'bg-app-bright-purple text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <PiBell className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : filter === 'read'
                  ? "No read notifications yet."
                  : "You don't have any notifications yet."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50 border-l-4 border-l-brand' : ''
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-app-bright-purple text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {!notification.isRead ? (
                      <PiBellRinging className="text-lg" />
                    ) : (
                      <PiBell className="text-lg" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-app-bright-purple rounded-full"></span>
                      )}
                    </div>

                    <p className={`text-sm mb-2 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                      {notification.message}
                    </p>

                    <p className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => markAsRead(notification.id, notification.isRead)}
                  className={`p-2 rounded-md transition-colors ${!notification.isRead
                    ? 'text-app-bright-purple hover:bg-app-bright-purple hover:text-white'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                    }`}
                  title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  {!notification.isRead ? (
                    <PiCheck className="text-lg" />
                  ) : (
                    <PiX className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} notifications
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
                className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PiCaretLeft className="text-lg" />
              </button>

              <span className="px-3 py-1 text-sm font-medium">
                Page {page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
                className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PiCaretRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsList;
