import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Fixes the "slow on first visit, fast once already opened" navigation feel:
 * with no preloading strategy at all, every lazy route's chunk is only
 * fetched over the network the instant the user clicks into it — the very
 * definition of that symptom. This preloads every lazy chunk in the
 * background, shortly after the initial route settles, so by the time the
 * user actually navigates the chunk is usually already cached.
 *
 * A route opts out via `data: { noPreload: true }` — reserved for chunks
 * that are large and rarely visited by a typical session (e.g. the
 * permission-gated Admin panel), so we don't spend every visitor's mobile
 * data on a chunk most of them will never open.
 */
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data?.['noPreload']) return of(null);
    // Small stagger so background preloading never competes with the
    // initial route's own requests for bandwidth right at bootstrap.
    return timer(200).pipe(mergeMap(() => load()));
  }
}
