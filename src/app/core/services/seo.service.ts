import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';

const BASE_TITLE = 'ApnaConverter — Free Online File Converter';
const BASE_DESC  = 'Convert PDFs, images, Word documents and more — free, fast, and secure. 30+ tools.';
const SITE_URL   = 'https://converterhub.app';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta   = inject(Meta);
  private title  = inject(Title);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  init(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let child = this.route;
        while (child.firstChild) child = child.firstChild;
        return child.snapshot;
      })
    ).subscribe(snapshot => {
      const t = snapshot.title || BASE_TITLE;
      const description = (snapshot.data['description'] as string) || BASE_DESC;
      const url = SITE_URL + this.router.url;

      this.title.setTitle(t);
      this.meta.updateTag({ name: 'description',       content: description });
      this.meta.updateTag({ property: 'og:title',       content: t });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'og:url',         content: url });
      this.meta.updateTag({ rel: 'canonical',            href: url });
    });
  }
}
