export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  precio: number;
  stock: number;
  imagen: string;
  demandaMensual: number;
}