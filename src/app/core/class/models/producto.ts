export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  modeloCompatible: string;
  precio: number;
  stock: number;
  imagen: string;
  demandaMensual: number;
  proveedorId?: number;
}
