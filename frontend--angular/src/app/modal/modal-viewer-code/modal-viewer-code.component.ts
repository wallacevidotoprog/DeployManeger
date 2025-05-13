import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  ViewChild
} from '@angular/core';
import hljs from 'highlight.js';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'app-modal-viewer-code',
  standalone: true,
  imports: [HighlightModule],
  templateUrl: './modal-viewer-code.component.html',
  styleUrls: ['./modal-viewer-code.component.scss'],
})
export class ModalViewerCodeComponent implements AfterViewInit, OnChanges {
  @Input() content: string = '';
  @Input() language: 'typescript' | 'javascript' | 'csharp' | 'plaintext' = 'plaintext';
  @Output() close = new EventEmitter<void>();

  @ViewChild('codeBlock') codeBlock!: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.highlightCode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] || changes['language']) {
      this.cdr.detectChanges(); // Garante que o DOM foi atualizado
      setTimeout(() => this.highlightCode(), 0); // Aguarda DOM para aplicar highlight
    }
  }

  highlightCode() {
    if (this.codeBlock?.nativeElement) {
      hljs.highlightElement(this.codeBlock.nativeElement);
    }
  }

  closed() {
    this.close.emit();
  }
}
