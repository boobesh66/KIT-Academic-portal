import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Sparkles,
  QrCode,
  Download,
  Users,
  Code,
  Tag,
  Share2,
  FileCheck,
  Check
} from 'lucide-react';
import { User, HackathonParticipation } from '../../types';
import { api } from '../../services/api';
import { CertificateVerificationModal } from './CertificateVerificationModal';
import { AddHackathonModal } from './AddHackathonModal';

interface StudentHackathonsProps {
  user: User;
}

export const StudentHackathons: React.FC<StudentHackathonsProps> = ({ user }) => {
  const [hackathons, setHackathons] = useState<HackathonParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonParticipation | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [quickVerifyId, setQuickVerifyId] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadHackathons();
  }, [user.id]);

  const loadHackathons = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentHackathons(user.id);
      setHackathons(data);
    } catch (e) {
      console.warn('Failed loading hackathons', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCertificate = (hack: HackathonParticipation) => {
    setSelectedHackathon(hack);
    setIsCertModalOpen(true);
  };

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVerifyId.trim()) return;
    const match = hackathons.find(
      (h) => h.certificate.certificateId.toLowerCase() === quickVerifyId.trim().toLowerCase()
    );
    setSelectedHackathon(match || null);
    setIsCertModalOpen(true);
  };

  const handleCopyCertId = (certId: string) => {
    navigator.clipboard.writeText(certId);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleHackathonAdded = (newHackathon: HackathonParticipation) => {
    setHackathons((prev) => [newHackathon, ...prev]);
    setSelectedHackathon(newHackathon);
    setIsCertModalOpen(true);
  };

  // Filter hackathons
  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch =
      h.hackathonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.certificate.certificateId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || h.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const totalPrizes = hackathons.filter((h) => h.standing.includes('Winner') || h.standing.includes('1st')).length;
  const totalCredits = hackathons.reduce((acc, curr) => acc + (curr.creditsEarned || 2), 0);

  return (
    <div id="student-hackathons-view" className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-red-900 via-[#B71C1C] to-red-800 p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-xs border border-white/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>KIT Autonomous Innovation & National Hackathons Dossier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Student Hackathon Participation & Verified Certificates
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
              Showcasing verified national hackathon triumphs, smart prototyping achievements, and cryptographically attested credentials for student <strong>{user.name}</strong> ({user.registerNumber || '711522205023'}).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="submit-hackathon-hero-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#B71C1C] shadow-lg hover:bg-red-50 transition-all shrink-0"
            >
              <Plus className="w-4 h-4 text-[#B71C1C]" />
              Submit New Hackathon
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-200">Total Hackathons</span>
            <p className="text-2xl font-black text-white mt-0.5">{hackathons.length}</p>
            <span className="text-[10px] text-red-200">National & State Level</span>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">1st Prize Triumphs</span>
            <p className="text-2xl font-black text-amber-300 mt-0.5">{totalPrizes}</p>
            <span className="text-[10px] text-red-200">National Champions</span>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Total Grants & Prizes</span>
            <p className="text-2xl font-black text-emerald-300 mt-0.5">₹1,90,000+</p>
            <span className="text-[10px] text-red-200">Cash Awards & Cloud Credits</span>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">NAAC Activity Credits</span>
            <p className="text-2xl font-black text-white mt-0.5">+{totalCredits} Credits</p>
            <span className="text-[10px] text-red-200">Accreditation Criterion 5.3.1</span>
          </div>
        </div>
      </div>

      {/* Live Certificate Authenticity Verification Quick-Bar */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-xs">
        <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 text-emerald-900 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">Instant Certificate Authenticity Verifier</span>
              <span className="text-[10px] text-emerald-700">Enter any KIT / National Hackathon Token ID</span>
            </div>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={quickVerifyId}
              onChange={(e) => setQuickVerifyId(e.target.value)}
              placeholder="e.g. KIT-SIH-2025-AI-9842"
              className="w-full px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-lg border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shrink-0 shadow-2xs"
          >
            Verify Certificate
          </button>
        </form>
      </div>

      {/* Search & Filtering Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hackathons, project title, or organizer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 focus:border-[#B71C1C] outline-none"
          >
            <option value="all">All Categories</option>
            <option value="AI / ML & GenAI">AI / ML & GenAI</option>
            <option value="AgriTech & Climate">AgriTech & Climate</option>
            <option value="HealthTech">HealthTech</option>
            <option value="IoT & Robotics">IoT & Robotics</option>
            <option value="Smart Campus">Smart Campus</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 focus:border-[#B71C1C] outline-none"
          >
            <option value="all">All Levels</option>
            <option value="National">National</option>
            <option value="State Level">State Level</option>
            <option value="Inter-Collegiate">Inter-Collegiate</option>
            <option value="Institutional (KIT)">Institutional (KIT)</option>
          </select>
        </div>
      </div>

      {/* Hackathons Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-gray-500">
          Loading authenticated hackathon portfolio...
        </div>
      ) : filteredHackathons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-900">No hackathon records matched your filter</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try adjusting your search criteria or register a new hackathon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredHackathons.map((hack) => {
            const isWinner = hack.standing.includes('Winner') || hack.standing.includes('1st');

            return (
              <div
                key={hack.id}
                id={`hackathon-card-${hack.id}`}
                className={`rounded-2xl border transition-all duration-200 bg-white p-6 shadow-xs hover:shadow-md ${
                  isWinner ? 'border-amber-200 ring-1 ring-amber-100' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1">
                    {/* Badges & Meta */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isWinner ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-900 border border-amber-300/60 shadow-2xs">
                          <Trophy className="w-3 h-3 text-amber-700" />
                          {hack.standing}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-900 border border-blue-200">
                          <Award className="w-3 h-3 text-blue-700" />
                          {hack.standing}
                        </span>
                      )}

                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
                        {hack.level} Level
                      </span>

                      <span className="rounded-full bg-red-50 text-[#B71C1C] px-2.5 py-0.5 text-[11px] font-bold border border-red-100">
                        {hack.category}
                      </span>

                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" /> {hack.eventDate}
                      </span>
                    </div>

                    {/* Hackathon Name & Organizer */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">{hack.hackathonName}</h3>
                      <p className="text-xs font-semibold text-[#B71C1C] mt-0.5">
                        Organized by {hack.organizer} • Venue: {hack.venue}
                      </p>
                    </div>

                    {/* Project Title & Description */}
                    <div className="rounded-xl bg-gray-50/80 border border-gray-100 p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Innovative Project Title
                        </span>
                        {hack.prizeWon && (
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-sm">
                            {hack.prizeWon}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">{hack.projectTitle}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{hack.projectDescription}</p>
                    </div>

                    {/* Team & Technologies */}
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          Team: <strong>{hack.teamName}</strong> ({hack.teamRole})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-gray-400" />
                        <div className="flex flex-wrap items-center gap-1">
                          {hack.technologiesUsed.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-mono font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Verified Digital Certificate Card */}
                  <div className="w-full lg:w-72 shrink-0 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Verified Certificate
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                          +{hack.creditsEarned} NAAC Credits
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-emerald-100 shadow-2xs space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase block font-semibold">Certificate ID</span>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-gray-900">
                            {hack.certificate.certificateId}
                          </span>
                          <button
                            onClick={() => handleCopyCertId(hack.certificate.certificateId)}
                            className="text-gray-400 hover:text-gray-700"
                            title="Copy Token"
                          >
                            {copiedId === hack.certificate.certificateId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-500">
                        Attested by: <strong>{hack.facultyEndorsement?.endorsedBy || 'HoD AI&DS / AICTE Nodal Cell'}</strong>
                      </p>
                    </div>

                    <button
                      id={`view-cert-btn-${hack.id}`}
                      onClick={() => handleOpenCertificate(hack)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#B71C1C] hover:bg-red-800 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      View & Verify Certificate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        hackathon={selectedHackathon}
      />

      {/* Add Hackathon Modal */}
      <AddHackathonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        user={user}
        onHackathonAdded={handleHackathonAdded}
      />
    </div>
  );
};
