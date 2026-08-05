import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastItemComponent } from './toast-item.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-80 pointer-events-none" aria-live="polite" aria-atomic="false">
      @for (n of ns.notifications(); track n.id) {
        <app-toast-item [notification]="n" (dismiss)="ns.dismiss(n.id)" />
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly ns = inject(NotificationService);
}
