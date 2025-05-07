import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule,CommonModule],
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent {
  @Input() show = false;
  @Input() content = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  activeTab: 'text' | 'form' = 'text';
  formItems: { key: string; value: string }[] = [];

  drag = { active: false, offsetX: 0, offsetY: 0 };
  modalPosition = { x: 100, y: 100 };

  ngOnInit() {
    if (this.content) this.formItems = this.parseEnv(this.content);
  }

  switchTab(tab: 'text' | 'form') {
    this.activeTab = tab;
  }

  onSave() {
    const result = this.activeTab === 'form' ? this.toEnv(this.formItems) : this.content;
    this.save.emit(result);
  }

  importEnvFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.content = reader.result as string;
      this.formItems = this.parseEnv(this.content);
      this.activeTab = 'form';
    };
    reader.readAsText(file);
  }

  parseEnv(text: string): { key: string; value: string }[] {
    return text.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => {
        const [key, ...rest] = line.split('=');
        return { key: key.trim(), value: rest.join('=').trim() };
      });
  }

  toEnv(items: { key: string; value: string }[]): string {
    return items
      .filter(item => item.key)
      .map(item => `${item.key}=${item.value}`)
      .join('\n');
  }

  addFormItem() {
    this.formItems.push({ key: '', value: '' });
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onCtrlS(event: KeyboardEvent) {
    event.preventDefault();
    this.onSave();
  }

  startDrag(event: MouseEvent) {
    this.drag.active = true;
    this.drag.offsetX = event.clientX - this.modalPosition.x;
    this.drag.offsetY = event.clientY - this.modalPosition.y;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.drag.active) return;
    this.modalPosition.x = event.clientX - this.drag.offsetX;
    this.modalPosition.y = event.clientY - this.drag.offsetY;
  }

  @HostListener('document:mouseup')
  stopDrag() {
    this.drag.active = false;
  }
}
