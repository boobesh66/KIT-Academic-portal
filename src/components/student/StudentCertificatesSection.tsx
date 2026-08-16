import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  HardDrive,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  FileCheck,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { User, UploadedCertificate } from '../../types';
import { api } from '../../services/api';
import { UploadCertificateModal } from './UploadCertificateModal';
import { UploadedCertificateViewerModal } from './UploadedCertificateViewerModal';

interface StudentCertificatesSectionProps {
  user: User;
}

export const StudentCertificatesSection: React.FC<StudentCertificatesSectionProps> = ({ user }) => {
  const [certificates, setCertificates] = useState<UploadedCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedViewerCert, setSelectedViewerCert] = useState<UploadedCertificate | null>(null);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);

  // Deletion state
  const [deletingCertId, setDeletingCertId] = useState<string | null>(null);
  const [deleteConfirmCert, setDeleteConfirmCert] = useState<UploadedCertificate | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const response = await api.getStudentCertificates(user.id, user.id, user.role);
      if (response.success && response.certificates) {
        setCertificates(response.certificates);
      }
    } catch (e) {
      console.warn('Failed to load student certificates:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [user.id]);

  const handleCertificateUploaded = (newCert: UploadedCertificate) => {
    setCertificates((prev) => [newCert, ...prev]);
    setFeedbackMessage({
      type: 'success',
      text: `Certificate "${newCert.certificate_name}" securely stored in Supabase Storage.`,
    });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleOpenViewer = (cert: UploadedCertificate) => {
    setSelectedViewerCert(cert);
    setIsViewerModalOpen(true);
  };

  const handleDownload = (cert: UploadedCertificate) => {
    const downloadUrl = api.getCertificateDownloadUrl(cert.id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = cert.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirmCert) return;

    const certId = deleteConfirmCert.id;
    const certName = deleteConfirmCert.certificate_name;
    setDeletingCertId(certId);
    setDeleteConfirmCert(null);

    try {
      const result = await api.deleteCertificate(certId, user.id, user.role);
      if (result.success) {
        setCertificates((prev) => prev.filter((c) => c.id !== certId));
        setFeedbackMessage({
          type: 'success',
          text: `Certificate "${certName}" removed from Supabase Storage and database.`,
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: result.error || 'Failed to delete certificate.',
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Error occurred while removing certificate.',
      });
    } finally {
      setDeletingCertId(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.certificate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificate_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || cert.certificate_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', ...Array.from(new Set(certificates.map((c) => c.certificate_type)))];

  return (
    <div id="student-certificates-section" className="space-y-4">
      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          id="cert-feedback-alert"
          className={`flex items-start gap-3 rounded-xl border p-4 text-xs animate-in fade-in slide-in-from-top-2 ${
            feedbackMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-red-200 bg-red-50 text-red-900'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-semibold">{feedbackMessage.text}</div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#B71C1C] border border-red-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Student Certificates</h2>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Supabase Storage
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload and manage institutional course diplomas, hackathon honors, and workshop credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-refresh-certs"
              onClick={fetchCertificates}
              disabled={isLoading}
              title="Refresh certificate list"
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              id="btn-open-upload-modal"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B71C1C] hover:bg-red-800 text-white text-xs font-bold shadow-2xs transition-colors shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Certificate
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="input-search-certificates"
              type="text"
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-hidden"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? `All (${certificates.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#B71C1C]" />
            <p className="text-xs text-gray-500 font-semibold">Syncing certificates with Supabase Storage...</p>
          </div>
        ) : filteredCertificates.length === 0 ? (
          /* Empty State */
          <div
            id="certificates-empty-state"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-[#B71C1C] mb-3 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-gray-900">No Certificates Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
              {searchQuery || selectedCategory !== 'ALL'
                ? 'No certificate matched your search query or filter. Try resetting your search.'
                : 'You have not uploaded any certificates yet. Upload your PDF, JPG, or PNG certificates to store them safely in Supabase Storage.'}
            </p>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B71C1C] hover:bg-red-800 text-white text-xs font-bold shadow-2xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Your First Certificate
            </button>
          </div>
        ) : (
          /* Certificate List / Cards Grid */
          <div id="certificates-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCertificates.map((cert) => {
              const isPdf = cert.mime_type?.includes('pdf') || cert.file_name.toLowerCase().endsWith('.pdf');
              const isImage = cert.mime_type?.includes('image') || /\.(png|jpg|jpeg)$/i.test(cert.file_name);
              const formattedDate = new Date(cert.uploaded_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const isDeleting = deletingCertId === cert.id;

              return (
                <div
                  key={cert.id}
                  id={`cert-card-${cert.id}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150 hover:shadow-md hover:border-red-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    {/* Top Type Badge & File Size */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-[#B71C1C]">
                        {cert.certificate_type}
                      </span>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            isPdf ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {isPdf ? 'PDF' : isImage ? 'IMAGE' : 'DOC'}
                        </span>
                        <span>{formatFileSize(cert.file_size)}</span>
                      </div>
                    </div>

                    {/* Certificate Name */}
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{cert.certificate_name}</h3>

                    {/* Original File Name & Path info */}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 truncate">
                      <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-mono text-[11px] truncate">{cert.file_name}</span>
                    </div>

                    {/* Upload Date & Supabase Status */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {formattedDate}
                      </span>

                      <span className="flex items-center gap-1 font-semibold text-emerald-700 text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Stored & Verified
                      </span>
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                    <button
                      id={`btn-view-${cert.id}`}
                      onClick={() => handleOpenViewer(cert)}
                      className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-[#B71C1C] px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title="View Certificate preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-download-${cert.id}`}
                        onClick={() => handleDownload(cert)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Download Certificate file"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        Download
                      </button>

                      <button
                        id={`btn-delete-${cert.id}`}
                        onClick={() => setDeleteConfirmCert(cert)}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete from Supabase Storage & DB"
                      >
                        {isDeleting ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-600" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmCert && (
        <div
          id="delete-confirm-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Delete Certificate?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-gray-900">"{deleteConfirmCert.certificate_name}"</strong>?
              This will remove the file from <strong>Supabase Storage</strong> and delete the metadata record.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmCert(null)}
                className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                id="btn-confirm-delete-cert"
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Certificate Modal */}
      <UploadCertificateModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={user}
        onCertificateUploaded={handleCertificateUploaded}
      />

      {/* View Certificate Modal */}
      <UploadedCertificateViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => setIsViewerModalOpen(false)}
        certificate={selectedViewerCert}
      />
    </div>
  );
};
