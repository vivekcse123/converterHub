import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'ch_token';
  private readonly USER_KEY  = 'ch_user';

  // Reactive state via signals
  private _user  = signal<User | null>(this.loadStoredUser());
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  readonly user = this._user.asReadonly();
  readonly token       = this._token.asReadonly();
  readonly isLoggedIn  = computed(() => !!this._token());
  readonly isAdmin     = computed(() => this._user()?.role === 'admin');

  constructor(private api: ApiService, private router: Router) {}

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/register', { name, email, password }).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', { email, password }).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
    this._token.set(null);
    this.router.navigate(['/']);
  }

  getMe(): Observable<{ data: { user: User } }> {
    return this.api.get<{ data: { user: User } }>('auth/me').pipe(
      tap((res) => {
        this._user.set(res.data.user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
      })
    );
  }

  private persistSession(res: AuthResponse): void {
    const { user, token } = res.data;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._token.set(token);
    this._user.set(user);
  }

  private loadStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
