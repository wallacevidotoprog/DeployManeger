import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GithubProfile, GithubRepository } from '../../../../models/gitHub.model';
import { DeployService } from '../../../../service/deploy.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-new-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './add-new-project.component.html',
  styleUrls: ['./add-new-project.component.scss'],
})
export class AddNewProjectComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private deployService = inject(DeployService);
  protected tAlert = inject(NgToastService);
  

  profile: string | null = null;
  profileData: GithubProfile | null = null;
  repositoryData: GithubRepository[] = [];

  

  onGetProfile() {
    if (!this.profile) {
      this.tAlert.success('Error', 'Please enter a GitHub profile');
      return;
    }

    this.http.get<GithubProfile>(`https://api.github.com/users/${this.profile}`).subscribe({
      next: (data) => {
        this.profileData = data;
        this.onGetRepository(data);
      },
      error: (error) => {
        this.tAlert.danger('Error', `Error fetching profile: ${error.error?.message || error.message}`,5000);
      },
    });
  }

  // Método modificado
  onGetRepository(dataProfile: GithubProfile) {
    this.http.get<GithubRepository[]>(`https://api.github.com/users/${dataProfile.login}/repos`).subscribe({
      next: (data) => {
        this.repositoryData = data;
        this.tAlert.info('Repositories fetched', `Repositories for ${dataProfile.login} fetched successfully`,5000);
      },
      error: (error) => {
        this.tAlert.danger('Error', `Error fetching repositories: ${error.error?.message || error.message}`,5000);
      },
    });
  }

  // Método modificado com tipagem melhorada
  selectRepository(repo: GithubRepository) {
    if (!this.profileData) return;

    const deployData = {
      name: repo.name,
      clone_url: repo.clone_url,
      node_id: repo.node_id,
      profile: this.profileData.login,
      created_project: repo.created_at,
      updated_project: repo.updated_at,
    };

    this.deployService.createDeploy(deployData).subscribe({
      next: (response) => {
        this.tAlert.success('Success', `Deployment created successfully for ${repo.name}`,5000);
        this.save.emit(response);
        this.close.emit();
      },
      error: (error) => {
        this.tAlert.danger('Error', `Error creating deployment: ${error.error?.message || error.message}`,5000);
      },
    });
  }
}
