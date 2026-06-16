/** A run of text with an associated bold flag, used to render `**bold**` markup. */
export interface RichTextRun {
  text: string;
  bold: boolean;
}

/** Splits text on `**bold**` markers into a sequence of plain/bold runs. */
export function parseRichText(text: string): RichTextRun[] {
  const runs: RichTextRun[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    if (match[1]) {
      runs.push({ text: match[1], bold: true });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push({ text: text.slice(lastIndex), bold: false });
  }

  return runs.length ? runs : [{ text, bold: false }];
}

/**
 * Toggles `**bold**` markup around the selected range of `value`.
 * - If the selection is already wrapped in `**`, the markers are removed.
 * - If there's no selection, empty `****` markers are inserted with the cursor placed inside.
 * - Otherwise, the selection is wrapped in `**`.
 */
export function toggleBoldMarkup(value: string, start: number, end: number): { value: string; start: number; end: number } {
  if (start === end) {
    const updated = value.slice(0, start) + '****' + value.slice(end);
    return { value: updated, start: start + 2, end: start + 2 };
  }

  const selected = value.slice(start, end);
  const before = value.slice(Math.max(0, start - 2), start);
  const after = value.slice(end, end + 2);

  if (before === '**' && after === '**') {
    const updated = value.slice(0, start - 2) + selected + value.slice(end + 2);
    return { value: updated, start: start - 2, end: end - 2 };
  }

  if (selected.length >= 4 && selected.startsWith('**') && selected.endsWith('**')) {
    const inner = selected.slice(2, -2);
    const updated = value.slice(0, start) + inner + value.slice(end);
    return { value: updated, start, end: start + inner.length };
  }

  const updated = value.slice(0, start) + '**' + selected + '**' + value.slice(end);
  return { value: updated, start: start + 2, end: end + 2 };
}
