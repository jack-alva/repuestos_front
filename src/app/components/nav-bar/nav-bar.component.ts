import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/services/auth/auth.service';
import { CarritoService } from '../../core/services/carrito/carrito.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  cantidadCarrito = 0;
  totalCarrito = 0;
  busqueda = '';

  constructor(
    public authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.carritoService.items$.subscribe(() => {

      this.cantidadCarrito =
        this.carritoService.obtenerCantidad();

      this.totalCarrito =
        this.carritoService.obtenerTotal();

    });

  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/home']);

  }

  buscar(): void {

    const termino = this.busqueda.trim();

    this.router.navigate(['/catalogo'], {
      queryParams: termino ? { busqueda: termino } : {}
    });

  }
}
