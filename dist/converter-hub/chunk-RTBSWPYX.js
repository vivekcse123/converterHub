import {
  HttpClient,
  HttpEventType,
  HttpRequest,
  catchError,
  map,
  signal,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZFM7PJ4E.js";

// src/environments/environment.ts
var environment = {
  production: false,
  apiUrl: "http://localhost:5000/api"
};

// src/app/core/services/api.service.ts
var ApiService = /* @__PURE__ */ (() => {
  class ApiService2 {
    constructor(http) {
      this.http = http;
      this.base = environment.apiUrl;
    }
    get(path) {
      return this.http.get(`${this.base}/${path}`);
    }
    post(path, body) {
      return this.http.post(`${this.base}/${path}`, body);
    }
    /**
     * Upload files with progress tracking.
     * @returns Observable that emits progress (0–100) then the response.
     */
    uploadWithProgress(path, formData) {
      const req = new HttpRequest("POST", `${this.base}/${path}`, formData, {
        reportProgress: true
      });
      return this.http.request(req).pipe(map((event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          return {
            progress: Math.round(100 * event.loaded / event.total)
          };
        }
        if (event.type === HttpEventType.Response) {
          return {
            progress: 100,
            result: event.body
          };
        }
        return {
          progress: 0
        };
      }), catchError((err) => throwError(() => err)));
    }
    delete(path) {
      return this.http.delete(`${this.base}/${path}`);
    }
    static {
      this.\u0275fac = function ApiService_Factory(t) {
        return new (t || ApiService2)(\u0275\u0275inject(HttpClient));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: ApiService2,
        factory: ApiService2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return ApiService2;
})();

// src/app/core/services/notification.service.ts
var NotificationService = /* @__PURE__ */ (() => {
  class NotificationService2 {
    constructor() {
      this.notifications = signal([]);
      this.counter = 0;
    }
    show(type, title, message = "", duration = 4e3) {
      const id = ++this.counter;
      this.notifications.update((n) => [...n, {
        id,
        type,
        title,
        message
      }]);
      if (duration > 0)
        setTimeout(() => this.dismiss(id), duration);
    }
    success(title, message = "") {
      this.show("success", title, message);
    }
    error(title, message = "") {
      this.show("error", title, message, 6e3);
    }
    info(title, message = "") {
      this.show("info", title, message);
    }
    warning(title, message = "") {
      this.show("warning", title, message);
    }
    dismiss(id) {
      this.notifications.update((n) => n.filter((x) => x.id !== id));
    }
    static {
      this.\u0275fac = function NotificationService_Factory(t) {
        return new (t || NotificationService2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: NotificationService2,
        factory: NotificationService2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return NotificationService2;
})();

export {
  ApiService,
  NotificationService
};
//# sourceMappingURL=chunk-RTBSWPYX.js.map
