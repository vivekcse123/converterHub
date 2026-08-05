import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, effect, input, output, signal } from '@angular/core';

/**
 * Minimal contenteditable rich-text field — Bold / Italic / Link only.
 * Uses document.execCommand: deprecated but still the only zero-dependency way
 * to get real inline formatting without pulling in a full editor library for
 * two fields (About body, project descriptions).
 */
@Component({
  selector: 'app-rich-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="flex items-center gap-0.5 mb-1.5">
      <button type="button" (mousedown)="$event.preventDefault()" (click)="exec('bold')"
        class="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200" title="Bold">B</button>
      <button type="button" (mousedown)="$event.preventDefault()" (click)="exec('italic')"
        class="w-6 h-6 rounded-md flex items-center justify-center text-xs italic text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200" title="Italic">I</button>
      <button type="button" (mousedown)="onLinkMousedown()" (click)="linkOpen.set(!linkOpen())"
        class="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200" title="Link">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 007.07 0l2-2a5 5 0 00-7.07-7.07l-1 1M14 11a5 5 0 00-7.07 0l-2 2a5 5 0 007.07 7.07l1-1"/></svg>
      </button>
      @if (linkOpen()) {
        <input #linkInput type="url" placeholder="https://…" autofocus
          class="ml-1 px-2 py-0.5 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-slate-800 text-[11px] outline-none w-36"
          (keydown.enter)="applyLink(linkInput.value); linkInput.value = ''"
          (keydown.escape)="linkOpen.set(false)" />
      }
    </div>
    <div #editor contenteditable="true" [attr.data-placeholder]="placeholder()"
      class="rich-text-editable min-h-[2.5em] outline-none border border-transparent hover:border-dashed hover:border-slate-300 dark:hover:border-slate-600
             focus:border-solid focus:border-primary-400 rounded-lg px-2 -mx-2 py-1 transition-colors"
      [class]="textClass()"
      (input)="onInput(editor.innerHTML)"
      (blur)="onInput(editor.innerHTML)">
    </div>
  `,
  styles: [`
    .rich-text-editable:empty:before { content: attr(data-placeholder); color: theme('colors.slate.400'); }
    .rich-text-editable a { text-decoration: underline; color: inherit; opacity: 0.85; }
  `],
})
export class RichTextFieldComponent {
  value = input('');
  placeholder = input('');
  textClass = input('');
  valueChange = output<string>();

  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  readonly linkOpen = signal(false);
  private savedRange: Range | null = null;
  /** Tracks the last value this component itself emitted, so the sync effect
   *  below can tell "external change (e.g. AI rewrite)" apart from "my own
   *  keystroke echoing back through the store" and only touch the DOM for the
   *  former — overwriting innerHTML on every keystroke would reset the caret. */
  private lastEmitted: string | null = null;

  constructor() {
    effect(() => {
      const incoming = this.value();
      if (incoming === this.lastEmitted) return;
      const el = this.editorRef?.nativeElement;
      if (el && el.innerHTML !== incoming) el.innerHTML = incoming;
    });
  }

  ngAfterViewInit(): void {
    // The effect above skips its first run (editorRef isn't ready in the
    // constructor) — populate the initial content explicitly once the view exists.
    this.editorRef.nativeElement.innerHTML = this.value();
  }

  exec(command: string): void {
    document.execCommand(command, false);
    this.editorRef.nativeElement.focus();
    this.onInput(this.editorRef.nativeElement.innerHTML);
  }

  onLinkMousedown(): void {
    const sel = window.getSelection();
    this.savedRange = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
  }

  applyLink(url: string): void {
    this.linkOpen.set(false);
    if (!url.trim()) return;
    const sel = window.getSelection();
    if (sel && this.savedRange) {
      sel.removeAllRanges();
      sel.addRange(this.savedRange);
    }
    document.execCommand('createLink', false, url.trim());
    this.onInput(this.editorRef.nativeElement.innerHTML);
  }

  onInput(html: string): void {
    this.lastEmitted = html;
    this.valueChange.emit(html);
  }
}
