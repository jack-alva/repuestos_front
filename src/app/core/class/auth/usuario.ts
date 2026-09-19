export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol: 'CLIENTE' | 'TRABAJADOR';
}