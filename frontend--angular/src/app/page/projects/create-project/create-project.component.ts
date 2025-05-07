import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgToastService } from 'ng-angular-popup';
import { ProjectService } from '../../../../service/project.service';
import { Child, ListProjectPath } from '../../../../types/project.types';
import { ProjectListPathComponent } from '../../../components/project-list-path/project-list-path.component';
import { EditModalComponent } from '../../../modal/edit-modal/edit-modal.component';

@Component({
  standalone: true, // Adicionar esta linha
  imports: [CommonModule, FormsModule, FontAwesomeModule, ProjectListPathComponent, EditModalComponent],
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  ngOnInit(): void {
    this.getAllProject();
  }
  projectsData: ListProjectPath[] = [];
  selectedProject: ListProjectPath | null = null;
  listEnv: Child[] | undefined;
  selectedEnv: Child | null = null;
  showEditModal = false;
  editingContent = '';

  handleConfigProject(project: ListProjectPath) {
    this.selectedProject = project;
    this.listEnv = undefined;
    this.checkingEnvFile();
  }

  closeSettings() {
    this.selectedProject = null;
    this.listEnv = undefined;
  }
  private projectService = inject(ProjectService);
  protected tAlert = inject(NgToastService);

  getAllProject() {
    this.projectService.getAllProject().subscribe({
      next: (value) => {
        this.projectsData = value.data as ListProjectPath[];
        this.tAlert.success('Load :' + (value.data as ListProjectPath[]).length);
      },
      error: (err) => {
        this.tAlert.danger('Error', `Error fetching profile: ${err.error?.message || err.message}`, 5000);
      },
    });
  }

  generateEnvFile() {
    this.tAlert.info('Gerando .env para: ' + this.selectedProject?.name);
    // lógica de chamada para gerar o .env
  }

  addToPM2() {
    this.tAlert.info('Adicionando ao PM2: ' + this.selectedProject?.name);
    // lógica de chamada à API para PM2
  }

  checkingEnvFile() {
    this.listEnv = this.selectedProject?.children.filter((x) => x.name.includes('.env'));
  }


  openEditModal(item: Child) {
    this.selectedEnv = item;
    //this.editingContent = this.readFileContent(item.path); // simulado
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedEnv = null;
  }

  onSaveEdit(newContent: string) {
    if (this.selectedEnv) {
      console.log(this.selectedEnv.path, newContent); // simulado
    }
    this.closeEditModal();
  }
}
