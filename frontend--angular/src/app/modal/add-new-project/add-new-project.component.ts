// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgToastService } from 'ng-angular-popup';
// import { GithubProfile, GithubRepository } from '../../../models/gitHub.model';
// import { ConfirmationModalService } from '../../../Modules/confirmation-modal.service';
// import { DeployService } from '../../../service/deploy.service';
// import { GithubService } from '../../../service/github.service';

// @Component({
//   selector: 'app-add-new-project',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './add-new-project.component.html',
//   styleUrls: ['./add-new-project.component.scss'],
// })
// export class AddNewProjectComponent {
//   @Input() visible = false;
//   @Output() close = new EventEmitter<void>();
//   @Output() save = new EventEmitter<any>();

//   private deployService = inject(DeployService);
//   protected tAlert = inject(NgToastService);
//   private confirmed = inject(ConfirmationModalService);
//   private gitHubService = inject(GithubService);

//   profile: string | null = null;
//   profileData: GithubProfile | null = null;
//   repositoryData: GithubRepository[] = [];

//   async onGetProfile() {
//     if (!this.profile) {
//       this.tAlert.success('Error', 'Please enter a GitHub profile');
//       return;
//     }

//     this.gitHubService.getProfile(this.profile).subscribe({
//       next: (data) => {
//         this.profileData = data;
//         this.onGetRepository(data.login);
//       },
//       error: (error) => {
//         this.tAlert.danger('Error', `Error fetching profile: ${error.error?.message || error.message}`, 5000);
//       },
//     });
//   }

//   onGetRepository(dataProfile: string) {
//     this.gitHubService.getReposiory(dataProfile).subscribe({
//       next: (data) => {
//         this.repositoryData = data;
//         this.tAlert.info('Repositories fetched', `Repositories for ${dataProfile} fetched successfully`, 5000);
//       },
//       error: (error) => {
//         this.tAlert.danger('Error', `Error fetching repositories: ${error.error?.message || error.message}`, 5000);
//       },
//     });
//   }

//   async selectRepository(repo: GithubRepository) {
//     if (!this.profileData) return;

//     const deployData = {
//       name: repo.name,
//       clone_url: repo.clone_url,
//       node_id: repo.node_id,
//       profile: this.profileData.login,
//       created_project: repo.created_at,
//       updated_project: repo.updated_at,
//     };
//     if (await this.confirmed.show(`Import file GitHUb: ${repo.name}`)) {
//       this.deployService.createDeploy(deployData).subscribe({
//         next: (response) => {
//           this.tAlert.success('Success', `Deployment created successfully for ${repo.name}`, 5000);
//           this.save.emit(response);
//           this.close.emit();
//         },
//         error: (error) => {
//           this.tAlert.danger('Error', `Error creating deployment: ${error.error?.message || error.message}`, 5000);
//         },
//       });
//     }
//     return;
//   }
// }


import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { GithubProfile, GithubRepository } from '../../../models/gitHub.model';
import { ConfirmationModalService } from '../../../Modules/confirmation-modal.service';
import { DeployService } from '../../../service/deploy.service';
import { GithubService } from '../../../service/github.service';

@Component({
  selector: 'app-add-new-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-new-project.component.html',
  styleUrls: ['./add-new-project.component.scss'],
})
export class AddNewProjectComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private deployService = inject(DeployService);
  protected tAlert = inject(NgToastService);
  private confirmed = inject(ConfirmationModalService);
  private gitHubService = inject(GithubService);

  profile: string | null = null;
  profileData: GithubProfile | null = null;
  repositoryData: GithubRepository[] = [];

  // Cores para linguagens de programação
  languageColors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Swift': '#ffac45',
    'Kotlin': '#A97BFF',
    'Rust': '#dea584',
    'Shell': '#89e051',
    'Dart': '#00B4AB',
    'Scala': '#c22d40',
    'R': '#198CE7',
    'Vue': '#41b883',
    'React': '#61dafb',
    'Angular': '#dd0031',
    'Svelte': '#ff3e00'
  };

  async onGetProfile() {
    if (!this.profile) {
      this.tAlert.success('Error', 'Please enter a GitHub profile');
      return;
    }

    this.gitHubService.getProfile(this.profile).subscribe({
      next: (data) => {
        this.profileData = data;
        this.onGetRepository(data.login);
      },
      error: (error) => {
        this.tAlert.danger('Error', `Error fetching profile: ${error.error?.message || error.message}`, 5000);
      },
    });
  }

  onGetRepository(dataProfile: string) {
    this.gitHubService.getReposiory(dataProfile).subscribe({
      next: (data) => {
        this.repositoryData = data;
        this.tAlert.info('Repositories fetched', `Repositories for ${dataProfile} fetched successfully`, 5000);
      },
      error: (error) => {
        this.tAlert.danger('Error', `Error fetching repositories: ${error.error?.message || error.message}`, 5000);
      },
    });
  }

  async selectRepository(repo: GithubRepository) {
    if (!this.profileData) return;

    const deployData = {
      name: repo.name,
      clone_url: repo.clone_url,
      node_id: repo.node_id,
      profile: this.profileData.login,
      created_project: repo.created_at,
      updated_project: repo.updated_at,
    };
    
    if (await this.confirmed.show(`Import file GitHUb: ${repo.name}`)) {
      this.deployService.createDeploy(deployData).subscribe({
        next: (response) => {
          this.tAlert.success('Success', `Deployment created successfully for ${repo.name}`, 5000);
          this.save.emit(response);
          this.close.emit();
        },
        error: (error) => {
          this.tAlert.danger('Error', `Error creating deployment: ${error.error?.message || error.message}`, 5000);
        },
      });
    }
  }

  getLanguageColor(language: string): string {
    return this.languageColors[language] || '#cccccc';
  }
}