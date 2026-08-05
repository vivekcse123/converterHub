import { Component, ChangeDetectionStrategy, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { PortfolioAiService, RewriteMode } from '../../services/portfolio-ai.service';

export type AiAssistMode = 'rewrite' | 'generate-bio' | 'generate-project';

interface RewriteAction { mode: RewriteMode; label: string; }

const REWRITE_ACTIONS: RewriteAction[] = [
  { mode: 'improve', label: 'Improve writing' },
  { mode: 'shorten', label: 'Make shorter' },
  { mode: 'expand', label: 'Make longer' },
  { mode: 'professional', label: 'More professional' },
  { mode: 'casual', label: 'More casual' },
  { mode: 'grammar', label: 'Fix grammar' },
];

@Component({
  selector: 'app-ai-assist-button',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative inline-block' },
  template: `
    <button type="button" (click)="toggle($event)"
      class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold
             text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30
             hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
      @if (loading()) {
        <app-icon name="spinner" [size]="12" />
      } @else {
        <span>✨</span>
      }
      AI
    </button>

    @if (open()) {
      <div class="absolute z-30 top-full mt-1.5 left-0 w-48 rounded-xl border border-slate-200 dark:border-slate-700
                  bg-white dark:bg-slate-800 shadow-popover py-1.5 animate-fade-in">
        @if (mode() === 'rewrite') {
          @for (a of actions; track a.mode) {
            <button type="button" (click)="runRewrite(a.mode)"
              class="w-full text-left px-3 py-1.5 text-[12.5px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors">
              {{ a.label }}
            </button>
          }
        } @else {
          <button type="button" (click)="runGenerate()"
            class="w-full text-left px-3 py-1.5 text-[12.5px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors">
            {{ mode() === 'generate-bio' ? 'Write my bio' : 'Write description' }}
          </button>
        }
      </div>
    }
  `,
})
export class AiAssistButtonComponent {
  mode = input<AiAssistMode>('rewrite');
  text = input('');

  // generate-bio context
  name = input<string>('');
  role = input<string>('');
  skills = input<string[]>([]);

  // generate-project context
  title = input<string>('');
  techStack = input<string[]>([]);
  summary = input<string>('');

  result = output<string>();

  private ai = inject(PortfolioAiService);
  private notify = inject(NotificationService);
  private el = inject(ElementRef);

  readonly open = signal(false);
  readonly loading = signal(false);

  readonly actions = REWRITE_ACTIONS;

  toggle(e: Event): void {
    e.stopPropagation();
    if (this.loading()) return;
    this.open.set(!this.open());
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (this.open() && !this.el.nativeElement.contains(e.target)) this.open.set(false);
  }

  async runRewrite(mode: RewriteMode): Promise<void> {
    if (!this.text().trim()) {
      this.notify.warning('Nothing to rewrite', 'Add some text first.');
      this.open.set(false);
      return;
    }
    this.open.set(false);
    this.loading.set(true);
    try {
      const result = await this.ai.rewrite(mode, this.text());
      this.result.emit(result);
    } catch (e: any) {
      this.notify.error('AI request failed', e?.error?.message ?? 'Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async runGenerate(): Promise<void> {
    this.open.set(false);
    this.loading.set(true);
    try {
      const result = this.mode() === 'generate-bio'
        ? await this.ai.generateBio({ name: this.name(), role: this.role(), skills: this.skills() })
        : await this.ai.generateProjectDescription({ title: this.title(), techStack: this.techStack(), summary: this.summary() });
      this.result.emit(result);
    } catch (e: any) {
      this.notify.error('AI request failed', e?.error?.message ?? 'Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
