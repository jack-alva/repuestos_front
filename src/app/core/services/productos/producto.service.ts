import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Producto } from '../../class/models/producto';
import productosIniciales from '../../../data/productos.json';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly storageKey = 'laguarida_productos';

  private productos: Producto[] = productosIniciales as Producto[];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const guardados = localStorage.getItem(this.storageKey);
      if (guardados) {
        const locales = JSON.parse(guardados) as Producto[];
        const adicionales = locales.filter(local => !this.productos.some(base => base.id === local.id));
        this.productos = [...this.productos, ...adicionales];
        this.persistir();
      }
    }
  }

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  agregarProducto(datos: Omit<Producto, 'id'>): Producto {
    const producto: Producto = { ...datos, id: Math.max(0, ...this.productos.map(item => item.id)) + 1 };
    this.productos = [...this.productos, producto];
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(this.storageKey, JSON.stringify(this.productos));
    return producto;
  }

  actualizarProducto(producto: Producto): void {
    this.productos = this.productos.map(item => item.id === producto.id ? { ...producto } : item);
    this.persistir();
  }

  eliminarProducto(id: number): void { this.productos = this.productos.filter(producto => producto.id !== id); this.persistir(); }

  siguienteCodigo(): string {
    const numero = Math.max(0, ...this.productos.map(producto => Number(producto.codigo.replace(/\D/g, '')) || 0)) + 1;
    return `REP-${String(numero).padStart(3, '0')}`;
  }

  private persistir(): void { if (isPlatformBrowser(this.platformId)) localStorage.setItem(this.storageKey, JSON.stringify(this.productos)); }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find(
      producto => producto.id === id
    );
  }

  buscarProductos(texto: string): Producto[] {

    const termino = texto.toLowerCase().trim();

    if (!termino) {
      return this.productos;
    }

    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(termino) ||
      producto.codigo.toLowerCase().includes(termino) ||
      producto.marca.toLowerCase().includes(termino) ||
      producto.categoria.toLowerCase().includes(termino)
    );
  }

  obtenerCategorias(): string[] {
    return [
      ...new Set(
        this.productos.map(producto => producto.categoria)
      )
    ];
  }
}
