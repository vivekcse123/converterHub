import {
  Router
} from "./chunk-WRRIZNNP.js";
import {
  ApiService
} from "./chunk-RTBSWPYX.js";
import {
  computed,
  signal,
  tap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZFM7PJ4E.js";

// src/app/core/services/auth.service.ts
var AuthService = /* @__PURE__ */ (() => {
  class AuthService2 {
    constructor(api, router) {
      this.api = api;
      this.router = router;
      this.TOKEN_KEY = "ch_token";
      this.USER_KEY = "ch_user";
      this._user = signal(this.loadStoredUser());
      this._token = signal(localStorage.getItem(this.TOKEN_KEY));
      this.user = this._user.asReadonly();
      this.token = this._token.asReadonly();
      this.isLoggedIn = computed(() => !!this._token());
      this.isAdmin = computed(() => this._user()?.role === "admin");
    }
    register(name, email, password) {
      return this.api.post("auth/register", {
        name,
        email,
        password
      }).pipe(tap((res) => this.persistSession(res)));
    }
    login(email, password) {
      return this.api.post("auth/login", {
        email,
        password
      }).pipe(tap((res) => this.persistSession(res)));
    }
    logout() {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      this._user.set(null);
      this._token.set(null);
      this.router.navigate(["/"]);
    }
    getMe() {
      return this.api.get("auth/me").pipe(tap((res) => {
        this._user.set(res.data.user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
      }));
    }
    persistSession(res) {
      const {
        user,
        token
      } = res.data;
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this._token.set(token);
      this._user.set(user);
    }
    loadStoredUser() {
      try {
        const raw = localStorage.getItem(this.USER_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
    static {
      this.\u0275fac = function AuthService_Factory(t) {
        return new (t || AuthService2)(\u0275\u0275inject(ApiService), \u0275\u0275inject(Router));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: AuthService2,
        factory: AuthService2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return AuthService2;
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-5HGKPEKX.js.map
