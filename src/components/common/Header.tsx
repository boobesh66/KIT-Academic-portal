import React, { useState } from 'react';
import {
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  GraduationCap,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { User, Role } from '../../types';
import { USERS } from '../../data/mockData';

interface HeaderProps {
  currentUser: User | null;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  unreadNotificationsCount: number;
  onToggleSidebar: () => void;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  onLogout,
  onOpenNotifications,
  onOpenSearch,
  unreadNotificationsCount,
  onToggleSidebar,
  onNavigate,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roleLabels: Record<Role, { title: string; badge: string; color: string }> = {
    student: { title: 'Student Portal', badge: 'Student', color: 'bg-red-100 text-[#B71C1C]' },
    faculty: { title: 'Faculty Portal', badge: 'Faculty', color: 'bg-blue-100 text-blue-800' },
    hod: { title: 'HOD Portal', badge: 'HOD', color: 'bg-purple-100 text-purple-800' },
    admin: { title: 'Admin ERP', badge: 'Administrator', color: 'bg-emerald-100 text-emerald-800' },
  };

  return (
    <header id="kit-main-header" className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6 shadow-xs">
      {/* Left side: Mobile Menu + KIT Branding */}
      <div className="flex items-center gap-3 lg:gap-4">
        {currentUser && (
          <button
            id="btn-toggle-mobile-sidebar"
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div
          onClick={() => onNavigate(currentUser ? 'dashboard' : 'home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#B71C1C] text-white shadow-xs group-hover:bg-[#D32F2F] transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#B71C1C]">KIT</span>
              <span className="hidden sm:inline-block text-xs font-semibold px-1.5 py-0.5 rounded bg-red-50 text-[#B71C1C] border border-red-200">
                COIMBATORE
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-tight text-gray-500 hidden md:block">
              Kalaignar Karunanidhi Institute of Technology • Academic ERP & AI
            </p>
          </div>
        </div>

        {currentUser && (
          <span className={`hidden sm:inline-flex items-center gap-1 ml-2 text-xs font-bold px-2.5 py-1 rounded-full ${roleLabels[currentRole].color}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {roleLabels[currentRole].badge}
          </span>
        )}
      </div>

      {/* Center / Search bar trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          id="btn-global-search"
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50/80 px-3.5 py-1.5 text-xs text-gray-500 hover:border-red-300 hover:bg-white hover:text-gray-700 transition-all shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            Search students, subjects, exams, timetables...
          </span>
          <kbd className="hidden lg:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 border border-gray-200">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        <button
          id="btn-mobile-search"
          onClick={onOpenSearch}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {currentUser ? (
          <>
            {/* Quick Role Switcher for instant reviewing */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/60 px-2.5 py-1.5 text-xs font-semibold text-[#B71C1C] hover:bg-red-100 transition-colors"
                title="Switch Demo Role"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Role:</span>
                <span className="capitalize">{currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Switch Active Role
                  </div>
                  {(['student', 'faculty', 'hod', 'admin'] as Role[]).map((r) => (
                    <button
                      key={r}
                      id={`btn-switch-role-${r}`}
                      onClick={() => {
                        onRoleChange(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        currentRole === r
                          ? 'bg-[#B71C1C] text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="capitalize">{r} Portal</span>
                      {currentRole === r && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              id="btn-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B71C1C] text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                id="btn-profile-menu"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 p-1.5 pr-2.5 hover:bg-gray-50 transition-colors"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-7 w-7 rounded-md object-cover border border-red-200"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#B71C1C] text-xs font-bold text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="hidden text-left lg:block">
                  <p className="text-xs font-semibold text-gray-900 leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-gray-500 leading-tight truncate max-w-[120px]">
                    {currentUser.registerNumber || currentUser.designation || currentUser.role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
                  <div className="border-b border-gray-100 px-3 py-2.5">
                    <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-50 text-[#B71C1C] border border-red-200">
                        {currentUser.departmentName}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      id="btn-menu-profile"
                      onClick={() => {
                        onNavigate('profile');
                        setShowProfileMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      View Academic Profile
                    </button>
                    <button
                      id="btn-menu-ai-insights"
                      onClick={() => {
                        onNavigate('ai-insights');
                        setShowProfileMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      <Sparkles className="w-4 h-4 text-[#B71C1C]" />
                      AI Academic Intelligence
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      id="btn-menu-logout"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              id="btn-nav-courses"
              onClick={() => onNavigate('courses')}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              Courses
            </button>
            <button
              id="btn-nav-login"
              onClick={() => onNavigate('login')}
              className="rounded-lg bg-[#B71C1C] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-all"
            >
              Login to Portal
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
