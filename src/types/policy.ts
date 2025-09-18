export interface Policy {
  id: string;
  app_name: string;
  developer?: string;
  policy_url?: string;
  raw_text: string;
  ai_summary?: {
    risk_score?: number;
    data_collected?: string[];
    retention?: string;
    sharing_practices?: string[];
    user_rights?: string[];
    [key: string]: any;
  };
  is_verified: boolean;
  submitted_by: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PolicySubmissionRequest {
  app_name: string;
  developer?: string;
  policy_url?: string;
  raw_text: string;
}

export interface PolicySubmissionResponse {
  success: boolean;
  data?: Policy;
  error?: string;
  message?: string;
}
