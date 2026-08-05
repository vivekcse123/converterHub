import { User } from './user.model';

export interface AdminStats {
  users: {
    total:  number;
    today:  number;
    week:   number;
    month:  number;
    active: number;
  };
  conversions: {
    total:  number;
    today:  number;
    week:   number;
    month:  number;
    failed: number;
  };
}

export interface ToolStat {
  _id:     string;
  count:   number;
  failed:  number;
  avgTime: number;
}

export interface DailyStat {
  _id:   string;   // date "YYYY-MM-DD"
  count: number;
}

export interface QueueStats {
  waiting:   number;
  active:    number;
  completed: number;
  failed:    number;
  delayed:   number;
}

export interface Plan {
  id:          string;
  name:        string;
  description: string;
  price: { monthly: number; yearly: number };
  limits: {
    maxFileSizeMb?:     number;
    conversionsPerDay?: number;
    aiRequestsPerDay?:  number;
    maxBatchFiles?:     number;
    maxFilesPerBatch?:  number;
  };
  features:  string[];
  isActive:  boolean;
  sortOrder: number;
}

export interface AdminUser extends User {
  totalConversions?: number;
  lastLoginIp?: string;
  loginHistory?: { ip: string; userAgent: string; at: string }[];
}

export interface TrendingTool {
  tool:     string;
  count:    number;
  lastUsed: string;
}

// ── Admin panel RBAC ────────────────────────────────────────────────────────
export interface AdminPermissions {
  role: string;
  permissions: string[];
}

// ── Portfolios ───────────────────────────────────────────────────────────────
export interface AdminPortfolio {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  username: string;
  displayName?: string;
  tagline?: string;
  isPublic: boolean;
  status: 'draft' | 'published';
  views: number;
  featured: boolean;
  isHidden: boolean;
  hiddenReason?: string;
  deletedAt: string | null;
  metaTitle?: string;
  metaDescription?: string;
  theme?: { templateId: string };
  createdAt: string;
  updatedAt: string;
}

// ── File Conversions ─────────────────────────────────────────────────────────
export interface AdminConversion {
  _id: string;
  user?: { _id: string; name: string; email: string };
  sessionId: string;
  tool: string;
  status: 'processing' | 'completed' | 'failed';
  errorMessage?: string;
  processingTimeMs?: number;
  inputSizeBytes?: number;
  outputSizeBytes?: number;
  ipAddress?: string;
  createdAt: string;
}

// ── Payments ─────────────────────────────────────────────────────────────────
export interface AdminPayment {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  amount: number; // paise
  currency: string;
  plan: 'monthly' | 'yearly' | 'lifetime';
  status: 'captured' | 'failed' | 'refunded';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  invoiceNumber?: string;
  refund?: {
    amount: number; reason: string; refundedAt: string;
    refundedBy: string; razorpayRefundId: string;
  };
  createdAt: string;
}

// ── Activity Logs ────────────────────────────────────────────────────────────
export interface ActivityLogEntry {
  _id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

// ── Site branding ────────────────────────────────────────────────────────────
export interface SiteConfig {
  _id?: string;
  siteName: string;
  logoUrl: string;
  supportEmail: string;
  social: { twitter?: string; linkedin?: string; github?: string };
}
