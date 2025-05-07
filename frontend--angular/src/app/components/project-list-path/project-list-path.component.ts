import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Child, ListProjectPath, Type } from '../../../types/project.types';
@Component({
  selector: 'app-project-list-path',
  standalone: true,
  templateUrl: './project-list-path.component.html',
  styleUrls: ['./project-list-path.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProjectListPathComponent {
  Type = Type;

  @Input() items: (ListProjectPath | Child)[] = [];
  @Input() level: number = 0;
  @Input() parentPath: string = '';
  @Output() configProject = new EventEmitter<ListProjectPath>();

  expandedPaths: Set<string> = new Set();

  isDirectory(item: ListProjectPath | Child): boolean {
    return item.type === Type.Directory;
  }

  toggleExpand(item: ListProjectPath | Child): void {
    if (this.isDirectory(item)) {
      const path = item.path;
      this.expandedPaths.has(path) ? this.expandedPaths.delete(path) : this.expandedPaths.add(path);
    }
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
}
