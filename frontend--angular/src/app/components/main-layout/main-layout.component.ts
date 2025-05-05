import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterModule],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class MainLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
