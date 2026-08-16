import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Building2,
  Award,
  BookOpen,
  UserCheck,
  MapPin,
  ShieldCheck,
  FileText,
  Camera,
  Upload,
  CheckCircle2,
  Briefcase,
  Layers,
  Sparkles,
  Edit3,
  Save,
  X,
  RefreshCw,
  FolderOpen,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Globe,
  Github,
  Linkedin,
  HeartPulse,
  Truck,
  Users,
  Clock,
  Check,
  Zap,
  Cpu,
  KeyRound,
  Fingerprint,
  Activity,
  History
} from 'lucide-react';
import { User, Role } from '../../types';
import { api } from '../../services/api';
import { PasswordUpdateModal } from './PasswordUpdateModal';
import { UserActivityLogView } from './UserActivityLogView';
import { BiometricHandshakeModal } from './BiometricHandshakeModal';
import { StudentCertificatesSection } from '../student/StudentCertificatesSection';

interface UserProfileProps {
  user: User;
  onUpdateUser?: (updatedUser: User) => void;
}

// Preset photo options for quick testing
const PRESET_AVATARS = [
  {
    label: 'Student (Male)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    type: 'safe',
  },
  {
    label: 'Student (Female)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    type: 'safe',
  },
  {
    label: 'Faculty / Professor (Male)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    type: 'safe',
  },
  {
    label: 'Faculty / Professor (Female)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    type: 'safe',
  },
];

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'certificates' | 'activity'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [biometricModalOpen, setBiometricModalOpen] = useState(false);
  const [biometricModalMode, setBiometricModalMode] = useState<'enroll' | 'test' | 'revoke'>('enroll');
  const [copiedKey, setCopiedKey] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanStatusNote, setScanStatusNote] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isStudent = user.role === 'student';
  const isFaculty = user.role === 'faculty';
  const isHOD = user.role === 'hod';
  const isAdmin = user.role === 'admin';

  const handlePasswordSuccess = (updatedUser: User, message: string) => {
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    setSaveSuccessMessage(message);
    setTimeout(() => setSaveSuccessMessage(null), 5000);
  };

  const handleBiometricSuccess = (updatedUser: User) => {
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    const msg = updatedUser.biometricEnabled
      ? 'Secure Biometric WebAuthn login enabled and bound to this hardware authenticator.'
      : 'Biometric WebAuthn login protection disabled.';
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 5000);
  };

  // Comprehensive Editable Form State
  const [formData, setFormData] = useState({
    // Basic & Contact
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '+91 98421 88402',
    dob: user.dob || (isStudent ? '14 August 2004' : '22 June 1982'),
    bloodGroup: user.bloodGroup || 'O+ Positive',
    emergencyContact: user.emergencyContact || '+91 94432 10984',
    address: user.address || 'Peelamedu, Coimbatore - 641004, Tamil Nadu',
    bio: user.bio || (isStudent ? 'Passionate about Deep Learning, Autonomous Systems, and Full-Stack Engineering.' : 'Dedicated academician with focus on scalable database architectures, AI pedagogy, and student research mentorship.'),
    
    // Student Logistics & Academics
    registerNumber: user.registerNumber || '711522205023',
    semester: user.semester || 5,
    section: user.section || 'A',
    mentorName: user.mentorName || 'Dr. S. Ramanathan (Associate Professor)',
    parentName: user.parentName || 'M. Karthikeyan',
    parentPhone: user.parentPhone || '+91 94432 10984',
    transportMode: user.transportMode || 'Day Scholar (College Bus Route #12)',
    skills: user.skills ? user.skills.join(', ') : 'Python, PyTorch, React, PostgreSQL, Distributed Systems',
    linkedIn: user.linkedIn || 'https://linkedin.com/in/muthukrishnan-kit',
    github: user.github || 'https://github.com/muthukrishnan-kit',

    // Faculty & Staff specific
    designation: user.designation || (isHOD ? 'Professor & Head of Department' : isAdmin ? 'Dean of Academic Affairs' : 'Associate Professor'),
    departmentName: user.departmentName || 'Artificial Intelligence and Data Science',
    qualification: user.qualification || 'Ph.D. in Computer Science & Engineering, M.E., B.E.',
    experienceYears: user.experienceYears || 12,
    specialization: user.specialization || 'Database Systems, Knowledge Graphs & Machine Learning',
    cabinRoom: user.cabinRoom || 'Tech Block III - Cabin #204',
    officeHours: user.officeHours || 'Mon & Wed (03:30 PM - 05:00 PM)',
    publicationsCount: user.publicationsCount || 18,
    patentsCount: user.patentsCount || 3,
  });

  // Handle Photo Selection via File Reader
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Photo file size exceeds the 10MB limit.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Select a preset avatar
  const handleSelectPreset = (url: string) => {
    setPreviewPhoto(url);
  };

  // Run AI Security Scan & Save Safe Photo
  const handleAuditAndSavePhoto = async () => {
    if (!previewPhoto) return;
    setIsScanningPhoto(true);
    setScanStatusNote('Initiating Gemini Vision AI Security & Policy Audit...');

    try {
      // Send image to backend security scanner
      const scanRes = await api.scanImageSafety({
        userId: user.id,
        base64Image: previewPhoto,
        fileName: 'profile_avatar_upload.png',
      });

      if (scanRes.blocked || scanRes.isVulnerable || !scanRes.isSafe) {
        // VULNERABILITY DETECTED - Account Blocked!
        const blockedUser = scanRes.user || {
          ...user,
          isBlocked: true,
          blockedReason: scanRes.reason || 'Malicious payload / Security vulnerability detected in uploaded photo.',
          blockedAt: new Date().toISOString(),
          securityThreatDetails: scanRes.threatDetails,
        };

        if (onUpdateUser) {
          onUpdateUser(blockedUser);
        }
        setPhotoModalOpen(false);
        setPreviewPhoto(null);
        return;
      }

      // Safe image verified & applied
      const updatedUser: User = scanRes.user || { ...user, avatar: previewPhoto };
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }

      setSaveSuccessMessage('Profile photo verified safe by Gemini AI and saved successfully!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
      setPhotoModalOpen(false);
      setPreviewPhoto(null);
    } catch (err: any) {
      console.error('Failed to audit and update photo:', err);
      setErrorMessage('Verification failed: ' + (err.message || 'Network error'));
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsScanningPhoto(false);
      setScanStatusNote(null);
    }
  };

  // Simulate Vulnerability Detection & Instant Account Suspension (for demonstration)
  const handleSimulateVulnerableUpload = async (threatType: string) => {
    setIsScanningPhoto(true);
    setScanStatusNote('Simulating deep vulnerability & malicious exploit payload injection...');

    try {
      const scanRes = await api.scanImageSafety({
        userId: user.id,
        base64Image: previewPhoto || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        fileName: 'malicious_exploit_payload.exe.png',
        simulateThreatType: threatType,
      });

      if (scanRes.blocked || scanRes.isVulnerable) {
        const blockedUser = scanRes.user || {
          ...user,
          isBlocked: true,
          blockedReason: scanRes.reason || 'Malicious File Payload & Vulnerability Injection Detected',
          blockedAt: new Date().toISOString(),
          securityThreatDetails: scanRes.threatDetails,
        };

        if (onUpdateUser) {
          onUpdateUser(blockedUser);
        }
        setPhotoModalOpen(false);
        setPreviewPhoto(null);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsScanningPhoto(false);
      setScanStatusNote(null);
    }
  };

  // Save All Comprehensive Details
  const handleSaveAllDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDetails(true);
    setErrorMessage(null);

    const skillsArray = formData.skills
      ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    const updates: Partial<User> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dob: formData.dob.trim(),
      bloodGroup: formData.bloodGroup.trim(),
      emergencyContact: formData.emergencyContact.trim(),
      address: formData.address.trim(),
      bio: formData.bio.trim(),
      linkedIn: formData.linkedIn.trim(),
      github: formData.github.trim(),
      skills: skillsArray,
    };

    if (isStudent) {
      updates.registerNumber = formData.registerNumber.trim();
      updates.semester = Number(formData.semester);
      updates.section = formData.section.trim();
      updates.mentorName = formData.mentorName.trim();
      updates.parentName = formData.parentName.trim();
      updates.parentPhone = formData.parentPhone.trim();
      updates.transportMode = formData.transportMode.trim();
    } else {
      updates.designation = formData.designation.trim();
      updates.departmentName = formData.departmentName.trim();
      updates.qualification = formData.qualification.trim();
      updates.experienceYears = Number(formData.experienceYears);
      updates.specialization = formData.specialization.trim();
      updates.cabinRoom = formData.cabinRoom.trim();
      updates.officeHours = formData.officeHours.trim();
      updates.publicationsCount = Number(formData.publicationsCount);
      updates.patentsCount = Number(formData.patentsCount);
    }

    try {
      const res = await api.updateUserProfile(user.id, updates);
      if (res.isBlocked) {
        setErrorMessage('Account is suspended: ' + (res.error || 'Cannot update details.'));
        return;
      }

      if (res.success && res.user) {
        if (onUpdateUser) {
          onUpdateUser(res.user);
        }
        setIsEditing(false);
        setSaveSuccessMessage('All profile records updated and synchronized across institutional nodes!');
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      } else {
        // Fallback update
        const updatedUser: User = { ...user, ...updates };
        if (onUpdateUser) {
          onUpdateUser(updatedUser);
        }
        setIsEditing(false);
        setSaveSuccessMessage('Profile details saved locally!');
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      setErrorMessage('Failed to save changes: ' + err.message);
    } finally {
      setIsSavingDetails(false);
    }
  };

  const removeAvatar = async () => {
    try {
      const res = await api.updateUserProfile(user.id, { avatar: '' });
      const updatedUser: User = res.user || { ...user, avatar: undefined };
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      setPhotoModalOpen(false);
      setPreviewPhoto(null);
      setSaveSuccessMessage('Profile photo removed.');
      setTimeout(() => setSaveSuccessMessage(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="user-profile-view" className="space-y-6">
      {saveSuccessMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 animate-in fade-in shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Banner & Profile Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/40 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar and Basic Credentials */}
          <div className="flex items-center gap-5">
            {/* Photo Avatar with upload trigger */}
            <div className="relative group shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-2xl object-cover border-2 border-red-200 shadow-md"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B71C1C] to-[#D32F2F] text-4xl font-black text-white shadow-md">
                  {user.name.charAt(0)}
                </div>
              )}

              {/* Upload trigger button overlay */}
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                title="Change or Upload Profile Photo (With AI Safety Audit)"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#B71C1C] text-white shadow-lg hover:bg-[#8E0000] transition-all hover:scale-105 border-2 border-white"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isStudent
                      ? 'bg-emerald-100 text-emerald-800'
                      : isFaculty
                      ? 'bg-blue-100 text-blue-800'
                      : isHOD
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isStudent ? 'Active Student' : user.designation || 'Faculty Member'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#B71C1C] border border-red-200">
                  <ShieldCheck className="w-3 h-3 text-[#B71C1C]" />
                  Verified Identity
                </span>
              </div>

              {/* Subtitles */}
              {isStudent ? (
                <>
                  <p className="text-xs font-semibold text-[#B71C1C] mt-1 font-mono">
                    Reg No: {user.registerNumber || '711522205023'} • {user.departmentName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Semester {user.semester || 5} (Section {user.section || 'A'}) • Advisor: {user.mentorName || 'Dr. S. Ramanathan'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-[#B71C1C] mt-1 font-mono">
                    Employee Code: {user.employeeCode || `FAC-KIT-2022-${user.id.slice(-3)}`} • {user.departmentName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user.qualification || 'Ph.D. in Computer Science & Engineering'} • {user.cabinRoom || 'Tech Block III - Cabin #204'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right Highlights */}
          <div className="flex items-center gap-3">
            {isStudent ? (
              <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-center min-w-[140px]">
                <p className="text-[10px] font-bold text-[#B71C1C] uppercase">Standing CGPA</p>
                <p className="text-3xl font-black text-[#B71C1C]">{user.cgpa?.toFixed(2) || '7.85'}</p>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Autonomous Standing</p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-center min-w-[120px]">
                  <p className="text-[10px] font-bold text-blue-700 uppercase">Experience</p>
                  <p className="text-2xl font-black text-blue-900">{user.experienceYears || 12}+ Yrs</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Teaching & Research</p>
                </div>
                <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 text-center min-w-[120px]">
                  <p className="text-[10px] font-bold text-purple-700 uppercase">Publications</p>
                  <p className="text-2xl font-black text-purple-900">{user.publicationsCount || 18}</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Indexed Scopus/WoS</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs hover:border-[#B71C1C] hover:text-[#B71C1C] transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#B71C1C]" />
              <span>Update Password</span>
            </button>

            <button
              onClick={() => {
                setActiveProfileTab('profile');
                setIsEditing(!isEditing);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                isEditing && activeProfileTab === 'profile'
                  ? 'bg-red-50 border-red-200 text-[#B71C1C]'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing && activeProfileTab === 'profile' ? 'Close Editor' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveProfileTab('profile');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeProfileTab === 'profile'
                ? 'bg-[#B71C1C] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Profile Dossier & Academics</span>
          </button>

          <button
            type="button"
            id="tab-btn-profile-certificates"
            onClick={() => {
              setActiveProfileTab('certificates');
              setIsEditing(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeProfileTab === 'certificates'
                ? 'bg-[#B71C1C] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Certificates & Credentials</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeProfileTab === 'certificates'
                  ? 'bg-white/20 text-white'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              Supabase Storage
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveProfileTab('activity');
              setIsEditing(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeProfileTab === 'activity'
                ? 'bg-[#B71C1C] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activity Log</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeProfileTab === 'activity'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Live Security
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-mono text-[11px] bg-gray-100 px-2 py-1 rounded-lg text-gray-600 border border-gray-200">
            Current Role: <strong className="text-gray-900 uppercase">{user.role}</strong>
          </span>
        </div>
      </div>

      {/* Tab View 1: Profile Dossier */}
      {activeProfileTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Comprehensive Edit Form */}
          {isEditing && (
            <form
              onSubmit={handleSaveAllDetails}
              className="rounded-2xl border border-red-200 bg-white p-6 shadow-md space-y-6 animate-in slide-in-from-top-2"
            >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#B71C1C]" />
                Institutional Master Profile Editor ({user.role.toUpperCase()})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Update legal identity, academic affiliations, contact addresses, and research dossier parameters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Security & Password Gateway Callout in Form */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-amber-800 shadow-2xs border border-amber-200">
                <Fingerprint className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Institutional Security & Re-Authentication Gate
                </h4>
                <p className="text-[11px] text-gray-600">
                  Password credentials require separate cryptographic identity re-authentication before updating.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-[#B71C1C] bg-white border border-red-200 hover:bg-red-50 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password (Re-Auth)</span>
            </button>
          </div>

          {/* Section 1: Legal Identity & Primary Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#B71C1C] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              1. Personal Identity & Primary Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name as per records"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Contact Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  placeholder="e.g. 14 August 2004"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Blood Group</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  placeholder="e.g. O+ Positive, B+"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="e.g. +91 94432 10984"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">Permanent Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Door No, Street, City, State, Pincode"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role-Specific Academic Information */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="text-xs font-black text-[#B71C1C] uppercase tracking-wider flex items-center gap-1.5">
              {isStudent ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
              2. {isStudent ? 'Academic Standing & Parent/Guardian Details' : 'Faculty Designation & Research Credentials'}
            </h3>

            {isStudent ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">University Register Number</label>
                  <input
                    type="text"
                    value={formData.registerNumber}
                    onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Current Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Faculty Mentor</label>
                  <input
                    type="text"
                    value={formData.mentorName}
                    onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Parent / Guardian Full Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Parent Contact Mobile</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hostel / Day Scholar Transport Details</label>
                  <input
                    type="text"
                    value={formData.transportMode}
                    onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
                    placeholder="e.g. Day Scholar (College Bus Route #12 - Peelamedu) or Kaveri Hostel Room #312"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Academic Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Academic Department</label>
                  <input
                    type="text"
                    value={formData.departmentName}
                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Highest Qualification / Degrees</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. Ph.D. (Anna University), M.E., B.E."
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Teaching & Research Experience (Yrs)</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cabin / Office Room Number</label>
                  <input
                    type="text"
                    value={formData.cabinRoom}
                    onChange={(e) => setFormData({ ...formData, cabinRoom: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Student Consultation Hours</label>
                  <input
                    type="text"
                    value={formData.officeHours}
                    onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                    placeholder="e.g. Mon & Wed (03:30 PM - 05:00 PM)"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Scopus/WoS Publications Count</label>
                  <input
                    type="number"
                    value={formData.publicationsCount}
                    onChange={(e) => setFormData({ ...formData, publicationsCount: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Patents / Copyrights Granted</label>
                  <input
                    type="number"
                    value={formData.patentsCount}
                    onChange={(e) => setFormData({ ...formData, patentsCount: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Research Specialization & Core Domains</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Distributed Database Systems, Graph Analytics, Deep Learning Architectures"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Professional Links, Skills & Bio */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="text-xs font-black text-[#B71C1C] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              3. Professional Handles, Skills & Biography
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Key Technical Skills & Competencies (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. PyTorch, Kubernetes, React, Database Normalization, Computer Vision"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Professional Bio / Academic Statement</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summary of research interests, pedagogical vision, or academic trajectory..."
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSavingDetails}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#8E0000] rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isSavingDetails ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Main Profile Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Academic / Faculty Dossier */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isStudent ? <GraduationCap className="w-4 h-4 text-[#B71C1C]" /> : <Briefcase className="w-4 h-4 text-[#B71C1C]" />}
              {isStudent ? 'Academic & Institutional Record' : 'Faculty & Institutional Dossier'}
            </span>
            <span className="text-[10px] font-mono text-gray-400">KIT ERP v4.2</span>
          </h2>

          <div className="space-y-3 text-xs">
            {isStudent ? (
              <>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Degree & Branch</span>
                  <strong className="text-gray-900">B.Tech - {user.departmentName}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">University Register No.</span>
                  <strong className="text-gray-900 font-mono">{user.registerNumber || '711522205023'}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Batch / Academic Cycle</span>
                  <strong className="text-gray-900">2022 - 2026 (Autonomous)</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Current Semester & Section</span>
                  <strong className="text-gray-900">Semester {user.semester || 5} • Section {user.section || 'A'}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Faculty Mentor / Advisor</span>
                  <strong className="text-[#B71C1C]">{user.mentorName || 'Dr. S. Ramanathan, Asso. Prof'}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Hostel / Transport Status</span>
                  <strong className="text-gray-900">{user.transportMode || 'Day Scholar (College Bus Route #12)'}</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Total Earned Credits</span>
                  <strong className="text-emerald-700 font-bold">96 / 165 Credits (On-Track)</strong>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Designation & Role</span>
                  <strong className="text-gray-900">{user.designation || 'Associate Professor'}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Academic Department</span>
                  <strong className="text-gray-900">{user.departmentName}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Highest Academic Degree</span>
                  <strong className="text-gray-900">{user.qualification || 'Ph.D. in Computer Science (Anna University)'}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Specialization & Research Focus</span>
                  <strong className="text-gray-900">{user.specialization || 'Database Systems, Knowledge Discovery & ML'}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Joining Year at KIT</span>
                  <strong className="text-gray-900">{user.joinYear || 2018} ({2026 - (user.joinYear || 2018)} Years at KIT)</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Scopus/WoS Publications</span>
                  <strong className="text-purple-700 font-bold">{user.publicationsCount || 18} Published Papers</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Patents / IPR Filed</span>
                  <strong className="text-indigo-700 font-bold">{user.patentsCount || 3} Granted / Published</strong>
                </div>
              </>
            )}
          </div>

          {/* Technical Skills & Specializations Tag Cloud */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              {isStudent ? 'Core Technical Skills & Tools' : 'Domain Specializations & Methodologies'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(user.skills && user.skills.length > 0
                ? user.skills
                : isStudent
                ? ['Python', 'PyTorch', 'React', 'PostgreSQL', 'DBMS', 'Machine Learning']
                : ['Query Optimization', 'Knowledge Graphs', 'Distributed Storage', 'Cloud Architecture', 'Anna Univ BoS']
              ).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[11px] font-semibold hover:bg-gray-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Personal Details */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#B71C1C]" />
              {isStudent ? 'Personal, Contact & Logistics' : 'Institutional Office & Contact Details'}
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
              Identity Active
            </span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Institutional Email</span>
              <strong className="text-gray-900 font-mono">{user.email}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Direct Mobile Phone</span>
              <strong className="text-gray-900">{user.phone || '+91 98421 88402'}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Date of Birth</span>
              <strong className="text-gray-900">{user.dob || (isStudent ? '14 August 2004' : '22 June 1982')}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Blood Group</span>
              <strong className="text-red-700 font-bold">{user.bloodGroup || 'O+ Positive'}</strong>
            </div>

            {isStudent ? (
              <>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Parent / Guardian</span>
                  <strong className="text-gray-900">
                    {user.parentName || 'M. Karthikeyan'} ({user.parentPhone || '+91 94432 10984'})
                  </strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Emergency Helpline</span>
                  <strong className="text-gray-900">{user.emergencyContact || '+91 94432 10984'}</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Residential Address</span>
                  <strong className="text-gray-900 text-right max-w-xs">
                    {user.address || 'Peelamedu, Coimbatore - 641004, Tamil Nadu'}
                  </strong>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Campus Office / Cabin</span>
                  <strong className="text-gray-900">{user.cabinRoom || 'Tech Block III - Cabin #204'}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Consultation & Office Hours</span>
                  <strong className="text-gray-900">{user.officeHours || 'Mon & Wed (03:30 PM - 05:00 PM)'}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Institutional Governance</span>
                  <strong className="text-[#B71C1C] font-bold">
                    {isHOD ? 'Department Head & BoS Chairman' : isAdmin ? 'Dean & Academic Council Member' : 'Course Coordinator & Mentor'}
                  </strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Permanent Address</span>
                  <strong className="text-gray-900 text-right max-w-xs">
                    {user.address || 'KIT Staff Quarters, Block B, Coimbatore'}
                  </strong>
                </div>
              </>
            )}
          </div>

          {/* Bio statement */}
          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
            <span className="font-bold text-gray-700 block mb-1">
              {isStudent ? 'Academic Statement & Focus:' : 'Faculty Professional Summary:'}
            </span>
            <p className="text-gray-600 leading-relaxed italic">
              "{user.bio || (isStudent ? 'Passionate about Deep Learning, Autonomous Systems, and Full-Stack Engineering.' : 'Dedicated to engineering excellence, research collaboration, and student mentorship.')}"
            </p>
          </div>
        </div>

        {/* Dedicated Account Security, Credentials & Re-Authentication Card */}
        <div className="lg:col-span-12 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-[#B71C1C]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>Account Security & Re-Authentication Gateway</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    SHA-256 Protected
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Institutional authentication governance, encrypted credential lifecycle, and security audit logs.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveProfileTab('activity')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors shadow-2xs"
              >
                <Activity className="w-3.5 h-3.5 text-[#B71C1C]" />
                <span>View Activity Logs</span>
              </button>

              <button
                type="button"
                onClick={() => setPasswordModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#8E0000] rounded-xl shadow-xs transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Change Password (Re-Auth)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Password Lifecycle & Status
              </span>
              <p className="font-bold text-gray-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Active Institutional Password
              </p>
              <p className="text-[11px] text-gray-500">
                {user.lastPasswordChangedAt
                  ? `Last updated: ${new Date(user.lastPasswordChangedAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : 'Credential status: Synchronized with ERP Portal'}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Re-Authentication Security Policy
              </span>
              <p className="font-bold text-gray-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B71C1C]" />
                Mandatory Verification Required
              </p>
              <p className="text-[11px] text-gray-500">
                Changing credentials strictly requires proof of current password before any updates are committed.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Session Encryption & Cryptography
              </span>
              <p className="font-bold text-gray-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                256-bit PBKDF2 Hashing
              </p>
              <p className="text-[11px] text-gray-500">
                Single Sign-On (SSO) active on Campus subnet. Zero plaintext storage.
              </p>
            </div>
          </div>

          {/* Secure Biometric Login (WebAuthn / FIDO2) Section */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/90 to-white">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    user.biometricEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      Secure Biometric Login (WebAuthn / FIDO2)
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.biometricEnabled
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {user.biometricEnabled ? 'Protection Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Hardware-bound biometric authentication using W3C Web Authentication API (Touch ID, Face ID, or Windows Hello).
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  id="biometric-login-toggle"
                  role="switch"
                  aria-checked={Boolean(user.biometricEnabled)}
                  onClick={() => {
                    if (user.biometricEnabled) {
                      setBiometricModalMode('revoke');
                    } else {
                      setBiometricModalMode('enroll');
                    }
                    setBiometricModalOpen(true);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#B71C1C] focus:ring-offset-2 ${
                    user.biometricEnabled ? 'bg-[#B71C1C]' : 'bg-gray-300'
                  }`}
                >
                  <span className="sr-only">Toggle Secure Biometric Login</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      user.biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Enrolled Authenticator Metadata & Diagnostics */}
            {user.biometricEnabled ? (
              <div className="mt-3 p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Enrolled Authenticator
                    </span>
                    <p className="font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                      <Cpu className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{user.biometricDeviceName || 'Platform Biometric Sensor'}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Enrolled Timestamp
                    </span>
                    <p className="font-mono text-gray-800 text-[11px] mt-0.5">
                      {user.biometricRegisteredAt
                        ? new Date(user.biometricRegisteredAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Active Registration'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      FIDO2 Credential ID
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[11px] text-gray-700 bg-white/90 px-2 py-0.5 rounded border border-gray-200 truncate max-w-[140px]">
                        {user.biometricCredentialId || 'kit-fido2-pubkey-bound'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(user.biometricCredentialId || 'kit-fido2-pubkey-bound');
                          setCopiedKey(true);
                          setTimeout(() => setCopiedKey(false), 2000);
                        }}
                        className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100/80 px-1.5 py-0.5 rounded"
                      >
                        {copiedKey ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-200/60">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Cryptographic signatures verified via WebAuthn challenge/response handshake.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBiometricModalMode('test');
                        setBiometricModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                    >
                      <Fingerprint className="w-3 h-3" />
                      <span>Test Handshake</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBiometricModalMode('enroll');
                        setBiometricModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Re-Enroll Device</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBiometricModalMode('revoke');
                        setBiometricModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                    >
                      <X className="w-3 h-3" />
                      <span>Revoke</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B71C1C] shrink-0" />
                  <span>
                    Initial handshake requires touching your device sensor to generate a hardware-secured public key.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBiometricModalMode('enroll');
                    setBiometricModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#8E0000] rounded-xl shadow-xs transition-colors shrink-0"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Setup Biometrics</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Tab View 2: Certificates & Credentials (Supabase Storage) */}
  {activeProfileTab === 'certificates' && (
    <div className="animate-in fade-in duration-200">
      <StudentCertificatesSection user={user} />
    </div>
  )}

  {/* Tab View 3: Security & Activity Log */}
  {activeProfileTab === 'activity' && (
    <UserActivityLogView
      user={user}
      onOpenPasswordModal={() => setPasswordModalOpen(true)}
    />
  )}

  {/* Re-Authentication & Password Update Security Modal */}
      <PasswordUpdateModal
        user={user}
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* WebAuthn Biometric Handshake Modal */}
      <BiometricHandshakeModal
        user={user}
        isOpen={biometricModalOpen}
        mode={biometricModalMode}
        onClose={() => setBiometricModalOpen(false)}
        onSuccess={handleBiometricSuccess}
      />

      {/* Photo Upload & AI Vulnerability Inspection Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#B71C1C]" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Upload & Update Profile Photo
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    All media uploads are scanned dynamically for security vulnerabilities & policies.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPhotoModalOpen(false);
                  setPreviewPhoto(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Photo Preview Stage */}
              <div className="flex flex-col items-center justify-center">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Preview"
                    className="h-36 w-36 rounded-2xl object-cover border-4 border-[#B71C1C] shadow-lg"
                  />
                ) : user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-36 w-36 rounded-2xl object-cover border-2 border-gray-200 shadow-md"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B71C1C] to-[#D32F2F] text-5xl font-black text-white shadow-md">
                    {user.name.charAt(0)}
                  </div>
                )}
                <p className="text-[11px] text-gray-500 mt-2">
                  {previewPhoto ? 'New photo ready for security audit' : 'Current active profile photo'}
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-red-200 bg-red-50/40 rounded-xl p-4 cursor-pointer hover:bg-red-50 transition-colors text-center"
              >
                <Upload className="w-6 h-6 text-[#B71C1C] mx-auto mb-1.5" />
                <p className="text-xs font-bold text-gray-800">
                  Select image from your device (PNG, JPG, WEBP)
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Click to browse files (Up to 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
              </div>

              {/* Sample Preset Selector */}
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Or choose a verified sample portrait:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                        previewPhoto === preset.url
                          ? 'border-[#B71C1C] bg-red-50/60 ring-2 ring-red-500/20'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-10 w-10 rounded-lg object-cover mb-1 border border-gray-200"
                      />
                      <span className="text-[10px] font-bold text-gray-700 leading-tight">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Safety Banner */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Gemini Vision AI Vulnerability Scanner</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Every uploaded image is parsed by Gemini AI to detect hidden malware payloads, steganography, exploit vectors, and safety violations before applying to institutional systems.
                </p>
              </div>

              {/* Vulnerability Test Trigger (Per User Request: "if its vulnerable and the account should be blocked") */}
              <div className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-950 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    Security Enforcement Test Mode:
                  </span>
                  <span className="text-[10px] font-bold text-red-700 bg-red-200/80 px-2 py-0.5 rounded">
                    Audit Verification
                  </span>
                </div>
                <p className="text-[11px] text-red-800 leading-relaxed">
                  Test the automatic security defense trigger that flags vulnerable or malicious uploads and immediately suspends the user account:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSimulateVulnerableUpload('MALICIOUS_PAYLOAD')}
                    disabled={isScanningPhoto}
                    className="flex-1 py-2 px-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Simulate Vulnerable/Malicious Payload Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateVulnerableUpload('NSFW_VIOLATION')}
                    disabled={isScanningPhoto}
                    className="py-2 px-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                  >
                    Simulate Policy Violation
                  </button>
                </div>
              </div>

              {/* Status Note */}
              {scanStatusNote && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{scanStatusNote}</span>
                </div>
              )}

              {user.avatar && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Remove Current Photo
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setPhotoModalOpen(false);
                  setPreviewPhoto(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!previewPhoto || isScanningPhoto}
                onClick={handleAuditAndSavePhoto}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#8E0000] rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {isScanningPhoto ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify with AI & Save Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
