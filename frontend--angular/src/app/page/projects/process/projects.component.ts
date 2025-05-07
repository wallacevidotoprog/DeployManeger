import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ProjectListComponent } from '../../../components/project-list/project-list.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, ProjectListComponent, RouterModule, ProjectListComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  showModal = false;

  salvarProjeto(dados: any) {
    console.log('Projeto salvo:', dados);
  }
}
