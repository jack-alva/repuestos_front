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

  private readonly storageKey = 'laguarida_usuarios';

  private usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'cliente@gmail.com',
      password: '123456',
      rol: 'CLIENTE', dni: '12345678', telefono: '999111222', activo: true
    },
    {
      id: 2,
      nombre: 'Ana',
      apellido: 'García',
      correo: 'trabajador@laguarida.com',
      password: '123456',
      rol: 'TRABAJADOR', dni: '87654321', telefono: '999333444', activo: true
    }
  ];

  private usuarioActual: Usuario | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const usuarios = localStorage.getItem(this.storageKey);
    if (usuarios) {
      this.usuarios = (JSON.parse(usuarios) as Usuario[]).map(usuario => ({
        ...usuario,
        dni: usuario.dni ?? '',
        telefono: usuario.telefono ?? '',
        activo: usuario.activo !== false
      }));
      this.guardarUsuarios();
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
        u.password === password && u.activo !== false
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

    this.usuarios.push({ ...usuario, activo: true });
    this.guardarUsuarios();

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

  obtenerUsuarios(): Usuario[] { return this.usuarios.map(usuario => ({ ...usuario, password: '' })); }

  cambiarEstadoUsuario(id: number, activo: boolean): void {
    this.usuarios = this.usuarios.map(usuario => usuario.id === id ? { ...usuario, activo } : usuario);
    if (this.usuarioActual?.id === id && !activo) this.logout();
    this.guardarUsuarios();
  }

  private guardarUsuarios(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(this.storageKey, JSON.stringify(this.usuarios));
  }
}
