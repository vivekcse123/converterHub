import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser, DecimalPipe } from '@angular/common';

interface Stat {
  target: number;
  suffix: string;
  label: string;
  value: ReturnType<typeof signal<number>>;
}

const DURATION_MS = 1200;

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-12 bg-slate-900 dark:bg-slate-950">
      <div class="container-app">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          @for (s of stats; track s.label) {
            <div>
              <p class="text-3xl sm:text-4xl font-bold text-white tabular-nums">{{ s.value() | number }}{{ s.suffix }}</p>
              <p class="text-xs text-slate-400 mt-1.5">{{ s.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class StatsComponent implements AfterViewInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private hasAnimated = false;

  readonly stats: Stat[] = [
    { target: 2500, suffix: '+', label: 'Users', value: signal(0) },
    { target: 18000, suffix: '+', label: 'Files Converted', value: signal(0) },
    { target: 12000, suffix: '+', label: 'Resumes Created', value: signal(0) },
    { target: 600, suffix: '+', label: 'Portfolios Built', value: signal(0) },
    { target: 6, suffix: '+', label: 'Countries', value: signal(0) },
    { target: 94, suffix: '%', label: 'Success Rate', value: signal(0) },
  ];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.stats.forEach((s) => this.animate(s));
          this.observer?.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private animate(stat: Stat): void {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.value.set(Math.round(stat.target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
