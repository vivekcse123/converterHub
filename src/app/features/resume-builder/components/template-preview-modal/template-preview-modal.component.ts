import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ResumePreviewComponent } from '../preview/resume-preview.component';
import { ResumeTemplateMeta } from '../../data/resume-templates.data';
import { TemplateId } from '../../models/resume.model';
import { SAMPLE_PERSONAS, SamplePersona, createPersonaSample } from '../../data/resume-defaults';

export type PreviewDeviceMode = 'desktop' | 'mobile' | 'a4';

/** Minimum horizontal swipe distance (px) to trigger next/prev navigation. */
const SWIPE_THRESHOLD = 50;

/**
 * Shared full-screen template preview — zoom (via `ResumePreviewComponent`), next/prev
 * navigation through a caller-supplied template list, a desktop/mobile/A4 viewing-frame
 * toggle, and swipe navigation on touch devices. Used by both the gallery's "Quick
 * Preview" and the template-detail page's "Preview Full Resume", so next/prev always
 * respects whatever list the caller is currently looking at (filtered gallery results,
 * or the full catalog from the detail page).
 */
@Component({
  selector: 'app-template-preview-modal',
  standalone: true,
  // Same fix as TemplateDetailComponent: prevents the router-outlet's fade-in animation
  // from creating a stacking context that traps this fixed, high-z-index modal below
  // the sticky site header.
  host: { style: 'animation: none' },
  imports: [CommonModule, ResumePreviewComponent],
  templateUrl: './template-preview-modal.component.html',
  styleUrl: './template-preview-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatePreviewModalComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  /** The navigable set for next/prev — pass the caller's current filtered/full list. */
  readonly templates = input.required<ResumeTemplateMeta[]>();
  readonly initialTemplateId = input.required<TemplateId>();

  readonly closed = output<void>();

  readonly personas = SAMPLE_PERSONAS;
  readonly activePersona = signal<SamplePersona>('software-engineer');
  readonly deviceMode = signal<PreviewDeviceMode>('desktop');

  private readonly activeId = signal<TemplateId | null>(null);

  // Re-seeds the active template whenever the caller hands us a new starting id
  // (e.g. the gallery's Quick Preview button was clicked on a different card).
  private readonly _syncInitialId = effect(() => {
    this.activeId.set(this.initialTemplateId());
  }, { allowSignalWrites: true });

  readonly activeIndex = computed(() => {
    const list = this.templates();
    const id = this.activeId();
    const idx = list.findIndex(t => t.id === id);
    return idx >= 0 ? idx : 0;
  });

  readonly activeMeta = computed<ResumeTemplateMeta | null>(() => this.templates()[this.activeIndex()] ?? null);

  readonly sampleResume = computed(() => {
    const meta = this.activeMeta();
    return meta ? createPersonaSample(this.activePersona(), meta.id) : null;
  });

  readonly canNavigate = computed(() => this.templates().length > 1);

  private touchStartX = 0;
  private touchStartY = 0;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) document.body.style.overflow = '';
  }

  next(): void {
    const list = this.templates();
    if (list.length < 2) return;
    const nextIndex = (this.activeIndex() + 1) % list.length;
    this.activeId.set(list[nextIndex].id as TemplateId);
  }

  prev(): void {
    const list = this.templates();
    if (list.length < 2) return;
    const prevIndex = (this.activeIndex() - 1 + list.length) % list.length;
    this.activeId.set(list[prevIndex].id as TemplateId);
  }

  useTemplate(): void {
    const meta = this.activeMeta();
    if (!meta) return;
    this.router.navigate(['/resume-builder'], { queryParams: { template: meta.id } });
  }

  close(): void {
    this.closed.emit();
  }

  onTouchStart(ev: TouchEvent): void {
    const t = ev.touches[0];
    this.touchStartX = t.clientX;
    this.touchStartY = t.clientY;
  }

  onTouchEnd(ev: TouchEvent): void {
    const t = ev.changedTouches[0];
    const dx = t.clientX - this.touchStartX;
    const dy = t.clientY - this.touchStartY;
    // Ignore mostly-vertical gestures so page scrolling isn't hijacked as a swipe.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) this.next(); else this.prev();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    this.next();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    this.prev();
  }
}
