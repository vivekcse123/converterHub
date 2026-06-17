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
    plan:                   'free' | 'monthly' | 'yearly';
    status:                 'free' | 'active' | 'past_due' | 'cancelled' | 'expired';
    razorpaySubscriptionId?: string;
    currentPeriodStart?:    string;
    currentPeriodEnd?:      string;
    cancelAtPeriodEnd?:     boolean;
    resumeCount?:           number;
    totalDownloads?:        number;
    grantedByAdmin?:        boolean;
    adminNotes?:            string;
    adminGrantedAt?:        string;
  };
  usage?: {
    conversionsToday:   number;
    aiRequestsToday:    number;
    totalConversions:   number;
    totalFilesUploaded: number;
  };
  templatePurchases?: { templateId: string; purchasedAt: string }[];
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
