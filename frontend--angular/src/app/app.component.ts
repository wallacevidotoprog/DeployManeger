import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { ConfirmationModalService } from '../Modules/confirmation-modal.service';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgToastModule, ConfirmationModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('messageBoxModal') messageBoxModal!: ConfirmationModalComponent;
  private confirmModal = inject(ConfirmationModalService);
  ngAfterViewInit() {
    this.confirmModal.registerModal(this.messageBoxModal);
  }
}
