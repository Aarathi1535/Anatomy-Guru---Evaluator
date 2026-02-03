
export interface StudentInfo {
  name: string;
  rollNumber: string;
  subject: string;
  class: string;
  examName: string;
  date: string;
}

export interface QuestionGrade {
  questionNumber: string;
  studentAnswer: string;
  correctAnswer: string;
  marksObtained: number;
  totalMarks: number;
  feedback: string;
}

export interface EvaluationReport {
  studentInfo: StudentInfo;
  grades: QuestionGrade[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  generalFeedback: string;
}

export interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

export interface HistoryItem {
  id: string;
  userId: string;
  timestamp: number;
  report: EvaluationReport;
  sheetsCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  createdAt: number;
}

export interface BillingInfo {
  pendingAmount: number;
  dueDate: string;
  isPaid: boolean;
  sheetsEvaluatedThisMonth: number;
}
