import { toggleBoldMarkup } from '../../templates/shared/rich-text';

/** Shared label class for editor form fields. */
export const LABEL_CLASS = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1';

/** Shared class for the small "B" bold-toggle button shown above bullet/summary textareas. */
export const BOLD_BTN_CLASS =
  'text-xs font-bold w-6 h-6 flex items-center justify-center rounded border border-slate-300 dark:border-slate-600 text-slate-500 hover:text-primary-600 hover:border-primary-400 dark:text-slate-400 dark:hover:text-primary-400 transition-colors';

/**
 * Toggles `**bold**` markup around the current selection of a textarea, updates its value/selection
 * in place, and returns the new value so the caller can persist it to the store.
 */
export function applyBoldToggle(textarea: HTMLTextAreaElement): string {
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const result = toggleBoldMarkup(textarea.value, start, end);
  textarea.value = result.value;
  textarea.focus();
  textarea.setSelectionRange(result.start, result.end);
  return result.value;
}

/** Reads the current string value from an `<input>`/`<textarea>`/`<select>` change/input event. */
export function inputValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
}

/** Reads the current checked state from a checkbox `<input>` event. */
export function inputChecked(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}

/** Counts words in free-text content (used for summary length / ATS hints). */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
