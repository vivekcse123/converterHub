import { Injectable, signal, computed } from ''@angular/core'';
import { Router } from ''@angular/router'';
import { Observable, tap, throwError, catchError, switchMap } from ''rxjs'';
import { ApiService } from ''./api.service'';
import { User, AuthResponse } from ''../models/user.model'';

@Injectable({ providedIn: ''root'' })
export class AuthService {
  private readonly TOKEN_KEY   = ''ch_access_token'';
  private readonly REFRESH_KEY = ''ch_refresh_token'';
  private readonly USER_KEY    = ''ch_user'';

  private _user  = signal<User | null>(this.loadStoredUser());
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  readonly user        = this._user.asReadonly();
  readonly token       = this._token.asReadonly();
  readonly isLoggedIn  = computed(() => !!this._token());
  readonly isAdmin     = computed(() => [''admin'',''superadmin''].includes(this._user()?.role ?? ''''));
  readonly isPremium   = computed(() => [''premium'',''admin'',''superadmin''].includes(this._user()?.role ?? ''''));
  readonly currentPlan = computed(() => this._user()?.subscription?.plan ?? ''free'');

  constructor(private api: ApiService, private router: Router) {}

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(''auth/register'', { name, email, password }).pipe(
      tap((res) => this.persistSession(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(''auth/login'', { email, password }).pipe(
      tap((res) => this.persistSession(res)));
  }

  logout(): void {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    if (refreshToken) {
      this.api.post(''auth/logout'', { refreshToken }).subscribe({ error: () => {} });
    }
    this.clearSession();
    this.router.navigate([ ''/'' ]);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    if (!refreshToken) return throwError(() => new Error(''No refresh token''));
    return this.api.post<any>(''auth/refresh'', { refreshToken }).pipe(
      tap((res) => {
        const data = res.data || res;
        const at = data.accessToken || data.token;
        const rt = data.refreshToken;
        if (at) { localStorage.setItem(this.TOKEN_KEY, at); this._token.set(at); }
        if (rt)   localStorage.setItem(this.REFRESH_KEY, rt);
      }),
      catchError((err) => { this.clearSession(); return throwError(() => err); })
    );
  }

  getMe(): Observable<{ data: { user: User } }> {
    return this.api.get<{ data: { user: User } }>(''auth/me'').pipe(
      tap((res) => {
        this._user.set(res.data.user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
      }));
  }

  updateProfile(data: { name?: string; timezone?: string }): Observable<any> {
    return this.api.patch<any>(''auth/profile'', data).pipe(
      tap((res) => {
        if (res?.data?.user) {
          this._user.set(res.data.user);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
        }
      })
    );
  }

  private persistSession(res: AuthResponse): void {
    const { user, accessToken, token, refreshToken } = res.data;
    const at = accessToken || token;
    localStorage.setItem(this.TOKEN_KEY,   at);
    if (refreshToken) localStorage.setItem(this.REFRESH_KEY, refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._token.set(at);
    this._user.set(user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
    this._token.set(null);
  }

  private loadStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
