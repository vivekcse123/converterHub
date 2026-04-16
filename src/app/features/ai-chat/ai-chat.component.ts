import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/services/ai.service';
import { NotificationService } from '../../core/services/notification.service';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">Chat with PDF</h1>
      <p class="text-slate-500 text-sm mb-6">Upload a PDF and ask questions about its content using AI.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col" style="height: 70vh">
        <!-- Upload header -->
        <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <div (click)="fi.click()" class="cursor-pointer px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:border-indigo-400 transition-colors">
            {{ fileName() || 'Upload PDF' }}
          </div>
          <input #fi type="file" accept=".pdf" class="hidden" (change)="onFile($event)" />
          @if (uploading()) { <span class="text-xs text-indigo-500 animate-pulse">Uploading...</span> }
          @if (sessionId()) { <span class="text-xs text-emerald-500">Ready to chat</span> }
        </div>

        <!-- Messages -->
        <div #msgBox class="flex-1 overflow-y-auto p-5 space-y-3">
          @for (m of messages(); track $index) {
          <div [class]="m.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
            <div [class]="m.role === 'user'
              ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-lg text-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-lg text-sm whitespace-pre-wrap'">
              {{ m.content }}
            </div>
          </div>
          }
          @if (thinking()) {
          <div class="flex justify-start">
            <div class="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 text-sm text-slate-400 animate-pulse">Thinking...</div>
          </div>
          }
        </div>

        <!-- Input -->
        <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
          <input type="text" [(ngModel)]="question" (keydown.enter)="send()"
                 placeholder="Ask a question about the PDF..."
                 [disabled]="!sessionId() || thinking()"
                 class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm disabled:opacity-50" />
          <button (click)="send()" [disabled]="!sessionId() || !question.trim() || thinking()"
                  class="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AiChatComponent {
  readonly messages  = signal<ChatMessage[]>([]);
  readonly fileName  = signal<string>('');
  readonly sessionId = signal<string>('');
  readonly uploading = signal(false);
  readonly thinking  = signal(false);
  question = '';
  private history: { role: string; content: string }[] = [];

  constructor(private ai: AiService, private notify: NotificationService) {}

  onFile(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.fileName.set(f.name);
    this.uploading.set(true);
    this.messages.set([]);
    this.history = [];
    this.ai.uploadForChat(f).subscribe({
      next: (r) => { this.sessionId.set(r.data.sessionId); this.uploading.set(false); },
      error: (err) => { this.notify.error(err?.error?.message || 'Upload failed'); this.uploading.set(false); },
    });
  }

  send(): void {
    const q = this.question.trim();
    if (!q || !this.sessionId() || this.thinking()) return;
    this.question = '';
    this.messages.update(m => [...m, { role: 'user', content: q }]);
    this.thinking.set(true);
    this.ai.chat(this.sessionId(), q, this.history).subscribe({
      next: (r) => {
        const answer = r.data.answer;
        this.history.push({ role: 'user', content: q }, { role: 'assistant', content: answer });
        this.messages.update(m => [...m, { role: 'assistant', content: answer }]);
        this.thinking.set(false);
      },
      error: (err) => { this.notify.error(err?.error?.message || 'AI request failed'); this.thinking.set(false); },
    });
  }
}
