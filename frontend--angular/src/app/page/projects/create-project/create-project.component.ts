import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgToastService } from 'ng-angular-popup';
import { HttpStatus } from '../../../../../../backend--nodejs/src/utils/HttpStatus';
import { ProjectService } from '../../../../service/project.service';
import { Child, ListProjectPath, SetFileProject } from '../../../../types/project.types';
import { ProjectListPathComponent } from '../../../components/project-list-path/project-list-path.component';
import { EditModalComponent } from '../../../modal/edit-modal/edit-modal.component';
import { ModalViewerCodeComponent } from '../../../modal/modal-viewer-code/modal-viewer-code.component';

@Component({
  standalone: true, // Adicionar esta linha
  imports: [CommonModule, FormsModule, FontAwesomeModule, ProjectListPathComponent, EditModalComponent, ],
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
  activeTab!: 'text' | 'env';
  setContent = '';
  pathSelected = '';

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
    this.editingContent = '';
    this.setContent = this.editingContent;

    this.activeTab = 'env';
    this.selectedEnv = null;
    this.showEditModal = true;
    this.pathSelected = this.selectedProject!.name;
    //this.tAlert.info('Gerando .env para: ' + this.selectedProject?.name);
  }

  addToPM2() {
    this.tAlert.info('Adicionando ao PM2: ' + this.selectedProject?.name);
    // lógica de chamada à API para PM2
  }

  checkingEnvFile() {
    this.listEnv = this.selectedProject?.children.filter((x) => x.name.includes('.env'));
  }

  openEditModal(item: Child) {
    try {
      this.projectService.getFileProject(item.path).subscribe({
        next: (value) => {
          this.editingContent = new TextDecoder('utf-8').decode(new Uint8Array(value.data.data));
          this.setContent = this.editingContent;

          this.activeTab = 'env';
          this.selectedEnv = item;
          this.showEditModal = true;
          this.pathSelected = item.path.split(/[/\\]/)[0];
        },
        error: (err) => {
          this.tAlert.danger('Error', `Error fetching profile: ${err.error?.message || err.message}`, 5000);
        },
      });
    } catch (error) {
      this.tAlert.danger('Error', `Error fetching profile: ${error}`, 5000);
    }
  }

  closeEditModal() {
    this.setContent = '';
    this.editingContent = '';
    this.showEditModal = false;
    this.selectedEnv = null;
    this.pathSelected = '';
  }

  onSaveEdit(newContent: string) {
    const datafile: SetFileProject = {
      action: 'create',
      filename: '',
      pathfile: '',
      data: newContent,
    };
    if (this.selectedEnv) {
      datafile.action = 'update';
      datafile.filename = this.selectedEnv.name;
      datafile.pathfile = this.selectedEnv.path.replace(this.selectedEnv.name, '');
    } else {
      datafile.action = 'create';
      datafile.filename = '.env';
      datafile.pathfile = this.pathSelected;
    }

    this.projectService.setFileProject(datafile).subscribe({
      next: (value) => {
        this.tAlert.success('Sucess', `${value.status === HttpStatus.CREATED ? 'Created' : 'Updated'}`, 5000);
        this.closeSettings();
        this.getAllProject();
      },
      error: (err) => {
        this.tAlert.danger('Error', `Error fetching profile: ${err.error?.message || err.message}`, 5000);
        console.error('onSaveEdit', err);
      },
    });
    this.closeEditModal();
  }

  
}
