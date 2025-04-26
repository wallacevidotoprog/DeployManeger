import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Github } from '../../../service/models/gitHub.model';

@Component({
  selector: 'app-add-new-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-new-project.component.html',
  styleUrls: ['./add-new-project.component.scss']
})
export class AddNewProjectComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  form: FormGroup = this.fb.group({
    githubUrl: [''],
    name: [''],
    description: [''],
    owner: [''],
    git_url: [''],
  });

  async fetchRepo() {
    const url = this.form.value.githubUrl;
    if (!url) return;

    const repoPath = this.extractRepoPath(url);
    if (!repoPath) return;

    try {
      const data = await this.http.get<Github>(`https://api.github.com/repos/${repoPath}`).toPromise();
      if (!data) {
        alert('Repositório não encontrado!');
      }
      this.form.patchValue({
        name: data?.name,
        description: data?.description,
        owner: data?.owner.login,
        git_url: data?.git_url,
      });
    } catch (err) {
      alert('Repositório não encontrado!');
    }
  }

  extractRepoPath(url: string): string | null {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    return match ? match[1] : null;
  }

  submit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
      this.close.emit();
    }
  }
}
