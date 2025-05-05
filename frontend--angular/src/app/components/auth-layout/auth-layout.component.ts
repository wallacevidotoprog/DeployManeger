import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports:[RouterModule],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AuthLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
