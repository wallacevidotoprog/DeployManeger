import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { NgToastService } from 'ng-angular-popup';
import { HttpStatus } from '../../../../../../backend--nodejs/src/utils/HttpStatus';
import { AuthService } from '../../../../service/auth.service';
import { AuthLogin } from '../../../../types/auth';
//import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss',
})
export class AuthLoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private service: AuthService = new AuthService()) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  protected tAlert = inject(NgToastService);
  async onSubmit() {
    if (this.loginForm.valid) {
      const data: AuthLogin = this.loginForm.value;

      const result = this.service.authLogin(data).subscribe(
        {
          next: (value) => {
            this.tAlert.success('Login efetuado com sucesso');
          },
          error: (err) => {
            this.tAlert.danger('Error', `Error fetching profile: ${err.error?.message || err.message}`, 5000);
          },
        }
      );

      console.log(this.loginForm.value);
      // aqui vai sua lógica de login
    }
  }
}
