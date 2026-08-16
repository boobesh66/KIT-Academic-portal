import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  Award,
  TrendingUp,
  Sparkles,
  Users,
  BarChart3,
  GraduationCap,
  Building2,
  Settings,
  X,
  FileCheck2,
  FileSpreadsheet,
  HelpCircle,
  Clock,
  MessageSquareHeart,
  BrainCircuit,
  Camera,
  Trophy
} from 'lucide-react';
import { Role } from '../../types';

interface SidebarProps {
  currentRole: Role;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  isAi?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'ai-coach', label: 'AI Study Coach & Docs', icon: BrainCircuit, isAi: true, badge: 'New AI' },
          { id: 'feedback', label: 'Teacher Feedback', icon: MessageSquareHeart, badge: 'Active' },
          { id: 'attendance', label: 'Attendance', icon: UserCheck, badge: '87%' },
          { id: 'courses', label: 'Courses & Syllabus', icon: BookOpen },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'assignments', label: 'Assignments', icon: ClipboardCheck, badge: '2 Due' },
          { id: 'examinations', label: 'Examinations', icon: Clock },
          { id: 'results', label: 'Results & SGPA', icon: Award },
          { id: 'progress', label: 'Academic Progress', icon: TrendingUp },
          { id: 'hackathons', label: 'Hackathons & Certificates', icon: Trophy, badge: 'Winner' },
          { id: 'ai-insights', label: 'AI Academic Intelligence', icon: Sparkles, isAi: true },
          { id: 'profile', label: 'My Profile & Photo', icon: GraduationCap },
        ];
      case 'faculty':
        return [
          { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'feedback-review', label: 'Student Feedback & AI', icon: MessageSquareHeart, isAi: true, badge: 'AI Review' },
          { id: 'attendance', label: 'Mark Attendance', icon: UserCheck },
          { id: 'assignments', label: 'Manage Assignments', icon: ClipboardCheck, badge: '4 New' },
          { id: 'marks', label: 'Examinations & Marks', icon: FileSpreadsheet },
          { id: 'subjects', label: 'My Subjects & Classes', icon: BookOpen },
          { id: 'students', label: 'Student Roster', icon: Users },
          { id: 'analytics', label: 'Class Analytics', icon: BarChart3 },
          { id: 'ai-insights', label: 'AI Teaching Insights', icon: Sparkles, isAi: true },
          { id: 'profile', label: 'Faculty Profile & Photo', icon: GraduationCap },
        ];
      case 'hod':
        return [
          { id: 'dashboard', label: 'Department Dashboard', icon: LayoutDashboard },
          { id: 'feedback-audit', label: 'Faculty Feedback Audit', icon: MessageSquareHeart, isAi: true, badge: 'BoS' },
          { id: 'students', label: 'Department Students', icon: Users, badge: '240' },
          { id: 'faculty', label: 'Faculty Directory', icon: GraduationCap, badge: '16' },
          { id: 'subjects', label: 'Curriculum & Subjects', icon: BookOpen },
          { id: 'attendance', label: 'Attendance Audits', icon: UserCheck },
          { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
          { id: 'ai-insights', label: 'Department AI Insights', icon: Sparkles, isAi: true, badge: '14 At-Risk' },
          { id: 'reports', label: 'Academic Reports', icon: FileCheck2 },
          { id: 'profile', label: 'HOD Profile & Photo', icon: GraduationCap },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'College Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Management', icon: Users },
          { id: 'faculty', label: 'Faculty Management', icon: GraduationCap },
          { id: 'departments', label: 'Departments (6)', icon: Building2 },
          { id: 'courses', label: 'Course Catalog', icon: BookOpen },
          { id: 'reports', label: 'Institutional Reports', icon: FileCheck2 },
          { id: 'settings', label: 'System Settings', icon: Settings },
          { id: 'profile', label: 'Admin Profile & Photo', icon: GraduationCap },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="kit-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Department / Role Banner */}
        <div className="border-b border-gray-100 bg-gray-50/70 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
              {currentRole === 'student'
                ? 'Dept: AI & Data Science'
                : currentRole === 'faculty'
                ? 'Faculty Portal (AI&DS)'
                : currentRole === 'hod'
                ? 'Head of Department'
                : 'KIT Central ERP'}
            </p>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-[#B71C1C]">
            {currentRole === 'student'
              ? 'Semester V • Section A'
              : currentRole === 'faculty'
              ? 'Associate Professor'
              : currentRole === 'hod'
              ? 'AI & Data Science Dept'
              : 'Academic Administration'}
          </p>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#B71C1C] text-white shadow-xs'
                    : item.isAi
                    ? 'text-red-700 bg-red-50/70 hover:bg-red-100/70'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : item.isAi
                        ? 'text-[#B71C1C]'
                        : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.isAi
                        ? 'bg-[#B71C1C] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Institutional Accreditation Footer */}
        <div className="border-t border-gray-100 p-3 bg-gray-50/50">
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-2.5 text-center">
            <p className="text-[11px] font-bold text-[#B71C1C]">KIT Coimbatore</p>
            <p className="text-[9px] text-gray-500 mt-0.5">
              Autonomous • NAAC &apos;A+&apos; Grade • NBA Accredited • Anna Univ.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
