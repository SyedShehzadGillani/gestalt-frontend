export interface PollQuestion {
  id: number;
  category: string;
  text: string;
  impactMessage?: string;
}

export interface PollResponse {
  questionId: number;
  answer: boolean;
  responseTime: number; // milliseconds
}

export interface PollSubmission {
  id: string;
  pollType: "framework" | "focus" | "formula";
  respondentType: "owner" | "employee";
  respondentEmail?: string;
  responses: PollResponse[];
  confidenceRating: number; // 1-10
  totalTime: number; // milliseconds
  completedAt: string;
}

export interface PollInvite {
  id: string;
  pollType: "framework" | "focus" | "formula";
  clientId: string;
  clientName: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  isMandatory: boolean;
  respondents: {
    email: string;
    status: "pending" | "completed";
    completedAt?: string;
  }[];
}

export interface PollSummary {
  pollType: "framework" | "focus" | "formula";
  totalResponses: number;
  avgConfidenceRating: number;
  avgResponseTime: number;
  questionMetrics: {
    questionId: number;
    yesPercentage: number;
    avgResponseTime: number;
    responseTimes: number[];
  }[];
  completionRate: number;
}
