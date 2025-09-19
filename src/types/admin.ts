export interface AdminUser {
  id: string;
  user_id: string;
  access_level: "superadmin" | "moderator" | "admin";
  granted_at: string;
  user_profiles?: {
    name: string;
    user_id: string;
  };
}

export interface PolicyVerification {
  id: string;
  policy_id: string;
  verified_by: string;
  verification_notes?: string;
  created_at: string;
  policies?: {
    app_name: string;
    developer?: string;
    is_verified: boolean;
  };
}

export interface UserManagement {
  name: string;
  email: string;
  phone: string;
  role: string;
  gamesPlayed: number;
  lastPlayed: string | null;
}

export interface ContentModeration {
  id: string;
  content_type: "policy" | "comment" | "user";
  content_id: string;
  action: "approve" | "reject" | "flag" | "ban";
  reason?: string;
  moderated_by: string;
  created_at: string;
}

export interface AdminStats {
  totalPolicies: number;
  pendingVerification: number;
  totalUsers: number;
  activeAdmins: number;
  verificationsToday: number;
  flaggedContent: number;
}
