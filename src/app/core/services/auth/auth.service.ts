import { Injectable } from '@angular/core';
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

  constructor() {
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

    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario)
    );

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
    localStorage.removeItem('usuario');
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