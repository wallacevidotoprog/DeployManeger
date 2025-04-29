import { ApplicationRef, ComponentRef, createComponent, Injectable, Injector } from '@angular/core';
import { AlertModalComponent } from '../alert-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef?: ComponentRef<AlertModalComponent>;

  constructor(private appRef: ApplicationRef, private injector: Injector) {}

  open(title: string, content: string) {
    if (this.modalRef) return; // já existe um modal aberto

    this.modalRef = createComponent(AlertModalComponent, {
      environmentInjector: this.appRef.injector,
    });

    this.modalRef.instance.title = title;
    this.modalRef.instance.visible = true;

    const modalBody = document.createElement('div');
    modalBody.innerHTML = `<p>${content}</p>`;
    this.modalRef.location.nativeElement.querySelector('.modal-body').appendChild(modalBody);

    this.modalRef.instance.close.subscribe(() => {
      this.close();
    });

    document.body.appendChild(this.modalRef.location.nativeElement);
    this.appRef.attachView(this.modalRef.hostView);
  }

  close() {
    if (this.modalRef) {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
      this.modalRef = undefined;
    }
  }
}
