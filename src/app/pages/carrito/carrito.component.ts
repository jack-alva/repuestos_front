import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CarritoItem } from '../../core/class/models/carrito-item';
import { CarritoService } from '../../core/services/carrito/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  items: CarritoItem[] = [];
  total = 0;

  constructor(
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {

    this.carritoService.items$
      .subscribe(items => {

        this.items = items;

        this.total =
          this.carritoService.obtenerTotal();

      });
  }

  aumentar(item: CarritoItem): void {
    this.carritoService.agregar(item.producto);
  }

  disminuir(item: CarritoItem): void {
    this.carritoService.disminuir(item.producto.id);
  }

  eliminar(item: CarritoItem): void {
    this.carritoService.eliminar(item.producto.id);
  }
}
