import { Injectable } from '@angular/core';
import { Proforma } from '../../class/models/proforma';
import { CarritoService } from '../carrito/carrito.service';
import { AuthService } from '../auth/auth.service';
import { DetalleProforma } from '../../class/models/detalle-proforma';
import { ProductoService } from '../productos/producto.service';

@Injectable({
  providedIn: 'root'
})
export class ProformaService {

  private readonly STORAGE_KEY = 'proformas';

  private proformas: Proforma[] = [];

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
    this.cargarProformas();
  }

  private cargarProformas(): void {

    const proformasGuardadas =
      localStorage.getItem(this.STORAGE_KEY);

    if (proformasGuardadas) {

      this.proformas =
        JSON.parse(proformasGuardadas);

    } else {

      this.proformas = [];

    }
  }

  private guardarProformas(): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.proformas)
    );

  }

  generarProforma(): Proforma | null {

    const usuario =
      this.authService.obtenerUsuario();

    const items =
      this.carritoService.obtenerItems();

    if (!usuario || items.length === 0) {
      return null;
    }
    if (items.some(item => item.cantidad > (this.productoService.obtenerProductoPorId(item.producto.id)?.stock ?? 0))) return null;

    const detalles: DetalleProforma[] =
      items.map(item => ({
        productoId: item.producto.id,
        codigoProducto: item.producto.codigo,
        nombreProducto: item.producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio,
        subtotal: item.subtotal
      }));

    const total =
      this.carritoService.obtenerTotal();

    const proforma: Proforma = {

      id: this.generarId(),

      codigo: this.generarCodigo(),

      usuarioId: usuario.id,

      fecha: new Date().toISOString(),

      estado: 'PENDIENTE',

      total,
      detalles,
      pagoPresencial: false,
      reservaVenceEn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()

    };

    detalles.forEach(detalle => {
      const producto = this.productoService.obtenerProductoPorId(detalle.productoId);
      if (producto) this.productoService.actualizarProducto({ ...producto, stock: producto.stock - detalle.cantidad });
    });
    this.proformas.push(proforma);

    this.guardarProformas();

    this.carritoService.limpiar();

    return proforma;
  }

  private generarId(): number {

    if (this.proformas.length === 0) {
      return 1;
    }

    return Math.max(
      ...this.proformas.map(proforma => proforma.id)
    ) + 1;
  }

  private generarCodigo(): string {

    const fecha = new Date();

    const fechaTexto =
      fecha.getFullYear().toString() +
      (fecha.getMonth() + 1)
        .toString()
        .padStart(2, '0') +
      fecha.getDate()
        .toString()
        .padStart(2, '0');

    const numero =
      Math.floor(1000 + Math.random() * 9000);

    return `PRO-${fechaTexto}-${numero}`;
  }

  obtenerProformasUsuario(): Proforma[] {

    const usuario =
      this.authService.obtenerUsuario();

    if (!usuario) {
      return [];
    }

    return this.proformas.filter(
      proforma =>
        proforma.usuarioId === usuario.id
    );
  }

  obtenerTodas(): Proforma[] {

    return [...this.proformas];

  }

  obtenerPorCodigo(codigo: string): Proforma | undefined { return this.proformas.find(proforma => proforma.codigo === codigo); }

  actualizarEstado(id: number, estado: Proforma['estado']): void {
    const actual = this.proformas.find(proforma => proforma.id === id);
    if (!actual || actual.estado === estado) return;
    if (estado === 'CANCELADO' && actual.estado !== 'CANCELADO') this.liberarReserva(actual);
    this.proformas = this.proformas.map(proforma => proforma.id === id ? { ...proforma, estado } : proforma);
    this.guardarProformas();
  }

  registrarPago(id: number): void {
    this.proformas = this.proformas.map(proforma => proforma.id === id ? { ...proforma, pagoPresencial: true, fechaPago: new Date().toISOString() } : proforma);
    this.guardarProformas();
  }

  private liberarReserva(proforma: Proforma): void {
    proforma.detalles.forEach(detalle => {
      const producto = this.productoService.obtenerProductoPorId(detalle.productoId);
      if (producto) this.productoService.actualizarProducto({ ...producto, stock: producto.stock + detalle.cantidad });
    });
  }
}
