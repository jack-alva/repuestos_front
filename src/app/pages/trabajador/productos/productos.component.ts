import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductoService } from '../../../core/services/productos/producto.service';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Producto } from '../../../core/class/models/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CrudTableComponent,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  productos: Producto[] = [];
  mostrarFormulario = false;
  nuevoProducto = this.crearFormulario();

  constructor(
    private productoService: ProductoService
  ) {

    this.productos =
      this.productoService.obtenerProductos();

  }

  guardarProducto(): void {
    if (!this.nuevoProducto.codigo || !this.nuevoProducto.nombre || !this.nuevoProducto.categoria || !this.nuevoProducto.marca || this.nuevoProducto.precio <= 0 || this.nuevoProducto.stock < 0) return;
    this.productoService.agregarProducto({ ...this.nuevoProducto, imagen: '', descripcion: this.nuevoProducto.nombre, demandaMensual: 0, modeloCompatible: '' });
    this.productos = this.productoService.obtenerProductos();
    this.mostrarFormulario = false;
    this.nuevoProducto = this.crearFormulario();
  }

  private crearFormulario() {
    return { codigo: '', nombre: '', categoria: '', marca: '', precio: 0, stock: 0 };
  }
}
