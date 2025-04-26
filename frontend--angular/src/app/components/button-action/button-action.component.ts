import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'button-action',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="noselect"
      [ngClass]="{
      'button-delete': actionType === 'delete',
      'button-edite': actionType === 'edite',
      'button-confirm': actionType === 'confirm',
      'button-add': actionType === 'add',
    }"
      click="onClick()"
      [disabled]="disabled"
    >
      <span class="text">{{ actionType.toLocaleUpperCase() }}</span
      ><span class="icon">
      <span class="buttonSpan">{{ico}}</span>
      </span>
    </button>
  `,
  styles: `
  .buttonSpan {
  color: white;
  margin: 150px;
  font-size: 30px;
}
button {
 width: 150px;
 height: 50px;
 cursor: pointer;
 display: flex;
 align-items: center;
 background: red;
 border: none;
 border-radius: 5px;
 box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
}

button, button span {
 transition: 200ms;
}

button .text {
 transform: translateX(35px);
 color: white;
 font-weight: bold;
}

button .icon {
  border-left: 1px solid rgb(0, 0, 0);
 position: absolute;
 transform: translateX(110px);
 height: 40px;
 width: 40px;
 display: flex;
 align-items: center;
 justify-content: center;
}

button svg {
 width: 15px;
 fill: #eee;
}
button:hover .text {
 color: transparent;
}

button:hover .icon {
 width: 150px;
 border-left: none;
 transform: translateX(0);
}

button:focus {
 outline: none;
}

button:active .icon svg {
 transform: scale(0.8);
}

.button-delete{
  background: #e62222;
  &:hover {
 background: #ff3636;
}
} 
.button-edite{
  background:rgb(47, 34, 230);
  &:hover {
 background: rgb(67, 55, 243);
}
} 
.button-confirm{
  background: #00a600;
  &:hover {
    background:rgb(18, 170, 4);
}
}
.button-add{
  background: #00a600;
  &:hover {
 background:rgb(18, 170, 4);
}
}


  `,
})
export class ButtonActionComponent {
  @Input() actionType: 'delete' | 'edite' | 'confirm' | 'add' = 'delete';
  @Input() disabled: boolean = false;

  ico: string =  this.actionType === 'delete' ? 'X' : this.actionType === 'confirm' ? '✔' : this.actionType === 'edite' ? '🖋':this.actionType === 'add' ? '+' : '';

  @Output() actionClicked: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.actionClicked.emit();
    }
  }
}
