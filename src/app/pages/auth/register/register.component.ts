import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  nombre = '';
  apellido = '';
  correo = '';
  password = '';
  dni = '';
  telefono = '';

  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar(): void {

    this.error = '';

    if (
      !this.nombre ||
      !this.apellido ||
      !this.correo ||
      !this.password || !this.dni || !this.telefono
    ) {

      this.error =
        'Completa todos los campos.';

      return;
    }

    const resultado =
      this.authService.registrar({

        id: Date.now(),

        nombre: this.nombre,

        apellido: this.apellido,

        correo: this.correo,

        password: this.password,

        rol: 'CLIENTE',
        dni: this.dni,
        telefono: this.telefono,
        activo: true

      });

    if (!resultado) {

      this.error =
        'Ya existe una cuenta con ese correo.';

      return;
    }

    this.router.navigate(['/login']);

  }
}
