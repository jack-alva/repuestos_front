import {
  Inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../../class/auth/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'cliente@gmail.com',
      password: '123456',
      rol: 'CLIENTE'
    },
    {
      id: 2,
      nombre: 'Ana',
      apellido: 'García',
      correo: 'trabajador@laguarida.com',
      password: '123456',
      rol: 'TRABAJADOR'
    }
  ];

  private usuarioActual: Usuario | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      this.usuarioActual = JSON.parse(usuario);
    }
  }

  login(correo: string, password: string): boolean {

    const usuario = this.usuarios.find(
      u =>
        u.correo === correo &&
        u.password === password
    );

    if (!usuario) {
      return false;
    }

    this.usuarioActual = usuario;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
      );
    }

    return true;
  }

  registrar(usuario: Usuario): boolean {

    const existe = this.usuarios.some(
      u => u.correo === usuario.correo
    );

    if (existe) {
      return false;
    }

    this.usuarios.push(usuario);

    return true;
  }

  logout(): void {
    this.usuarioActual = null;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuario');
    }
  }

  estaAutenticado(): boolean {
    return this.usuarioActual !== null;
  }

  obtenerUsuario(): Usuario | null {
    return this.usuarioActual;
  }

  obtenerRol(): 'CLIENTE' | 'TRABAJADOR' | null {
    return this.usuarioActual?.rol ?? null;
  }
}
