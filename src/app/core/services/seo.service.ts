import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';

const BASE_TITLE = 'ApnaConverter — Free Online File Converter';
const BASE_DESC  = 'Convert PDFs, images, Word documents and more — free, fast, and secure. 30+ tools.';
const SITE_URL   = 'https://www.apnaconverter.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta      = inject(Meta);
  private title     = inject(Title);
  private router    = inject(Router);
  private route     = inject(ActivatedRoute);
  private doc       = inject(DOCUMENT);

  /** Bootstrap automatic per-route SEO updates. Call once in AppComponent.ngOnInit(). */
  init(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let child = this.route;
        while (child.firstChild) child = child.firstChild;
        return child.snapshot;
      })
    ).subscribe(snapshot => {
      const t    = snapshot.title    || BASE_TITLE;
      const desc = (snapshot.data['description'] as string) || BASE_DESC;
      this.setPage({ title: t, description: desc });
    });
  }

  /**
   * Imperatively update all SEO tags for a page.
   * Components that need custom descriptions call this in ngOnInit().
   */
  setPage(opts: { title: string; description: string; canonical?: string }): void {
    const url = opts.canonical ?? (SITE_URL + this.router.url.split('?')[0]);

    this.title.setTitle(opts.title);

    this.meta.updateTag({ name: 'description',        content: opts.description });
    this.meta.updateTag({ property: 'og:title',        content: opts.title });
    this.meta.updateTag({ property: 'og:description',  content: opts.description });
    this.meta.updateTag({ property: 'og:url',          content: url });
    this.meta.updateTag({ name: 'twitter:title',        content: opts.title });
    this.meta.updateTag({ name: 'twitter:description',  content: opts.description });

    // <link rel="canonical"> must be a DOM link element, not a meta tag
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
