import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Producto } from '../../core/class/models/producto';
import { ProductoService } from '../../core/services/productos/producto.service';
import { CarritoService } from '../../core/services/carrito/carrito.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule
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
  categoriasOpciones: { label: string; value: string }[] = [];

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.productos =
      this.productoService.obtenerProductos();

    this.productosFiltrados =
      [...this.productos];

    this.categorias =
      this.productoService.obtenerCategorias();
    this.categoriasOpciones = [
      { label: 'Todas las categorías', value: '' },
      ...this.categorias.map(categoria => ({ label: categoria, value: categoria }))
    ];

    this.route.queryParamMap.subscribe(params => {
      this.busqueda = params.get('busqueda') ?? '';
      this.filtrar();
    });
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
    this.messageService.add({ severity: 'success', summary: 'Producto añadido', detail: `${producto.nombre} fue agregado al carrito.`, life: 3000 });
  }

  usarImagenAlternativa(evento: Event): void {
    (evento.target as HTMLImageElement).src = '/images/logo.png';
  }
}
