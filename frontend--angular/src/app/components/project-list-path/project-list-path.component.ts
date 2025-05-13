import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../service/project.service';
import { Child, ListProjectPath, Type } from '../../../types/project.types';
import { ModalViewerCodeComponent } from '../../modal/modal-viewer-code/modal-viewer-code.component';
@Component({
  selector: 'app-project-list-path',
  standalone: true,
  templateUrl: './project-list-path.component.html',
  styleUrls: ['./project-list-path.component.scss'],
  imports: [CommonModule, FormsModule, ModalViewerCodeComponent],
})
export class ProjectListPathComponent {
  Type = Type;

  @Input() items: (ListProjectPath | Child)[] = [];
  @Input() level: number = 0;
  @Input() parentPath: string = '';
  @Output() configProject = new EventEmitter<ListProjectPath>();

  private projectService = inject(ProjectService);

  expandedPaths: Set<string> = new Set();

  showModal: boolean = false;
  fileContent!: string;
  fileLanguage!: 'typescript' | 'javascript' | 'csharp' | 'plaintext';

  isDirectory(item: ListProjectPath | Child): boolean {
    return item.type === Type.Directory;
  }
  closed() {
    this.showModal = false;
  }
  toggleExpand(item: ListProjectPath | Child): void {
    if (this.isDirectory(item)) {
      const path = item.path;
      this.expandedPaths.has(path) ? this.expandedPaths.delete(path) : this.expandedPaths.add(path);

      return;
    }
    if (!item.name.includes('.env')) {
      this.readFileView(item);
    }
  }

  readFileView(item: Child) {
    this.projectService.getFileProject(item.path).subscribe({
      next: (value) => {
        const result = new TextDecoder('utf-8').decode(new Uint8Array(value.data.data));

        this.fileContent = result;
        this.fileLanguage = this.getFileLanguage(item.name);

        this.showModal = true;
      },
      error: (err) => {
        console.error(`Error fetching profile: ${err.error?.message || err.message}`);
      },
    });
  }

  isExpanded(item: ListProjectPath | Child): boolean {
    return this.expandedPaths.has(item.path);
  }

  formatSize(size?: number): string {
    if (!size) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
  }
  isFileWithSize(item: ListProjectPath | Child): item is Child {
    return item.type === Type.File && 'size' in item;
  }

  isFileRaiz(item: ListProjectPath | Child): ListProjectPath {
    return item as ListProjectPath;
  }

  openSettings(item: ListProjectPath) {
    this.configProject.emit(item);
  }

  getFileLanguage(fileName: string): 'typescript' | 'javascript' | 'csharp' | 'plaintext' {
    const ext = fileName.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'ts':
        return 'typescript';
      case 'js':
        return 'javascript';
      case 'cs':
        return 'csharp';
      default:
        return 'plaintext';
    }
  }
}
