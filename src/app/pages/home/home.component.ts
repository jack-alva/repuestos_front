import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

import { Producto } from '../../core/class/models/producto';
import { ProductoService } from '../../core/services/productos/producto.service';
import { CarritoService } from '../../core/services/carrito/carrito.service';
import { ProformaService } from '../../core/services/proformas/proforma.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,

    ButtonModule,
    CardModule,
    ChartModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  productos: Producto[] = [];

  datosGrafico: any;
  opcionesGrafico: any;

  totalReservado = 0;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private proformaService: ProformaService,
    public authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    if (this.authService.obtenerRol() === 'TRABAJADOR') this.router.navigate(['/trabajador/dashboard']);
    this.productos =
      this.productoService.obtenerProductos();

    this.generarGrafico();
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregar(producto);
    this.messageService.add({ severity: 'success', summary: 'Producto añadido', detail: `${producto.nombre} fue agregado al carrito.`, life: 3000 });
  }

  usarImagenAlternativa(evento: Event): void {
    (evento.target as HTMLImageElement).src = '/images/logo.png';
  }

  private generarGrafico(): void {

    const hoy = new Date();

    const fechas: string[] = [];
    const cantidades: number[] = [];

    const proformas =
      this.proformaService.obtenerTodas();

    this.totalReservado = 0;

    for (let i = 29; i >= 0; i--) {

      const fecha = new Date(hoy);

      fecha.setDate(
        hoy.getDate() - i
      );

      const fechaTexto =
        this.obtenerFechaTexto(fecha);

      fechas.push(
        this.formatearFecha(fecha)
      );

      let cantidadDelDia = 0;

      proformas.forEach(proforma => {

        const fechaProforma =
          new Date(proforma.fecha);

        const fechaProformaTexto =
          this.obtenerFechaTexto(fechaProforma);

        if (fechaProformaTexto === fechaTexto) {

          proforma.detalles.forEach(detalle => {

            cantidadDelDia +=
              detalle.cantidad;

            this.totalReservado +=
              detalle.cantidad;
          });
        }
      });

      cantidades.push(
        cantidadDelDia
      );
    }

    this.datosGrafico = {
      labels: fechas,

      datasets: [
        {
          label: 'Productos reservados',
          data: cantidades,
          tension: 0.4,
          fill: true
        }
      ]
    };

    this.opcionesGrafico = {

      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    };
  }

  private obtenerFechaTexto(
    fecha: Date
  ): string {

    return (
      fecha.getFullYear() +
      '-' +
      String(
        fecha.getMonth() + 1
      ).padStart(2, '0') +
      '-' +
      String(
        fecha.getDate()
      ).padStart(2, '0')
    );
  }

  private formatearFecha(
    fecha: Date
  ): string {

    return fecha.toLocaleDateString(
      'es-PE',
      {
        day: '2-digit',
        month: '2-digit'
      }
    );
  }
}
