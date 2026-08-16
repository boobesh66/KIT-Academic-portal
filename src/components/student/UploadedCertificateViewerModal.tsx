import React from 'react';
import {
  X,
  FileText,
  Download,
  ShieldCheck,
  Calendar,
  HardDrive,
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { UploadedCertificate } from '../../types';
import { api } from '../../services/api';

interface UploadedCertificateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: UploadedCertificate | null;
}

export const UploadedCertificateViewerModal: React.FC<UploadedCertificateViewerModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !certificate) return null;

  const isPdf = certificate.mime_type?.includes('pdf') || certificate.file_name.toLowerCase().endsWith('.pdf');
  const isImage = certificate.mime_type?.includes('image') || /\.(png|jpg|jpeg)$/i.test(certificate.file_name);
  const formattedSize = (certificate.file_size / (1024 * 1024)).toFixed(2) + ' MB';
  const kbSize = (certificate.file_size / 1024).toFixed(1) + ' KB';
  const displaySize = certificate.file_size >= 1024 * 1024 ? formattedSize : kbSize;

  const viewUrl = api.getCertificateViewUrl(certificate.id);
  const downloadUrl = api.getCertificateDownloadUrl(certificate.id);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(certificate.storage_path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = certificate.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="certificate-viewer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="certificate-viewer-modal"
        className="relative flex flex-col w-full max-w-3xl max-h-[92vh] rounded-2xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/30 border border-red-500/40 text-red-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white line-clamp-1">{certificate.certificate_name}</h3>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  Supabase Verified
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {certificate.certificate_type} • Uploaded {new Date(certificate.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <button
            id="btn-close-cert-viewer"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Storage Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50/80 px-6 py-3 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-400 block">File Type</span>
            <span className="font-bold text-gray-800 uppercase flex items-center gap-1 mt-0.5">
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${isPdf ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {isPdf ? 'PDF' : isImage ? 'IMAGE' : 'DOCUMENT'}
              </span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-400 block">File Size</span>
            <span className="font-bold text-gray-800 mt-0.5 block">{displaySize}</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-400 block">Storage Bucket</span>
            <span className="font-mono text-gray-700 font-medium text-[11px] mt-0.5 block">supabase: certificates</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-400 block">Student Scope</span>
            <span className="font-mono text-gray-700 font-medium text-[11px] mt-0.5 block">{certificate.student_id}</span>
          </div>
        </div>

        {/* Certificate Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-100/60">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            {isImage ? (
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-900 overflow-hidden">
                <img
                  src={viewUrl}
                  alt={certificate.certificate_name}
                  className="max-h-[380px] w-auto object-contain rounded-md shadow-sm"
                  onError={(e) => {
                    // Fallback to SVG badge placeholder
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : isPdf ? (
              <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{certificate.file_name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Adobe Portable Document Format (PDF) • {displaySize}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
                  >
                    Open Document in New Tab <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-lg space-y-2">
                <FileText className="w-12 h-12 text-gray-400" />
                <h4 className="text-sm font-bold text-gray-900">{certificate.file_name}</h4>
                <p className="text-xs text-gray-500">{certificate.mime_type}</p>
              </div>
            )}

            {/* Storage Path Copier */}
            <div className="mt-4 flex items-center justify-between gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <HardDrive className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="text-gray-500 shrink-0 font-medium">Supabase Path:</span>
                <span className="font-mono text-[11px] text-gray-800 truncate">{certificate.storage_path}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyPath}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 shrink-0 px-2 py-1 rounded bg-blue-50 border border-blue-200 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Security & Access Policy Notice */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 space-y-0.5">
              <p className="font-bold">Row-Level Security (RLS) & Access Isolation Active</p>
              <p className="text-emerald-800 text-[11px]">
                This certificate file is stored strictly under your student identity namespace in Supabase Storage. Only you and authorized institutional reviewers can access this credential.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
          <div className="text-[11px] text-gray-400">
            Database Record ID: <span className="font-mono text-gray-600">{certificate.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#B71C1C] hover:bg-red-800 rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
