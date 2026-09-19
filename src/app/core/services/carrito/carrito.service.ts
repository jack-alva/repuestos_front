import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../../class/models/producto';
import { CarritoItem } from '../../class/models/carrito-item';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private itemsSubject =
    new BehaviorSubject<CarritoItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  agregar(producto: Producto): void {

    const items = [...this.itemsSubject.value];

    const existente = items.find(
      item => item.producto.id === producto.id
    );

    if (existente) {

      if (existente.cantidad < producto.stock) {
        existente.cantidad++;
        existente.subtotal =
          existente.cantidad * producto.precio;
      }

    } else {

      items.push({
        producto,
        cantidad: 1,
        subtotal: producto.precio
      });

    }

    this.itemsSubject.next(items);
  }

  disminuir(productoId: number): void {

    const items = [...this.itemsSubject.value];

    const item = items.find(
      i => i.producto.id === productoId
    );

    if (!item) {
      return;
    }

    if (item.cantidad > 1) {

      item.cantidad--;

      item.subtotal =
        item.cantidad * item.producto.precio;

    } else {

      this.eliminar(productoId);
      return;

    }

    this.itemsSubject.next(items);
  }

  eliminar(productoId: number): void {

    const items = this.itemsSubject.value.filter(
      item => item.producto.id !== productoId
    );

    this.itemsSubject.next(items);
  }

  obtenerItems(): CarritoItem[] {
    return this.itemsSubject.value;
  }

  obtenerCantidad(): number {

    return this.itemsSubject.value.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  obtenerTotal(): number {

    return this.itemsSubject.value.reduce(
      (total, item) => total + item.subtotal,
      0
    );
  }

  limpiar(): void {
    this.itemsSubject.next([]);
  }

  estaVacio(): boolean {
    return this.itemsSubject.value.length === 0;
  }
}