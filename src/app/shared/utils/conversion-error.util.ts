/**
 * Translates raw HTTP / API errors into user-facing messages suitable for
 * display in toast notifications and error banners inside tool components.
 *
 * Usage:
 *   import { getConversionError } from '@app/shared/utils/conversion-error.util';
 *   ...
 *   error: (err) => this.errorMsg = getConversionError(err)
 */
export interface ConversionError {
  /** Short headline shown in the toast / banner title. */
  title: string;
  /** Detailed, actionable explanation for the user. */
  detail: string;
  /** Whether the user can usefully retry right now. */
  retryable: boolean;
}

export function getConversionError(err: unknown): ConversionError {
  const httpErr = err as { status?: number; error?: { message?: string }; message?: string };
  const status = httpErr?.status ?? 0;
  const serverMsg: string = httpErr?.error?.message ?? httpErr?.message ?? '';

  // ── Network-level errors ─────────────────────────────────────────────────────
  if (status === 0 || status === -1) {
    return {
      title: 'Network Error',
      detail: 'Could not reach the server. Please check your internet connection and try again.',
      retryable: true,
    };
  }

  // ── File size ────────────────────────────────────────────────────────────────
  if (status === 413 || /too large|size limit|exceeds/i.test(serverMsg)) {
    return {
      title: 'File Too Large',
      detail: serverMsg || 'Your file exceeds the maximum allowed size. Please use a smaller file (max 50 MB).',
      retryable: false,
    };
  }

  // ── Unsupported file type ────────────────────────────────────────────────────
  if (status === 415 || /unsupported file type|file type/i.test(serverMsg)) {
    return {
      title: 'Unsupported File Type',
      detail: serverMsg || 'This file type is not supported. Please check the accepted formats for this tool.',
      retryable: false,
    };
  }

  // ── Rate limited ─────────────────────────────────────────────────────────────
  if (status === 429) {
    return {
      title: 'Too Many Requests',
      detail: 'You have reached the conversion limit. Please wait a moment before trying again.',
      retryable: true,
    };
  }

  // ── Timeout ──────────────────────────────────────────────────────────────────
  if (status === 408 || /timed out|timeout/i.test(serverMsg)) {
    return {
      title: 'Conversion Timed Out',
      detail: serverMsg || 'The conversion took too long. Your file may be too large or complex; please try a smaller file.',
      retryable: true,
    };
  }

  // ── Password-protected PDF ───────────────────────────────────────────────────
  if (/password.?protected|encrypted|security handler/i.test(serverMsg)) {
    return {
      title: 'Password-Protected PDF',
      detail: 'This PDF is password-protected. Please use the Unlock PDF tool first, then retry the conversion.',
      retryable: false,
    };
  }

  // ── Corrupted / invalid file ─────────────────────────────────────────────────
  if (/corrupt|invalid pdf|malformed|bad xref|unexpected end/i.test(serverMsg)) {
    return {
      title: 'Invalid or Corrupted File',
      detail: 'The file appears to be corrupted or invalid. Please try a different file.',
      retryable: false,
    };
  }

  // ── No output produced ───────────────────────────────────────────────────────
  if (/produced no output|empty output/i.test(serverMsg)) {
    return {
      title: 'Conversion Failed',
      detail: serverMsg || 'The conversion produced no output. Please check your file and try again.',
      retryable: true,
    };
  }

  // ── Server storage full ──────────────────────────────────────────────────────
  if (status === 507 || /storage|disk|no space/i.test(serverMsg)) {
    return {
      title: 'Server Busy',
      detail: 'Server storage is temporarily full. Please try again in a few minutes.',
      retryable: true,
    };
  }

  // ── Service unavailable ──────────────────────────────────────────────────────
  if (status === 503) {
    return {
      title: 'Service Unavailable',
      detail: serverMsg || 'The conversion service is temporarily unavailable. Please try again shortly.',
      retryable: true,
    };
  }

  // ── Generic 4xx client errors ────────────────────────────────────────────────
  if (status >= 400 && status < 500) {
    return {
      title: 'Invalid Request',
      detail: serverMsg || 'There was a problem with your request. Please check your file and try again.',
      retryable: false,
    };
  }

  // ── Generic 5xx server errors ────────────────────────────────────────────────
  if (status >= 500) {
    return {
      title: 'Conversion Failed',
      detail: serverMsg || 'A server error occurred. Please try again in a moment.',
      retryable: true,
    };
  }

  // ── Fallback ─────────────────────────────────────────────────────────────────
  return {
    title: 'Conversion Failed',
    detail: serverMsg || 'An unexpected error occurred. Please try again.',
    retryable: true,
  };
}

/** Convenience: returns just the detail string, for simple single-line error displays. */
export function getConversionErrorMessage(err: unknown): string {
  return getConversionError(err).detail;
}
