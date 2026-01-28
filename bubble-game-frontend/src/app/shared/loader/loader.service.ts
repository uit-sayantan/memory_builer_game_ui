import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly _count$ = new BehaviorSubject<number>(0);

  /** true if any pending request exists */
  readonly loading$: Observable<boolean> = new Observable<boolean>((subscriber) => {
    const sub = this._count$.subscribe((count) => subscriber.next(count > 0));
    return () => sub.unsubscribe();
  });

  show(): void {
    this._count$.next(this._count$.value + 1);
  }

  hide(): void {
    const next = Math.max(0, this._count$.value - 1);
    this._count$.next(next);
  }

  /** use this if you ever want to force-hide everything */
  reset(): void {
    this._count$.next(0);
  }
}
