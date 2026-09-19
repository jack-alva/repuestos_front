import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoService } from '../../../core/services/productos/producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  productos;

  constructor(
    private productoService: ProductoService
  ) {

    this.productos =
      this.productoService.obtenerProductos();

  }
}
