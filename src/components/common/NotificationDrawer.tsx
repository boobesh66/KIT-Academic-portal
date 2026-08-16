import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Clock, AlertTriangle, BookOpen, Award } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ai_insight':
        return <Sparkles className="w-4 h-4 text-[#B71C1C]" />;
      case 'attendance':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'exam':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'result':
        return <Award className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50 text-[#B71C1C]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                {notifications.filter((n) => !n.read).length} unread alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(notifications || []).length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-500">No notifications at this time.</p>
            </div>
          ) : (
            (notifications || []).map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onMarkAsRead(n.id);
                  if (n.actionUrl) {
                    onNavigate(n.actionUrl);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  !n.read
                    ? 'border-red-200 bg-red-50/30 hover:bg-red-50/60 shadow-2xs'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-gray-100 shadow-2xs shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-bold text-gray-900 leading-snug">{n.title}</p>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-[#B71C1C] shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">{n.date}</span>
                      {n.actionUrl && (
                        <span className="text-[11px] font-semibold text-[#B71C1C] hover:underline">
                          View details →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-3 bg-gray-50 text-center">
          <p className="text-[10px] text-gray-400">
            Kalaignar Karunanidhi Institute of Technology • Notification Dispatcher
          </p>
        </div>
      </div>
    </div>
  );
};
