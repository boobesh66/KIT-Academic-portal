import React, { useState, useEffect } from 'react';
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
  Trophy,
  ExternalLink,
  Plus
} from 'lucide-react';
import { User, HackathonParticipation } from '../../types';
import { api } from '../../services/api';
import { CertificateVerificationModal } from './CertificateVerificationModal';
import { AddHackathonModal } from './AddHackathonModal';
import { StudentCertificatesSection } from './StudentCertificatesSection';

interface StudentProfileProps {
  user: User;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ user }) => {
  const [hackathons, setHackathons] = useState<HackathonParticipation[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonParticipation | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getStudentHackathons(user.id);
        setHackathons(data);
      } catch (e) {
        console.warn('Failed loading hackathons in profile', e);
      }
    };
    load();
  }, [user.id]);

  const handleOpenCertificate = (hack: HackathonParticipation) => {
    setSelectedHackathon(hack);
    setIsCertModalOpen(true);
  };
  return (
    <div id="student-profile-view" className="space-y-6">
      {/* Profile Header Hero */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B71C1C] to-[#D32F2F] text-3xl font-black text-white shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  Active Regular
                </span>
              </div>
              <p className="text-xs font-semibold text-[#B71C1C] mt-1 font-mono">
                Reg No: {user.registerNumber || '711522205023'} • Roll No: 22AD023
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                B.Tech Artificial Intelligence and Data Science (AI & DS)
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-center min-w-[140px]">
            <p className="text-[10px] font-bold text-[#B71C1C] uppercase">Standing CGPA</p>
            <p className="text-3xl font-black text-[#B71C1C]">{user.cgpa?.toFixed(2) || '7.85'}</p>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Sem 1 - 5 Average</p>
          </div>
        </div>
      </div>

      {/* Profile Data Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Academic & Enrollment Details */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#B71C1C]" />
            Academic & Institutional Record
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Degree & Branch</span>
              <strong className="text-gray-900">B.Tech - AI & Data Science</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Batch / Academic Cycle</span>
              <strong className="text-gray-900">2022 - 2026</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Current Semester / Section</span>
              <strong className="text-gray-900">Semester 5 / Section A</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Regulation</span>
              <strong className="text-gray-900">KIT Autonomous Regulation 2022</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Class Advisor / Mentor</span>
              <strong className="text-[#B71C1C]">Dr. S. Ramanathan, Asso. Prof</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Total Earned Credits</span>
              <strong className="text-emerald-700 font-bold">96 / 165 Credits</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Personal Details */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#B71C1C]" />
            Personal & Contact Information
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Institutional Email</span>
              <strong className="text-gray-900">{user.email}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Mobile Contact</span>
              <strong className="text-gray-900">{user.phone || '+91 98421 88402'}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Date of Birth</span>
              <strong className="text-gray-900">14 August 2004</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Hostel / Day Scholar</span>
              <strong className="text-gray-900">Day Scholar (College Bus Route #12)</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Parent / Guardian</span>
              <strong className="text-gray-900">M. Karthikeyan (+91 94432 10984)</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Residential Address</span>
              <strong className="text-gray-900">Peelamedu, Coimbatore - 641004</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Student Hackathon Participation History & Verified Certificates Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#B71C1C]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Hackathon Participation History & Verified Certificates</h2>
              <p className="text-xs text-gray-500">
                Institutional & national innovation competitions endorsed for NAAC / NBA Criterion 5.3.1
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B71C1C] hover:bg-red-800 text-white text-xs font-bold shadow-2xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Hackathon
          </button>
        </div>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hackathons.map((hack) => {
            const isWinner = hack.standing.includes('Winner') || hack.standing.includes('1st');

            return (
              <div
                key={hack.id}
                className={`rounded-xl border p-4 transition-all duration-150 hover:shadow-sm space-y-2.5 ${
                  isWinner ? 'border-amber-200 bg-amber-50/20' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isWinner ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {hack.standing}
                      </span>
                      <span className="text-[10px] text-gray-500 font-semibold">{hack.level}</span>
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 mt-1">{hack.hackathonName}</h3>
                    <p className="text-[11px] text-[#B71C1C] font-semibold">{hack.organizer}</p>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-sm shrink-0">
                    +{hack.creditsEarned} Credits
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-gray-100 text-xs">
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Project</span>
                  <p className="font-semibold text-gray-900 line-clamp-1">{hack.projectTitle}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono text-[10px]">{hack.certificate.certificateId}</span>
                  </div>

                  <button
                    onClick={() => handleOpenCertificate(hack)}
                    className="flex items-center gap-1 text-xs font-bold text-[#B71C1C] hover:underline"
                  >
                    Verify Certificate <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secure Supabase Certificates Section */}
      <StudentCertificatesSection user={user} />

      {/* Verification and Add Modals */}
      <CertificateVerificationModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        hackathon={selectedHackathon}
      />

      <AddHackathonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        user={user}
        onHackathonAdded={(newHack) => {
          setHackathons((prev) => [newHack, ...prev]);
          setSelectedHackathon(newHack);
          setIsCertModalOpen(true);
        }}
      />
    </div>
  );
};
