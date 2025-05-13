import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnvDecoder } from '../../../types/env.type';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent {
  @Input() show = false;
  @Input() content = '';
  @Input() set setContent(value: string) {
    if (value) this.content = value;
    this.parseEnv(this.content);
  }
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  @Input() activeTab: 'text' | 'env' = 'env';

  drag = { active: false, offsetX: 0, offsetY: 0 };
  modalPosition = { x: 100, y: 100 };
  envDecoder: EnvDecoder[] = [];

  ngOnInit() {
    if (this.content) this.parseEnv(this.content);
  }

  switchTab(tab: 'text' | 'env') {
    this.activeTab = tab;
  }

  onSave() {
    const result = this.activeTab === 'env' ? this.toEnv(this.envDecoder) : this.content;
    this.save.emit(result);
  }

  importEnvFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.parseEnv(reader.result as string, false);
      this.activeTab = 'env';
    };
    reader.readAsText(file);
  }

  parseEnv(text: string, newEnv: boolean = true) {
    if (newEnv) {
      this.envDecoder = [];
    }
    text
      .split('\n')
      .filter((line) => line.trim() && !line.startsWith('#'))
      .map((line) => {
        const [key, ...rest] = line.split('=');
        this.envDecoder.push({
          key: key.trim(),
          value: rest.join('=').trim(),
        });
      });
  }

  toEnv(items: EnvDecoder[]): string {
    return items
      .filter((item) => item.key)
      .map((item) => `${item.key.toLocaleUpperCase()}=${item.value}`)
      .join('\n');
  }

  addFormItem() {
    this.envDecoder.push({ key: '', value: '' });
  }
  deleteKeyEnv(key: string) {
    this.envDecoder = this.envDecoder.filter(x => x.key != key)
    console.log(key,this.envDecoder);
    
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
