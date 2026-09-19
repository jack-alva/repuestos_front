import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Producto } from '../../core/class/models/producto';
import { ProductoService } from '../../core/services/productos/producto.service';
import { CarritoService } from '../../core/services/carrito/carrito.service';
import { ProformaService } from '../../core/services/proformas/proforma.service';

interface PuntoGrafico {
  fecha: string;
  etiqueta: string;
  cantidad: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  productos: Producto[] = [];

  puntosGrafico: PuntoGrafico[] = [];

  puntosLinea = '';

  cantidadMaxima = 0;

  totalReservado = 0;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private proformaService: ProformaService
  ) {

    this.productos =
      this.productoService.obtenerProductos();

    this.generarGrafico();

  }

  agregarAlCarrito(producto: Producto): void {

    this.carritoService.agregar(producto);

  }

  private generarGrafico(): void {

    const hoy = new Date();

    const datos: {
      fecha: Date;
      etiqueta: string;
      cantidad: number;
    }[] = [];

    /*
     * Generamos los últimos 30 días.
     * Incluso si un día no hubo reservas,
     * aparecerá con cantidad 0.
     */

    for (let i = 29; i >= 0; i--) {

      const fecha = new Date(hoy);

      fecha.setHours(0, 0, 0, 0);

      fecha.setDate(
        hoy.getDate() - i
      );

      const fechaTexto =
        this.formatearFecha(fecha);

      datos.push({
        fecha,
        etiqueta: `${fecha.getDate().toString().padStart(2, '0')}/${(
          fecha.getMonth() + 1
        ).toString().padStart(2, '0')}`,
        cantidad: 0
      });

    }

    const proformas =
      this.proformaService.obtenerTodas();

    /*
     * Sumamos las cantidades de cada detalle
     * de las proformas según su fecha.
     */

    for (const proforma of proformas) {

      const fechaProforma =
        new Date(proforma.fecha);

      const fechaTexto =
        this.formatearFecha(fechaProforma);

      const dia =
        datos.find(
          dato =>
            this.formatearFecha(dato.fecha) ===
            fechaTexto
        );

      if (!dia) {
        continue;
      }

      for (const detalle of proforma.detalles) {

        dia.cantidad +=
          detalle.cantidad;

      }

    }

    this.totalReservado =
      datos.reduce(
        (total, dato) =>
          total + dato.cantidad,
        0
      );

    this.cantidadMaxima =
      Math.max(
        ...datos.map(
          dato => dato.cantidad
        ),
        0
      );

    this.crearPuntosGrafico(datos);

  }

  private crearPuntosGrafico(
    datos: {
      fecha: Date;
      etiqueta: string;
      cantidad: number;
    }[]
  ): void {

    const ancho = 1000;

    const alto = 320;

    const margenX = 45;

    const margenSuperior = 20;

    const margenInferior = 40;

    const anchoUtil =
      ancho - margenX * 2;

    const altoUtil =
      alto -
      margenSuperior -
      margenInferior;

    const maximo =
      this.cantidadMaxima > 0
        ? this.cantidadMaxima
        : 1;

    this.puntosGrafico =
      datos.map(
        (dato, index) => {

          const x =
            margenX +
            (index /
              (datos.length - 1)) *
              anchoUtil;

          const y =
            margenSuperior +
            altoUtil -
            (dato.cantidad / maximo) *
              altoUtil;

          return {
            fecha: this.formatearFecha(dato.fecha),
            etiqueta: dato.etiqueta,
            cantidad: dato.cantidad,
            x,
            y
          };

        }
      );

    this.puntosLinea =
      this.puntosGrafico
        .map(
          punto =>
            `${punto.x},${punto.y}`
        )
        .join(' ');

  }

  private formatearFecha(
    fecha: Date
  ): string {

    const año =
      fecha.getFullYear();

    const mes =
      (fecha.getMonth() + 1)
        .toString()
        .padStart(2, '0');

    const dia =
      fecha.getDate()
        .toString()
        .padStart(2, '0');

    return `${año}-${mes}-${dia}`;

  }

  mostrarEtiqueta(
    index: number
  ): boolean {

    /*
     * Para no llenar el eje inferior
     * con 30 fechas, mostramos algunas.
     */

    return (
      index === 0 ||
      index === 7 ||
      index === 14 ||
      index === 21 ||
      index === 29
    );

  }

}
