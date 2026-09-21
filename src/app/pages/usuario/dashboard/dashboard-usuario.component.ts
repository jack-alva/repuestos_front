import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CarritoService } from '../../../core/services/carrito/carrito.service';
import { ProformaService } from '../../../core/services/proformas/proforma.service';

@Component({ selector: 'app-dashboard-usuario', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './dashboard-usuario.component.html' })
export class DashboardUsuarioComponent implements OnInit {
  cantidadCarrito = 0;
  totalCarrito = 0;
  proformas = 0;
  constructor(public authService: AuthService, private carrito: CarritoService, private proforma: ProformaService) {}
  ngOnInit(): void {
    this.carrito.items$.subscribe(() => { this.cantidadCarrito = this.carrito.obtenerCantidad(); this.totalCarrito = this.carrito.obtenerTotal(); });
    this.proformas = this.proforma.obtenerTodas().length;
  }
}
