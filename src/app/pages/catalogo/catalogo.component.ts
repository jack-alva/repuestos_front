import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

import { Producto } from '../../core/class/models/producto';
import { ProductoService } from '../../core/services/productos/producto.service';
import { CarritoService } from '../../core/services/carrito/carrito.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavBarComponent
],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  busqueda = '';
  categoria = '';

  categorias: string[] = [];

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {

    this.productos =
      this.productoService.obtenerProductos();

    this.productosFiltrados =
      [...this.productos];

    this.categorias =
      this.productoService.obtenerCategorias();
  }

  filtrar(): void {

    const termino =
      this.busqueda.toLowerCase().trim();

    this.productosFiltrados =
      this.productos.filter(producto => {

        const coincideTexto =
          !termino ||
          producto.nombre.toLowerCase().includes(termino) ||
          producto.codigo.toLowerCase().includes(termino) ||
          producto.marca.toLowerCase().includes(termino);

        const coincideCategoria =
          !this.categoria ||
          producto.categoria === this.categoria;

        return coincideTexto && coincideCategoria;

      });
  }

  agregar(producto: Producto): void {
    this.carritoService.agregar(producto);
  }
}