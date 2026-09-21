import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  correo = '';
  password = '';

  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion(): void {

    this.error = '';

    const correcto =
      this.authService.login(
        this.correo,
        this.password
      );

    if (!correcto) {

      this.error =
        'El correo o contraseña son incorrectos.';

      return;
    }

    const rol =
      this.authService.obtenerRol();

    if (rol === 'TRABAJADOR') {

      this.router.navigate([
        '/trabajador/dashboard'
      ]);

    } else {

      this.router.navigate(['/home']);

    }
  }
}
