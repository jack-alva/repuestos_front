import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table.component';
import { Producto } from '../../../core/class/models/producto';
import { Categoria } from '../../../core/class/models/categoria';
import { Proveedor } from '../../../core/class/models/proveedor';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { CategoriaService } from '../../../core/services/categorias/categoria.service';
import { ProveedorService } from '../../../core/services/proveedores/proveedor.service';
import { ProformaService } from '../../../core/services/proformas/proforma.service';
import { Proforma } from '../../../core/class/models/proforma';

type Seccion = 'proformas' | 'productos' | 'categorias' | 'proveedores' | 'estadisticas';

@Component({ 
  selector: 'app-dashboard', 
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule,     
    ButtonModule, 
    DialogModule, 
    InputTextModule, 
    InputNumberModule, 
    SelectModule, 
    CrudTableComponent], 
  templateUrl: './dashboard.component.html', 
  styleUrl: './dashboard.component.css' })

export class DashboardComponent {
  seccion: Seccion = 'proformas'; 
  dialogo: 'producto' | 'categoria' | 'proveedor' | null = null;
  productos: Producto[] = []; 
  categorias: Categoria[] = []; 
  proveedores: Proveedor[] = []; 
  proformas: Proforma[] = [];
  producto!: Producto; 
  categoria: Categoria = { id: 0, nombre: '' }; 
  proveedor: Proveedor = { id: 0, nombre: '', telefono: '', correo: '' };
  readonly estados: Proforma['estado'][] = ['PENDIENTE', 'PREPARANDO', 'LISTO PARA RECOGER', 'ENTREGADO', 'CANCELADO'];

  constructor(private productoService: ProductoService, private categoriaService: CategoriaService, 
    private proveedorService: ProveedorService, private proformaService: ProformaService) { 
      this.producto = this.nuevoProducto(); this.refrescar(); 
  }

  refrescar(): void { 
    this.productos = this.productoService.obtenerProductos(); 
    this.categorias = this.categoriaService.obtenerTodas(); 
    this.proveedores = this.proveedorService.obtenerTodos(); 
    this.proformas = this.proformaService.obtenerTodas(); 
  }

  abrirProducto(item?: Producto): void { 
    this.producto = item ? { ...item } : this.nuevoProducto(); 
    this.dialogo = 'producto'; 
  }

  guardarProducto(): void { 
    if (!this.producto.nombre || !this.producto.categoria || !this.producto.marca || this.producto.precio <= 0) 
      return;
    this.producto.id ? this.productoService.actualizarProducto(this.producto) : this.productoService.agregarProducto(this.producto); 
    this.dialogo = null; this.refrescar(); 
  }

  editarCategoria(item: Categoria): void { 
    this.categoria = { ...item }; 
    this.dialogo = 'categoria'; 
  }

  guardarCategoria(): void { 
    if (!this.categoria.nombre.trim()) 
      return; 
    this.categoriaService.guardar(this.categoria); 
    this.dialogo = null; 
    this.categoria = { id: 0, nombre: '' }; 
    this.refrescar(); 
  }

  editarProveedor(item: Proveedor): void { 
    this.proveedor = { ...item }; 
    this.dialogo = 'proveedor'; 
  }

  guardarProveedor(): void { 
    if (!this.proveedor.nombre.trim()) 
      return;
    this.proveedorService.guardar(this.proveedor); 
    this.dialogo = null; 
    this.proveedor = { id: 0, nombre: '', telefono: '', correo: '' }; 
    this.refrescar(); 
  }

  actualizarEstado(proforma: Proforma, estado: Proforma['estado']): void { 
    this.proformaService.actualizarEstado(proforma.id, estado); 
    this.refrescar(); 
  }

  eliminarProducto(id: number): void { 
    this.productoService.eliminarProducto(id); 
    this.refrescar(); 
  }

  eliminarCategoria(id: number): void { 
    this.categoriaService.eliminar(id); 
    this.refrescar(); 
  }

  eliminarProveedor(id: number): void { 
    this.proveedorService.eliminar(id); 
    this.refrescar(); 
  }

  get stockBajo(): number { 
    return this.productos.filter(item => item.stock <= 10).length; 
  }

  private nuevoProducto(): Producto { 
    return { 
      id: 0, 
      codigo: this.productoService.siguienteCodigo(), 
      nombre: '', 
      descripcion: '', 
      categoria: '', 
      marca: '', 
      precio: 0, 
      stock: 0, 
      imagen: '', 
      demandaMensual: 0, 
      proveedorId: undefined 
    }; 
  }
}
