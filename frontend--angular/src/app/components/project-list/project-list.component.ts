import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projects: any[] = [{name: 'Project 1', status: 'online',}, {name: 'Project 2', status: 'offline'}, {name: 'Project 3', status: 'building'}];
  displayedColumns = ['name', 'status', 'actions'];

  //constructor(private projectService: ProjectService) {}

  ngOnInit() {
    // this.projectService.getProjects().subscribe(projects => {
    //   this.projects = projects;
    // });
  }

}
