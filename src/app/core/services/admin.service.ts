import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  AdminStats, ToolStat, DailyStat, QueueStats, Plan, AdminUser, TrendingTool,
  AdminPermissions, AdminPortfolio, AdminConversion, AdminPayment, ActivityLogEntry, SiteConfig,
} from '../models/admin.model';
import { PaginatedApiResponse, ApiResponse } from '../models/user.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers(params: Record<string, string> = {}): Observable<PaginatedApiResponse<User>> {
    const query = new URLSearchParams(params).toString();
    return this.api.get<PaginatedApiResponse<User>>(`admin/users${query ? '?' + query : ''}`);
  }

  getUser(id: string): Observable<ApiResponse<{ user: AdminUser; totalConversions: number }>> {
    return this.api.get<ApiResponse<any>>(`admin/users/${id}`);
  }

  createUser(data: Partial<User> & { password: string }): Observable<ApiResponse<{ user: User }>> {
    return this.api.post<ApiResponse<any>>('admin/users', data);
  }

  updateUser(id: string, data: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.api.patch<ApiResponse<any>>(`admin/users/${id}`, data);
  }

  deleteUser(id: string): Observable<ApiResponse<unknown>> {
    return this.api.delete<ApiResponse<unknown>>(`admin/users/${id}`);
  }

  suspendUser(id: string, hours = 24, reason?: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/suspend`, { hours, reason });
  }

  unsuspendUser(id: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/unsuspend`, {});
  }

  banUser(id: string, reason?: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/ban`, { reason });
  }

  unbanUser(id: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/unban`, {});
  }

  resetUserUsage(id: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/reset-usage`, {});
  }

  grantPro(id: string, data: { plan: string; expiryDate?: string; notes?: string }): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/grant-pro`, data);
  }

  removePro(id: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/remove-pro`, {});
  }

  extendSubscription(id: string, data: { days?: number; months?: number; reason?: string }): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/extend-subscription`, data);
  }

  getUserPayments(id: string): Observable<ApiResponse<{ payments: any[] }>> {
    return this.api.get<ApiResponse<any>>(`admin/users/${id}/payments`);
  }

  getDetailedSubscriptionStats(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>('admin/analytics/subscription-stats');
  }

  getRevenue(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>('admin/analytics/revenue');
  }

  // ── Analytics ──────────────────────────────────────────────────────────────
  getOverview(): Observable<ApiResponse<AdminStats>> {
    return this.api.get<ApiResponse<AdminStats>>('admin/analytics/overview');
  }

  // Backend reads `days`, not `limit` — fixed to match admin.controller.js's getToolStats.
  getToolStats(days = 30): Observable<ApiResponse<{ stats: ToolStat[]; days: number }>> {
    return this.api.get<ApiResponse<any>>(`admin/analytics/tools?days=${days}`);
  }

  getDailyStats(days = 30): Observable<ApiResponse<{ conversions: (DailyStat & { conversions: number; failed: number })[]; users: { _id: string; newUsers: number }[] }>> {
    return this.api.get<ApiResponse<any>>(`admin/analytics/daily?days=${days}`);
  }

  getSubscriptionStats(): Observable<ApiResponse<{ stats: Array<{ _id: string; count: number }> }>> {
    return this.api.get<ApiResponse<any>>('admin/analytics/subscriptions');
  }

  getTrending(limit = 10, days = 7): Observable<ApiResponse<{ trending: TrendingTool[]; days: number }>> {
    return this.api.get<ApiResponse<any>>(`admin/analytics/trending?limit=${limit}&days=${days}`);
  }

  // ── Queue ──────────────────────────────────────────────────────────────────
  getQueueStats(): Observable<ApiResponse<{ stats: QueueStats; available: boolean }>> {
    return this.api.get<ApiResponse<any>>('admin/queue/stats');
  }

  getFailedJobs(): Observable<ApiResponse<unknown[]>> {
    return this.api.get<ApiResponse<any>>('admin/queue/failed');
  }

  retryJob(jobId: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/queue/jobs/${jobId}/retry`, {});
  }

  removeJob(jobId: string): Observable<ApiResponse<unknown>> {
    return this.api.delete<ApiResponse<unknown>>(`admin/queue/jobs/${jobId}`);
  }

  // ── Error Logs ─────────────────────────────────────────────────────────────
  getErrorLogs(limit = 100): Observable<ApiResponse<unknown[]>> {
    return this.api.get<ApiResponse<any>>(`admin/logs/errors?limit=${limit}`);
  }

  // ── Plans ──────────────────────────────────────────────────────────────────
  getPlans(): Observable<ApiResponse<Plan[]>> {
    return this.api.get<ApiResponse<any>>('admin/plans');
  }

  updatePlan(id: string, data: Partial<Plan>): Observable<ApiResponse<Plan>> {
    return this.api.put<ApiResponse<any>>(`admin/plans/${id}`, data);
  }

  // ── Permissions ────────────────────────────────────────────────────────────
  getMyPermissions(): Observable<ApiResponse<AdminPermissions>> {
    return this.api.get<ApiResponse<any>>('admin/me/permissions');
  }

  // ── Portfolios ─────────────────────────────────────────────────────────────
  getPortfolios(params: Record<string, string> = {}): Observable<PaginatedApiResponse<AdminPortfolio>> {
    const query = new URLSearchParams(params).toString();
    return this.api.get<PaginatedApiResponse<AdminPortfolio>>(`admin/portfolios${query ? '?' + query : ''}`);
  }

  getPortfolio(id: string): Observable<ApiResponse<{ portfolio: AdminPortfolio }>> {
    return this.api.get<ApiResponse<any>>(`admin/portfolios/${id}`);
  }

  featurePortfolio(id: string, featured: boolean): Observable<ApiResponse<{ portfolio: AdminPortfolio }>> {
    return this.api.patch<ApiResponse<any>>(`admin/portfolios/${id}/feature`, { featured });
  }

  hidePortfolio(id: string, isHidden: boolean, reason?: string): Observable<ApiResponse<{ portfolio: AdminPortfolio }>> {
    return this.api.patch<ApiResponse<any>>(`admin/portfolios/${id}/hide`, { isHidden, reason });
  }

  deletePortfolio(id: string): Observable<ApiResponse<unknown>> {
    return this.api.delete<ApiResponse<unknown>>(`admin/portfolios/${id}`);
  }

  // ── File Conversions ───────────────────────────────────────────────────────
  getConversions(params: Record<string, string> = {}): Observable<PaginatedApiResponse<AdminConversion>> {
    const query = new URLSearchParams(params).toString();
    return this.api.get<PaginatedApiResponse<AdminConversion>>(`admin/conversions${query ? '?' + query : ''}`);
  }

  getConversion(id: string): Observable<ApiResponse<{ conversion: AdminConversion }>> {
    return this.api.get<ApiResponse<any>>(`admin/conversions/${id}`);
  }

  getAllJobs(): Observable<ApiResponse<unknown[]>> {
    return this.api.get<ApiResponse<any>>('admin/jobs');
  }

  // ── Payments ───────────────────────────────────────────────────────────────
  getPayments(params: Record<string, string> = {}): Observable<PaginatedApiResponse<AdminPayment>> {
    const query = new URLSearchParams(params).toString();
    return this.api.get<PaginatedApiResponse<AdminPayment>>(`admin/payments${query ? '?' + query : ''}`);
  }

  getPayment(id: string): Observable<ApiResponse<{ payment: AdminPayment }>> {
    return this.api.get<ApiResponse<any>>(`admin/payments/${id}`);
  }

  refundPayment(id: string, data: { amount?: number; reason?: string }): Observable<ApiResponse<{ payment: AdminPayment }>> {
    return this.api.post<ApiResponse<any>>(`admin/payments/${id}/refund`, data);
  }

  // ── Activity Logs ──────────────────────────────────────────────────────────
  getActivityLogs(params: Record<string, string> = {}): Observable<PaginatedApiResponse<ActivityLogEntry>> {
    const query = new URLSearchParams(params).toString();
    return this.api.get<PaginatedApiResponse<ActivityLogEntry>>(`admin/activity-logs${query ? '?' + query : ''}`);
  }

  // ── Site branding ──────────────────────────────────────────────────────────
  getSiteConfig(): Observable<ApiResponse<{ config: SiteConfig }>> {
    return this.api.get<ApiResponse<any>>('admin/settings/site-config');
  }

  updateSiteConfig(data: Partial<SiteConfig>): Observable<ApiResponse<{ config: SiteConfig }>> {
    return this.api.put<ApiResponse<any>>('admin/settings/site-config', data);
  }
}
