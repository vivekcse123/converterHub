export interface User {
  _id:         string;
  name:        string;
  email:       string;
  role:        'user' | 'premium' | 'admin' | 'superadmin';
  isActive:    boolean;
  isBanned:    boolean;
  isSuspended: boolean;
  banReason?:  string;
  subscription?: {
    plan:   'free' | 'pro' | 'team' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired' | 'trialing';
    currentPeriodEnd?: string;
  };
  usage?: {
    conversionsToday:   number;
    aiRequestsToday:    number;
    totalConversions:   number;
    totalFilesUploaded: number;
  };
  lastLoginAt?:  string;
  loginCount?:   number;
  adminNotes?:   string;
  createdAt:     string;
  updatedAt:     string;
}

export interface AuthResponse {
  success:      boolean;
  message:      string;
  data: {
    user:         User;
    accessToken:  string;
    refreshToken: string;
    token:        string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data:    T;
}

export interface PaginatedApiResponse<T = unknown> {
  success:    boolean;
  message:    string;
  data:       T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}
