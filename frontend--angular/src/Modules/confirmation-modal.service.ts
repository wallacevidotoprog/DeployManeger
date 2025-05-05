import { Injectable } from '@angular/core';
import { ConfirmationModalComponent } from '../app/components/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  private modalComponentRef?: ConfirmationModalComponent;

  registerModal(modalComponent: ConfirmationModalComponent) {
    this.modalComponentRef = modalComponent;
  }

  show(message: string): Promise<boolean> {
    
    return new Promise<boolean>((resolve) => {
      if (!this.modalComponentRef) {
        console.error('Modal component not registered!');
        return resolve(false);
      }
      this.modalComponentRef.message = message;
      this.modalComponentRef.isVisible = true;
      
      const confirmSub = this.modalComponentRef.onConfirm.subscribe(() => {
        resolve(true);
        confirmSub.unsubscribe();
        cancelSub.unsubscribe();
      });
      const cancelSub = this.modalComponentRef.onCancel.subscribe(() => {
        resolve(false);
        confirmSub.unsubscribe();
        cancelSub.unsubscribe();
      });
    });
  }
}
