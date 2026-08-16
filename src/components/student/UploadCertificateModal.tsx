import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  HardDrive,
  Sparkles,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { User, UploadedCertificate } from '../../types';
import { api } from '../../services/api';

interface UploadCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onCertificateUploaded: (newCert: UploadedCertificate) => void;
}

const CERTIFICATE_TYPES = [
  'Academic Course',
  'Hackathon & Technical',
  'Industry Certification',
  'Workshop / Seminar',
  'Internship & Project',
  'Sports & Extra-curricular',
  'Other'
];

export const UploadCertificateModal: React.FC<UploadCertificateModalProps> = ({
  isOpen,
  onClose,
  user,
  onCertificateUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [certificateName, setCertificateName] = useState('');
  const [certificateType, setCertificateType] = useState('Academic Course');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepNote, setUploadStepNote] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateAndProcessFile = (selectedFile: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. File Type Validation: PDF, JPG, JPEG, PNG
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const extension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedExtensions.includes(extension) && !allowedMimeTypes.includes(selectedFile.type)) {
      setErrorMessage('Invalid file format. Only PDF, JPG, JPEG, and PNG certificates are allowed.');
      setFile(null);
      setFileBase64('');
      return false;
    }

    // 2. File Size Validation: Max 5 MB
    const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
    if (selectedFile.size > MAX_BYTES) {
      setErrorMessage(
        `File size (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 5 MB maximum limit.`
      );
      setFile(null);
      setFileBase64('');
      return false;
    }

    // Default certificate title to clean file name if empty
    if (!certificateName) {
      const cleanName = selectedFile.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setCertificateName(cleanName);
    }

    // Read base64 for upload payload
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);

    setFile(selectedFile);
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndProcessFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a certificate file (PDF, JPG, or PNG) to upload.');
      return;
    }

    if (!certificateName.trim()) {
      setErrorMessage('Please enter a descriptive Certificate Name.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStepNote('Validating student ownership and MIME signature...');
    setErrorMessage(null);

    try {
      // Execute upload to Supabase Storage and PostgreSQL database via server endpoint
      const result = await api.uploadCertificate(
        {
          student_id: user.id,
          certificate_name: certificateName.trim(),
          certificate_type: certificateType,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
          file_data_base64: fileBase64,
        },
        (progress) => {
          setUploadProgress(progress);
          if (progress < 40) {
            setUploadStepNote('Encrypting & uploading to Supabase Storage bucket "certificates"...');
          } else if (progress < 80) {
            setUploadStepNote('Writing metadata to PostgreSQL "certificates" table...');
          } else {
            setUploadStepNote('Finalizing security policies and generating signed tokens...');
          }
        }
      );

      if (result.success && result.certificate) {
        setUploadProgress(100);
        setSuccessMessage('Certificate uploaded to Supabase Storage and recorded successfully!');
        onCertificateUploaded(result.certificate);

        // Auto close after brief display
        setTimeout(() => {
          setIsUploading(false);
          onClose();
        }, 1400);
      } else {
        setErrorMessage(result.error || 'Upload failed. Please try again.');
        setIsUploading(false);
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMessage(err.message || 'Network error occurred during certificate upload.');
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div
      id="upload-certificate-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="upload-certificate-modal"
        className="relative flex flex-col w-full max-w-xl max-h-[92vh] rounded-2xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-[#B71C1C] to-[#880E4F] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Student Certificate</h3>
              <p className="text-xs text-red-100">
                Securely store in Supabase Storage with institutional RLS protection
              </p>
            </div>
          </div>

          <button
            id="btn-close-upload-modal"
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto p-6 space-y-4">
          {/* Error Message Alert */}
          {errorMessage && (
            <div
              id="upload-error-alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900 animate-in fade-in"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Upload Error</p>
                <p className="text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div
              id="upload-success-alert"
              className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Success</p>
                <p className="text-emerald-700 mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Certificate Document File <span className="text-red-500">*</span>
            </label>

            {!file ? (
              <div
                id="certificate-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#B71C1C] bg-red-50/50 scale-[1.01]'
                    : 'border-gray-300 bg-gray-50/60 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xs border border-gray-200 mb-3 text-[#B71C1C]">
                  <Upload className="w-6 h-6" />
                </div>

                <p className="text-xs font-bold text-gray-800 text-center">
                  Drag and drop your certificate here, or <span className="text-[#B71C1C] underline">browse files</span>
                </p>

                <p className="text-[11px] text-gray-500 text-center mt-1">
                  Supports <strong>PDF, JPG, JPEG, PNG</strong> (Max: 5 MB)
                </p>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200/80 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Supabase Storage
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-blue-600" /> Student Scope Isolation
                  </span>
                </div>
              </div>
            ) : (
              /* Selected File Card */
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 text-[#B71C1C] shrink-0">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                      <span className="font-semibold">{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-gray-200 text-gray-700 font-bold">
                        {file.name.split('.').pop()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFileBase64('');
                  }}
                  disabled={isUploading}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Remove selected file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Certificate Name Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Certificate Name / Title <span className="text-red-500">*</span>
            </label>
            <input
              id="input-cert-name"
              type="text"
              required
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect, Smart India Hackathon Merit"
              disabled={isUploading}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-hidden transition-all disabled:bg-gray-100"
            />
          </div>

          {/* Certificate Category / Type Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Certificate Category / Type <span className="text-red-500">*</span>
            </label>
            <select
              id="select-cert-type"
              value={certificateType}
              onChange={(e) => setCertificateType(e.target.value)}
              disabled={isUploading}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-hidden transition-all bg-white disabled:bg-gray-100"
            >
              {CERTIFICATE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Progress Indicator */}
          {isUploading && (
            <div id="upload-progress-container" className="space-y-2 rounded-xl border border-red-100 bg-red-50/60 p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span className="flex items-center gap-1.5 text-[#B71C1C]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading to Supabase Storage...
                </span>
                <span>{uploadProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-red-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B71C1C] to-red-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <p className="text-[10px] text-gray-600 font-mono line-clamp-1">{uploadStepNote}</p>
            </div>
          )}

          {/* Storage Information Banner */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex items-start gap-2.5 text-[11px] text-gray-600">
            <HardDrive className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Supabase Storage Path Structure</p>
              <p className="font-mono text-[10px] text-gray-500 mt-0.5">
                certificates/{user.id}/[unique_filename]
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Binary payload is saved exclusively in Supabase Storage. PostgreSQL stores only metadata and references.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              id="btn-submit-cert-upload"
              type="submit"
              disabled={isUploading || !file}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#B71C1C] hover:bg-red-800 rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Certificate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
