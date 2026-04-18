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
}

export interface TrendingTool {
  tool:     string;
  count:    number;
  lastUsed: string;
}
