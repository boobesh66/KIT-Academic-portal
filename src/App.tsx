import React, { useState, useEffect } from 'react';
import { User, Role, Course, Assignment, AssignmentSubmission, ExamMark, NotificationItem } from './types';
import { USERS, COURSES, ASSIGNMENTS, SUBMISSIONS, EXAMINATIONS, EXAM_MARKS, STUDENT_ATTENDANCE_SUMMARY, ATTENDANCE_RECORDS, NOTIFICATIONS, TIMETABLE_SLOTS } from './data/mockData';
import { api } from './services/api';

// Common Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { SearchModal } from './components/common/SearchModal';

// Public Components
import { LandingPage } from './components/public/LandingPage';
import { LoginPage } from './components/public/LoginPage';
import { CourseCatalog } from './components/public/CourseCatalog';
import { CourseDetailModal } from './components/public/CourseDetailModal';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentAssignments } from './components/student/StudentAssignments';
import { StudentExaminations } from './components/student/StudentExaminations';
import { StudentResults } from './components/student/StudentResults';
import { StudentProgress } from './components/student/StudentProgress';
import { StudentAIInsights } from './components/student/StudentAIInsights';
import { StudentTimetable } from './components/student/StudentTimetable';
import { StudentFeedback } from './components/student/StudentFeedback';
import { StudentHackathons } from './components/student/StudentHackathons';
import { PersonalizedAIStudentCoach } from './components/student/PersonalizedAIStudentCoach';
import { UserProfile } from './components/profile/UserProfile';
import { BlockedAccountModal } from './components/common/BlockedAccountModal';

// Faculty Components
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { FacultyAttendance } from './components/faculty/FacultyAttendance';
import { FacultyAssignments } from './components/faculty/FacultyAssignments';
import { FacultyMarks } from './components/faculty/FacultyMarks';
import { FacultyStudents } from './components/faculty/FacultyStudents';
import { FacultyAIInsights } from './components/faculty/FacultyAIInsights';
import { FacultyFeedbackReview } from './components/faculty/FacultyFeedbackReview';

// HOD Components
import { HodDashboard } from './components/hod/HodDashboard';
import { HodReports } from './components/hod/HodReports';
import { HodFeedbackAnalytics } from './components/hod/HodFeedbackAnalytics';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminDepartments } from './components/admin/AdminDepartments';
import { AdminSettings } from './components/admin/AdminSettings';
import { DEMO_AI_STUDENT_INSIGHT } from './data/mockData';

export default function App() {
  // Session & Auth State (Default to Student persona)
  const [currentUser, setCurrentUser] = useState<User | null>(USERS[0]);
  const [currentRole, setCurrentRole] = useState<Role>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isPublicView, setIsPublicView] = useState<boolean>(false);
  const [publicSubView, setPublicSubView] = useState<'landing' | 'login' | 'courses'>('landing');

  // UI Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  // App Data States
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(SUBMISSIONS);
  const [examMarks] = useState<ExamMark[]>(EXAM_MARKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);

  // Load initial dynamic data
  useEffect(() => {
    const loadData = async () => {
      try {
        const asgs = await api.getAssignments();
        if (asgs && asgs.length > 0) setAssignments(asgs);
        const subs = await api.getSubmissions();
        if (subs && subs.length > 0) setSubmissions(subs);
        const notifs = await api.getNotifications(currentRole, currentUser?.id);
        if (notifs && notifs.length > 0) setNotifications(notifs);
      } catch (err) {
        console.warn('Initial data load completed with local fallback', err);
      }
    };
    loadData();
  }, [currentRole, currentUser]);

  // Handle switching persona / role directly
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    const matchedUser = USERS.find((u) => u.role === role) || USERS[0];
    setCurrentUser(matchedUser);
    setActiveTab('dashboard');
    setIsPublicView(false);
  };

  // Handle Login from LoginPage
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveTab('dashboard');
    setIsPublicView(false);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsPublicView(true);
    setPublicSubView('landing');
  };

  // Handle Navigation from any component
  const handleNavigate = (view: string, detailId?: string) => {
    if (view === 'home' || view === 'landing') {
      setIsPublicView(true);
      setPublicSubView('landing');
      return;
    }
    if (view === 'login') {
      setIsPublicView(true);
      setPublicSubView('login');
      return;
    }
    if (view === 'courses') {
      if (detailId) {
        const found = COURSES.find((c) => c.id === detailId || c.code === detailId);
        if (found) setSelectedCourseDetail(found);
      }
      if (!currentUser) {
        setIsPublicView(true);
        setPublicSubView('courses');
      } else {
        setIsPublicView(false);
        setActiveTab('courses');
      }
      return;
    }

    // Authenticated view navigation
    if (!currentUser) {
      setCurrentUser(USERS[0]);
      setCurrentRole('student');
    }
    setIsPublicView(false);
    setActiveTab(view);
  };

  // Handle Assignment Submission by student
  const handleSubmitAssignment = async (payload: {
    assignmentId: string;
    submissionText: string;
    fileUrl?: string;
  }) => {
    if (!currentUser) return;
    try {
      const newSub = await api.submitAssignment({
        assignmentId: payload.assignmentId,
        studentId: currentUser.id,
        submissionText: payload.submissionText,
        fileUrl: payload.fileUrl || 'assignment_submission.pdf',
      });
      setSubmissions((prev) => {
        const filtered = prev.filter((s) => !(s.assignmentId === payload.assignmentId && s.studentId === currentUser.id));
        return [newSub, ...filtered];
      });
    } catch (e) {
      console.warn('Assignment submit error', e);
    }
  };

  // Notification handlers
  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await api.markNotificationAsRead('all');
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await api.markNotificationAsRead(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Render role-specific authenticated views
  const renderDashboardContent = () => {
    if (!currentUser) return null;

    // 1. STUDENT ROLE
    if (currentRole === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <StudentDashboard
              user={currentUser}
              attendanceSummary={STUDENT_ATTENDANCE_SUMMARY}
              assignments={assignments}
              examinations={EXAMINATIONS}
              examMarks={examMarks}
              onNavigate={handleNavigate}
            />
          );
        case 'ai-coach':
          return <PersonalizedAIStudentCoach user={currentUser} insight={DEMO_AI_STUDENT_INSIGHT} />;
        case 'feedback':
          return <StudentFeedback user={currentUser} courses={COURSES} />;
        case 'attendance':
          return (
            <StudentAttendance
              summary={STUDENT_ATTENDANCE_SUMMARY}
              records={ATTENDANCE_RECORDS}
            />
          );
        case 'courses':
          return <CourseCatalog onNavigateToLogin={() => handleNavigate('login')} />;
        case 'timetable':
          return <StudentTimetable slots={TIMETABLE_SLOTS} />;
        case 'assignments':
          return (
            <StudentAssignments
              assignments={assignments}
              submissions={submissions}
              onSubmitAssignment={handleSubmitAssignment}
            />
          );
        case 'examinations':
          return <StudentExaminations examinations={EXAMINATIONS} user={currentUser} />;
        case 'results':
          return <StudentResults marks={examMarks} user={currentUser} />;
        case 'progress':
          return <StudentProgress />;
        case 'hackathons':
          return currentUser ? <StudentHackathons user={currentUser} /> : null;
        case 'ai-insights':
          return <StudentAIInsights user={currentUser} />;
        case 'profile':
          return <UserProfile user={currentUser} onUpdateUser={(u) => setCurrentUser(u)} />;
        default:
          return (
            <StudentDashboard
              user={currentUser}
              attendanceSummary={STUDENT_ATTENDANCE_SUMMARY}
              assignments={assignments}
              examinations={EXAMINATIONS}
              examMarks={examMarks}
              onNavigate={handleNavigate}
            />
          );
      }
    }

    // 2. FACULTY ROLE
    if (currentRole === 'faculty') {
      switch (activeTab) {
        case 'dashboard':
          return <FacultyDashboard user={currentUser} onNavigate={handleNavigate} />;
        case 'feedback-review':
          return <FacultyFeedbackReview facultyUser={currentUser} courses={COURSES} />;
        case 'attendance':
          return <FacultyAttendance />;
        case 'assignments':
          return <FacultyAssignments />;
        case 'marks':
          return <FacultyMarks />;
        case 'subjects':
          return <CourseCatalog onNavigateToLogin={() => handleNavigate('login')} />;
        case 'students':
          return <FacultyStudents />;
        case 'analytics':
          return <FacultyDashboard user={currentUser} onNavigate={handleNavigate} />;
        case 'ai-insights':
          return <FacultyAIInsights />;
        case 'profile':
          return <UserProfile user={currentUser} onUpdateUser={(u) => setCurrentUser(u)} />;
        default:
          return <FacultyDashboard user={currentUser} onNavigate={handleNavigate} />;
      }
    }

    // 3. HOD ROLE
    if (currentRole === 'hod') {
      switch (activeTab) {
        case 'dashboard':
          return <HodDashboard user={currentUser} onNavigate={handleNavigate} />;
        case 'feedback-audit':
          return <HodFeedbackAnalytics />;
        case 'students':
          return <FacultyStudents />;
        case 'faculty':
          return <AdminDepartments />;
        case 'subjects':
          return <CourseCatalog onNavigateToLogin={() => handleNavigate('login')} />;
        case 'attendance':
          return (
            <StudentAttendance
              summary={STUDENT_ATTENDANCE_SUMMARY}
              records={ATTENDANCE_RECORDS}
            />
          );
        case 'analytics':
          return <HodDashboard user={currentUser} onNavigate={handleNavigate} />;
        case 'ai-insights':
          return <FacultyAIInsights />;
        case 'reports':
          return <HodReports />;
        case 'profile':
          return <UserProfile user={currentUser} onUpdateUser={(u) => setCurrentUser(u)} />;
        default:
          return <HodDashboard user={currentUser} onNavigate={handleNavigate} />;
      }
    }

    // 4. ADMIN ROLE
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard user={currentUser} onNavigate={handleNavigate} />;
        case 'students':
          return <FacultyStudents />;
        case 'faculty':
          return <AdminDepartments />;
        case 'departments':
          return <AdminDepartments />;
        case 'courses':
          return <CourseCatalog onNavigateToLogin={() => handleNavigate('login')} />;
        case 'reports':
          return <HodReports />;
        case 'settings':
          return <AdminSettings />;
        case 'profile':
          return <UserProfile user={currentUser} onUpdateUser={(u) => setCurrentUser(u)} />;
        default:
          return <AdminDashboard user={currentUser} onNavigate={handleNavigate} />;
      }
    }

    return null;
  };

  return (
    <div id="kit-portal-root" className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 antialiased selection:bg-red-100 selection:text-[#B71C1C]">
      {/* 1. Global Header Navigation */}
      <Header
        currentUser={isPublicView ? null : currentUser}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onLogout={handleLogout}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        unreadNotificationsCount={unreadCount}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={handleNavigate}
      />

      {/* 2. Main Portal Layout */}
      {isPublicView ? (
        <main className="flex-1 w-full">
          {publicSubView === 'landing' && (
            <LandingPage
              onNavigateToLogin={(role) => {
                if (role) setCurrentRole(role);
                setPublicSubView('login');
              }}
              onNavigateToCourses={() => setPublicSubView('courses')}
            />
          )}
          {publicSubView === 'login' && (
            <LoginPage
              onLogin={handleLogin}
              onNavigateHome={() => setPublicSubView('landing')}
            />
          )}
          {publicSubView === 'courses' && (
            <div className="py-6">
              <CourseCatalog onNavigateToLogin={() => setPublicSubView('login')} />
            </div>
          )}
        </main>
      ) : (
        <div className="flex-1 flex flex-row w-full max-w-7xl mx-auto">
          {/* Collapsible / Responsive Role Sidebar */}
          <Sidebar
            currentRole={currentRole}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setIsSidebarOpen(false);
            }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Dashboard Canvas */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            {renderDashboardContent()}
          </main>
        </div>
      )}

      {/* 3. Global Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onMarkAsRead={handleMarkNotificationRead}
        onNavigate={handleNavigate}
      />

      {/* 4. Global Quick Search Modal (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 5. Course Detail Modal */}
      {selectedCourseDetail && (
        <CourseDetailModal
          course={selectedCourseDetail}
          isOpen={Boolean(selectedCourseDetail)}
          onClose={() => setSelectedCourseDetail(null)}
          onEnroll={() => {
            alert(`Enrolled in ${selectedCourseDetail.name} (${selectedCourseDetail.code})`);
            setSelectedCourseDetail(null);
          }}
        />
      )}

      {/* 6. Institutional Cybersecurity Account Blocked Lockout Modal */}
      {currentUser?.isBlocked && (
        <BlockedAccountModal
          user={currentUser}
          onUnblock={(unblockedUser) => {
            setCurrentUser(unblockedUser);
            // Update in mock USERS list
            const idx = USERS.findIndex((u) => u.id === unblockedUser.id);
            if (idx >= 0) USERS[idx] = unblockedUser;
          }}
          onSwitchUser={() => {
            // Allow switching to an admin or faculty role to review
            handleRoleChange('admin');
          }}
        />
      )}
    </div>
  );
}

