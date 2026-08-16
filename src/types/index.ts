export type Role = 'student' | 'faculty' | 'hod' | 'admin';

export interface SecurityThreatDetails {
  threatCategory: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  flaggedPayloadSummary?: string;
  policyCode?: string;
  aiDetectedThreats?: string[];
  scanTimestamp?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  departmentId: string;
  departmentName: string;
  registerNumber?: string;
  designation?: string;
  phone?: string;
  joinYear?: number;
  semester?: number;
  section?: string;
  cgpa?: number; // ONLY for students
  mentorName?: string;
  // Personal & Contact Info
  dob?: string;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  parentName?: string;
  parentPhone?: string;
  transportMode?: string;
  // Professional & Academic Info
  qualification?: string;
  experienceYears?: number;
  specialization?: string;
  employeeCode?: string;
  cabinRoom?: string;
  officeHours?: string;
  publicationsCount?: number;
  patentsCount?: number;
  bio?: string;
  linkedIn?: string;
  github?: string;
  skills?: string[];
  // Security & Account Status
  isBlocked?: boolean;
  blockedReason?: string;
  blockedAt?: string;
  securityThreatDetails?: SecurityThreatDetails;
  lastPasswordChangedAt?: string;
  twoFactorEnabled?: boolean;
  activeSessionsCount?: number;
  biometricEnabled?: boolean;
  biometricRegisteredAt?: string;
  biometricCredentialId?: string;
  biometricDeviceName?: string;
  biometricAuthenticatorType?: 'platform' | 'cross-platform';
  biometricAaguid?: string;
}

export type ActivityLogCategory = 'all' | 'login' | 'password' | 'security' | 'biometric';

export type ActivityLogType =
  | 'login'
  | 'login_failed'
  | 'password_change_success'
  | 'password_change_failed'
  | 'reauth_success'
  | 'reauth_failed'
  | 'security_scan'
  | 'session_revoked'
  | 'profile_update'
  | 'biometric_enroll'
  | 'biometric_revoke'
  | 'biometric_login'
  | 'biometric_verify'
  | 'certificate_upload'
  | 'certificate_delete';

export interface UserActivityLog {
  id: string;
  userId: string;
  type: ActivityLogType;
  action: string;
  description: string;
  ipAddress: string;
  device: string;
  browser?: string;
  os?: string;
  location: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING' | 'BLOCKED';
  timestamp: string;
  details?: {
    failureReason?: string;
    authMethod?: string;
    changedFields?: string[];
    threatLevel?: string;
    riskScore?: number;
    auditId?: string;
    certificateId?: string;
    storageBucket?: string;
    storagePath?: string;
    fileSize?: number;
    mimeType?: string;
    fileName?: string;
  };
}

export interface Department {
  id: string;
  code: string;
  name: string;
  hodName: string;
  totalStudents: number;
  totalFaculty: number;
  averageAttendance: number;
  averagePassRate: number;
  atRiskCount: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  credits: number;
  type: 'Theory' | 'Practical' | 'Integrated' | 'Elective';
  facultyId: string;
  facultyName: string;
  description: string;
  syllabus: string[];
  schedule: string;
  room: string;
  totalSessions: number;
  enrolledStudentsCount: number;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  type: 'Theory' | 'Lab' | 'Tutorial';
  section: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  date: string;
  period: number;
  status: 'Present' | 'Absent' | 'OnDuty';
  section: string;
}

export interface StudentAttendanceSummary {
  courseId: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  present: number;
  total: number;
  percentage: number;
  status: 'Safe' | 'Warning' | 'Critical';
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  title: string;
  description: string;
  deadline: string;
  createdAt: string;
  totalMarks: number;
  materials?: string[];
  section: string;
  submissionsCount?: number;
  evaluatedCount?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  submittedAt: string;
  status: 'Pending' | 'Submitted' | 'Evaluated' | 'Late';
  fileUrl?: string;
  submissionText?: string;
  marksObtained?: number;
  totalMarks: number;
  feedback?: string;
  evaluatedAt?: string;
}

export interface Examination {
  id: string;
  name: string; // e.g. "Internal Assessment 1", "Semester Final Exam"
  type: 'Internal' | 'Model' | 'Semester';
  courseId: string;
  courseCode: string;
  courseName: string;
  date: string;
  time: string;
  venue: string;
  maxMarks: number;
  weightage: string;
}

export interface ExamMark {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  semester: number;
  internalAssessment1: number; // out of 50
  internalAssessment2: number; // out of 50
  modelExam: number; // out of 100
  externalExam?: number; // out of 100
  totalInternal: number; // out of 40
  totalExternal: number; // out of 60
  totalMarks: number; // out of 100
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA' | 'AB';
  gradePoint: number;
  result: 'Pass' | 'Fail' | 'Pending';
}

export interface StudentSemesterResult {
  semester: number;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  creditsRegistered: number;
  creditsEarned: number;
  totalSubjects: number;
  passedSubjects: number;
  marks: ExamMark[];
}

export interface AIInsightReport {
  studentId: string;
  studentName: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  overallScore: number; // 0 - 100
  confidenceScore: number;
  summary: string;
  mainFactors: string[];
  weakSubjects: {
    courseCode: string;
    courseName: string;
    score: number;
    attendance: number;
    trend: 'Declining' | 'Stable' | 'Improving';
    difficultTopics: string[];
    remediationAction: string;
  }[];
  strongSubjects: {
    courseCode: string;
    courseName: string;
    score: number;
    attendance: number;
    highlight: string;
  }[];
  recommendations: {
    priority: 'High' | 'Medium' | 'Low';
    title: string;
    reason: string;
    actionableSteps: string[];
    targetSubject?: string;
  }[];
  studyRoadmap7Days: {
    day: string;
    focusSubject: string;
    topics: string[];
    durationMinutes: number;
  }[];
  priorityRecoveryPlan?: {
    courseCode: string;
    courseName: string;
    topic: string;
    recommendedAction: string;
    targetDate: string;
    estimatedStudyMinutes: number;
  }[];
}

export type StudentAIInsight = AIInsightReport;

export interface FacultyAIClassInsight {
  courseId: string;
  courseCode: string;
  courseName: string;
  section: string;
  classAverageMarks: number;
  classAverageAttendance: number;
  belowAveragePercentage: number;
  toughestTopics: string[];
  atRiskStudentsCount: number;
  atRiskStudentsList: {
    studentId: string;
    name: string;
    registerNumber: string;
    attendancePct: number;
    internalMarkAvg: number;
    predictedRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    keyIssue: string;
  }[];
  recommendedTeachingActions: string[];
}

export interface NotificationItem {
  id: string;
  userId?: string; // specific user or role broadcast
  targetRole?: Role | 'all';
  type: 'assignment' | 'exam' | 'attendance' | 'result' | 'ai_insight' | 'announcement' | 'feedback';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
  priority: 'normal' | 'urgent';
}

export interface TeacherFeedback {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  studentId: string;
  studentName?: string;
  isAnonymous: boolean;
  ratings: {
    teachingClarity: number; // 1 to 5
    syllabusCoverage: number;
    labGuidance: number;
    doubtPatience: number;
    evaluationFairness: number;
    overallRating: number;
  };
  comments: {
    strengths: string;
    areasForImprovement: string;
    suggestions: string;
  };
  attachmentUrl?: string;
  attachmentName?: string;
  submittedAt: string;
  sentiment?: 'Positive' | 'Neutral' | 'Constructive';
  aiSummary?: string;
}

export interface AIFeedbackAnalysis {
  facultyId: string;
  facultyName: string;
  courseCode: string;
  courseName: string;
  totalFeedbacks: number;
  averageScore: number;
  metricAverages: {
    teachingClarity: number;
    syllabusCoverage: number;
    labGuidance: number;
    doubtPatience: number;
    evaluationFairness: number;
  };
  sentimentBreakdown: {
    positivePct: number;
    neutralPct: number;
    constructivePct: number;
  };
  topStrengths: string[];
  priorityGrowthAreas: string[];
  aiPedagogicalRecommendations: {
    category: string;
    recommendation: string;
    actionPlan: string;
  }[];
  hodExecutiveSummary: string;
}

export interface AIDocumentAnalysis {
  documentName: string;
  fileSize: string;
  analyzedAt: string;
  summary: string;
  keyFormulasAndConcepts: {
    title: string;
    explanation: string;
    importance: 'Crucial' | 'High' | 'Medium';
  }[];
  practiceQuestions: {
    question: string;
    marks: number;
    bloomLevel: string;
    modelAnswer: string;
  }[];
  flashcards: {
    front: string;
    back: string;
  }[];
}

export type CertificateVerificationStatus = 'verified' | 'pending' | 'in_review' | 'rejected';

export interface HackathonCertificate {
  certificateId: string;
  issueDate: string;
  issuingAuthority: string;
  certificateType: 'Certificate of Merit (Winner)' | 'Certificate of Excellence' | 'Certificate of Participation' | 'Special Innovation Honor';
  verificationStatus: CertificateVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationHash: string; // SHA-256 digital cryptographic signature
  qrCodeToken: string;
  fileUrl?: string;
  imageUrl?: string;
  forensicChecks: {
    metadataValid: boolean;
    tamperCheckPassed: boolean;
    authoritySignatureVerified: boolean;
    registryMatch: boolean;
    timestampVerified: boolean;
  };
}

export interface HackathonParticipation {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  hackathonName: string;
  editionOrYear: string;
  organizer: string;
  category: 'AI / ML & GenAI' | 'Full-Stack & Cloud' | 'IoT & Robotics' | 'HealthTech' | 'AgriTech & Climate' | 'Cybersecurity' | 'Smart Campus';
  level: 'National' | 'International' | 'State Level' | 'Inter-Collegiate' | 'Institutional (KIT)';
  projectTitle: string;
  projectDescription: string;
  teamName: string;
  teamRole: 'Team Leader' | 'AI / Algorithm Lead' | 'Full-Stack Developer' | 'IoT / Embedded Engineer';
  teamMembers?: string[];
  eventDate: string;
  venue: string;
  standing: '1st Prize Winner' | '2nd Runner-Up' | 'Top 5 National Finalist' | 'Best Innovation Award' | 'Grand Finale Participant';
  prizeWon?: string;
  creditsEarned: number; // Institutional Co-Curricular Activity Credits
  certificate: HackathonCertificate;
  technologiesUsed: string[];
  repoUrl?: string;
  demoUrl?: string;
  facultyEndorsement?: {
    endorsedBy: string;
    endorsedAt: string;
    remarks: string;
    naacCriteria: string;
  };
}

export interface UploadedCertificate {
  id: string;
  student_id: string;
  certificate_name: string;
  certificate_type: string;
  file_name: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  created_at: string;
  download_url?: string;
  public_url?: string;
}

export interface CertificateUploadPayload {
  student_id: string;
  certificate_name: string;
  certificate_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_data_base64: string; // Base64 data for storage upload
}
