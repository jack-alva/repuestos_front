import { Injectable } from '@angular/core';
import { Proforma } from '../../class/models/proforma';
import { CarritoService } from '../carrito/carrito.service';
import { AuthService } from '../auth/auth.service';
import { DetalleProforma } from '../../class/models/detalle-proforma';

@Injectable({
  providedIn: 'root'
})
export class ProformaService {

  private readonly STORAGE_KEY = 'proformas';

  private proformas: Proforma[] = [];

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
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

      detalles

    };

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
}