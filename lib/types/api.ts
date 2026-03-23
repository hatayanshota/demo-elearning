// ==================== Enums ====================

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type ChurnRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type AssignmentStatus = "PENDING" | "REVIEWED";

export type AttendanceType = "ONLINE" | "ONSITE";

export type ActivityType =
  | "LOGIN"
  | "LESSON_VIEW"
  | "ASSIGNMENT_SUBMIT"
  | "SEMINAR_REGISTER";

// ==================== Models ====================

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
};

export type StudentProfile = {
  id: string;
  userId: string;
  age: number | null;
  gender: Gender | null;
  occupation: string | null;
  prefecture: string | null;
  enrolledAt: string;
  churnRiskScore: number;
  churnRiskLevel: ChurnRiskLevel;
  lastLoginAt: string | null;
  lineName: string | null;
  chatworkName: string | null;
  meetName: string | null;
  isSalonMember: boolean;
};

export type Course = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  sortOrder: number;
  createdAt: string;
};

export type Section = {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
};

export type Lesson = {
  id: string;
  sectionId: string;
  title: string;
  videoUrl: string | null;
  durationSeconds: number | null;
  sortOrder: number;
  hasAssignment: boolean;
  assignmentDescription: string | null;
};

export type Chapter = {
  id: string;
  lessonId: string;
  title: string;
  startSeconds: number;
  sortOrder: number;
  summary?: string;
};

export type LessonProgress = {
  id: string;
  userId: string;
  lessonId: string;
  watchedSeconds: number;
  isCompleted: boolean;
  completedAt: string | null;
  updatedAt: string;
};

export type Assignment = {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  status: AssignmentStatus;
  submittedAt: string;
};

export type Review = {
  id: string;
  assignmentId: string;
  reviewerId: string;
  feedback: string;
  rating: number | null;
  reviewedAt: string;
};

export type Seminar = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  onlineUrl: string | null;
  capacity: number | null;
  createdAt: string;
};

export type SeminarRegistration = {
  id: string;
  userId: string;
  seminarId: string;
  attendanceType: AttendanceType;
  registeredAt: string;
};

export type ActivityLog = {
  id: string;
  userId: string;
  type: ActivityType;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

// ==================== Composite / View Types ====================

export type StudentWithProfile = User & {
  profile: StudentProfile;
  progressRate: number;
};

export type CourseWithProgress = Course & {
  totalLessons: number;
  completedLessons: number;
  progressRate: number;
};

export type SectionWithLessons = Section & {
  lessons: LessonWithProgress[];
};

export type LessonWithProgress = Lesson & {
  progress: LessonProgress | null;
  isLocked: boolean;
  chapters: Chapter[];
  assignment?: { status: "PENDING" | "REVIEWED" } | null;
};

export type AssignmentWithDetails = Assignment & {
  studentName: string;
  studentAvatarUrl: string | null;
  lessonTitle: string;
  review: Review | null;
};

export type SeminarWithRegistration = Seminar & {
  registration: SeminarRegistration | null;
  onlineCount: number;
  onsiteCount: number;
};

export type StudentDetail = StudentWithProfile & {
  churnFactors: ChurnFactors;
  progressTimeline: ProgressTimelineItem[];
  activityLogs: ActivityLog[];
};

export type ChurnFactors = {
  loginFrequency: number;
  assignmentInterval: number;
  seminarParticipationRate: number;
};

export type ProgressTimelineItem = {
  date: string;
  label: string;
  type: "enrollment" | "assignment_complete" | "current";
};

// ==================== KPI Types ====================

export type KpiSummary = {
  totalStudents: number;
  activeRate: number;
  assignmentCompletionRate: number;
  averageCompletionDays: number;
  seminarParticipationRate: number;
  highChurnRiskCount: number;
  recentCompletionCount: number;
  newEnrollmentCount: number;
};

export type KpiCharts = {
  ageDistribution: ChartDataItem[];
  genderDistribution: ChartDataItem[];
  occupationDistribution: ChartDataItem[];
  regionDistribution: ChartDataItem[];
  seminarTrend: SeminarTrendItem[];
  assignmentBottleneck: ChartDataItem[];
  completionDaysHistogram: ChartDataItem[];
  activeTrend: ActiveTrendItem[];
};

export type ChartDataItem = {
  label: string;
  value: number;
};

export type SeminarTrendItem = {
  month: string;
  online: number;
  onsite: number;
};

export type ActiveTrendItem = {
  week: string;
  count: number;
};

export type Announcement = {
  id: string;
  title: string;
  date: string;
  summary: string;
};

// ==================== Request / Response Types ====================

export type StudentsListParams = {
  search?: string;
  riskLevel?: ChurnRiskLevel;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  perPage?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};
