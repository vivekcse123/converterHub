import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { ResumeData } from '../../models/resume.model';
import { firstValueFrom } from 'rxjs';

const SITE_URL = 'https://www.apnaconverter.com';

@Component({
  selector: 'app-public-resume',
  standalone: true,
  imports: [CommonModule, RouterLink, ResumePreviewComponent],
  template: `
    @if (loading()) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-500 text-sm">Loading resume…</p>
        </div>
      </div>
    } @else if (notFound()) {
      <div class="min-h-screen flex items-center justify-center p-6">
        <div class="text-center max-w-md">
          <p class="text-6xl mb-4">📄</p>
          <h1 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Resume Not Found</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">This resume link is invalid or has been unpublished by its owner.</p>
          <a routerLink="/resume-builder" class="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-sm font-bold">Build Your Own Resume</a>
        </div>
      </div>
    } @else if (resume()) {
      <!-- Minimal top bar -->
      <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <a routerLink="/" class="text-xs font-bold text-primary-700 dark:text-primary-400">ApnaConverter</a>
        <div class="flex items-center gap-3">
          @if (views() > 0) {
            <span class="text-xs text-slate-400">{{ views() }} view{{ views() !== 1 ? 's' : '' }}</span>
          }
          <a routerLink="/resume-builder" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:opacity-90 transition">Create Your Resume →</a>
        </div>
      </div>

      <!-- Resume -->
      <div class="py-8 px-4 flex flex-col items-center gap-6">
        <div class="text-center">
          <h1 class="text-xl font-extrabold text-slate-900 dark:text-white">{{ resumeName() }}</h1>
          <p class="text-sm text-slate-400 mt-1">Shared via ApnaConverter Resume Builder</p>
        </div>
        <div class="w-full max-w-[820px]">
          <app-resume-preview [resume]="resume()!" />
        </div>
        <div class="text-center py-4">
          <p class="text-sm text-slate-500 mb-3">Like this resume?</p>
          <a routerLink="/resume-builder" class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg">Create Your Own Free Resume</a>
        </div>
      </div>
    }
  `,
})
export class PublicResumeComponent implements OnInit, OnDestroy {
  private route  = inject(ActivatedRoute);
  private api    = inject(ApiService);
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  readonly loading    = signal(true);
  readonly notFound   = signal(false);
  readonly resume     = signal<ResumeData | null>(null);
  readonly resumeName = signal('');
  readonly views      = signal(0);

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    try {
      const res = await firstValueFrom(this.api.get<any>(`public/r/${slug}`));
      if (res.success && res.data?.snapshot) {
        const snap: ResumeData = res.data.snapshot;
        const name = res.data.name ?? 'Resume';
        const ownerName = snap.personal?.fullName || 'Professional';
        const jobTitle  = snap.personal?.jobTitle  || 'Resume';

        this.resume.set(snap);
        this.resumeName.set(name);
        this.views.set(res.data.views ?? 0);

        const pageUrl = `${SITE_URL}/r/${slug}`;
        this.seo.setPage({
          title:       `${ownerName} - ${jobTitle} Resume | ApnaConverter`,
          description: `${ownerName}'s professional ${jobTitle} resume. Created with ApnaConverter's free ATS-friendly resume builder.`,
          canonical:   pageUrl,
          ogType:      'profile',
        });

        this.jsonLd.setJsonLd('public-resume', {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: `${ownerName} - Resume`,
          url: pageUrl,
          mainEntity: {
            '@type': 'Person',
            name: ownerName,
            jobTitle: jobTitle,
            description: snap.summary || undefined,
            email: snap.personal?.email || undefined,
            address: snap.personal?.location ? { '@type': 'PostalAddress', addressLocality: snap.personal.location } : undefined,
            sameAs: [snap.personal?.linkedin, snap.personal?.github, snap.personal?.portfolio].filter(Boolean),
          },
        });

        this.jsonLd.setJsonLd('public-resume-breadcrumb', {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',           item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Resume Builder', item: `${SITE_URL}/resume-builder` },
            { '@type': 'ListItem', position: 3, name: `${ownerName}'s Resume`, item: pageUrl },
          ],
        });
      } else {
        this.notFound.set(true);
      }
    } catch {
      this.notFound.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('public-resume');
    this.jsonLd.removeJsonLd('public-resume-breadcrumb');
  }
}
