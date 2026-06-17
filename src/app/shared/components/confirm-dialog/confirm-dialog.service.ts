import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  icon?:        string;
  title:        string;
  message:      string;
  confirmLabel?: string;
  cancelLabel?:  string;
  danger?:       boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  readonly visible = signal(false);
  readonly options = signal<ConfirmOptions>({ title: '', message: '' });

  private resolve!: (val: boolean) => void;

  open(opts: ConfirmOptions): Promise<boolean> {
    this.options.set(opts);
    this.visible.set(true);
    return new Promise(res => { this.resolve = res; });
  }

  confirm(): void { this.visible.set(false); this.resolve(true); }
  cancel():  void { this.visible.set(false); this.resolve(false); }
}
