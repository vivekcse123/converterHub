import { Component, Input, signal } from '@angular/core';
import { TOOL_CONTENT, ToolContent } from '../../data/tool-content.data';

@Component({
  selector: 'app-tool-info-section',
  standalone: true,
  template: `
    @if (content) {
    <div class="bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-700/50 mt-8">
      <div class="container-app max-w-3xl py-14 space-y-14">

        <!-- How it works -->
        <section>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-10 text-center">How It Works</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
            @for (step of content.steps; track $index) {
            <div class="text-center">
              <div class="w-14 h-14 bg-primary-100 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                {{ step.icon }}
              </div>
              <h3 class="font-semibold text-slate-800 dark:text-white mb-2">{{ step.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ step.desc }}</p>
            </div>
            }
          </div>
        </section>

        <!-- Why use this tool -->
        <section>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Why Use This Tool?</h2>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            @for (point of content.benefits; track $index) {
            <li class="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <span class="text-emerald-500 text-lg leading-none mt-0.5 shrink-0">✓</span>
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ point }}</span>
            </li>
            }
          </ul>
        </section>

        <!-- FAQ -->
        <section>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div class="space-y-3">
            @for (faq of content.faqs; track $index) {
            <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
              <button (click)="toggleFaq($index)"
                      class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <span class="font-medium text-slate-800 dark:text-white text-sm pr-4">{{ faq.q }}</span>
                <span class="text-slate-400 text-xl leading-none shrink-0 select-none">{{ openFaq() === $index ? '−' : '+' }}</span>
              </button>
              @if (openFaq() === $index) {
              <div class="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                {{ faq.a }}
              </div>
              }
            </div>
            }
          </div>
        </section>

      </div>
    </div>
    }
  `,
})
export class ToolInfoSectionComponent {
  @Input() set toolId(id: string) { this.content = TOOL_CONTENT[id] ?? null; }

  content: ToolContent | null = null;
  readonly openFaq = signal<number | null>(null);

  toggleFaq(i: number): void {
    this.openFaq.update(cur => (cur === i ? null : i));
  }
}
