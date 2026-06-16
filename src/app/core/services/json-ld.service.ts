import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Manages `<script type="application/ld+json">` tags in the document head.
 * Each call to `setJsonLd` is keyed so a page can register multiple schema
 * blocks (e.g. BreadcrumbList + FAQPage) and update/remove them independently.
 */
@Injectable({ providedIn: 'root' })
export class JsonLdService {
  private readonly doc = inject(DOCUMENT);

  /** Creates or updates the `<script type="application/ld+json" data-jsonld="key">` tag. */
  setJsonLd(key: string, data: object): void {
    let script = this.doc.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${key}"]`);
    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-jsonld', key);
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  /** Removes the JSON-LD script tag registered under `key`, if present. */
  removeJsonLd(key: string): void {
    const script = this.doc.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${key}"]`);
    script?.remove();
  }
}
