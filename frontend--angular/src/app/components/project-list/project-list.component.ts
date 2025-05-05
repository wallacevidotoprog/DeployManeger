import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NgToastService } from 'ng-angular-popup';
import { ProjectService } from '../../../service/project.service';
import { ProcessModal } from '../../../types/process.types';
import { RoleUser, StatusDeployment } from '../../../enum/db.enum';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);
  private tAlert = inject(NgToastService);
  dataList!: ProcessModal[];
  loading = false;
  StatusDeployment = StatusDeployment;
  RoleUser = RoleUser;


  ngOnInit(): void {
    this.getAllProject();
  }

  getAllProject() {
    this.projectService.getAllProject().subscribe({
      next: (value) => {
        this.dataList = value.data as ProcessModal[];
      },
      error: (err) => {
        console.error(err);

        this.tAlert.danger('Error', 'Failed to fetch projects', 5000);
      },
    });
  }
  getStatusClass(status: StatusDeployment): string {
    const statusString = status.toString();
    return statusString.toLowerCase();
  }
  configureProcess(process: ProcessModal) {
    console.log('Configuring process:', process);
    // Add your configuration logic here
  }

  restartProcess(process: ProcessModal) {
    console.log('Restarting process:', process);
    // Add restart logic here
  }

  adminAction(process: ProcessModal) {
    console.log('Admin action for process:', process);
    // Add admin-specific logic here
  }

  showAdminControls(process: ProcessModal): boolean {
    return true;// this.authService.currentUser?.role === RoleUser.ADMIN;
  }
  refreshData() {
    this.getAllProject();
  }
}
