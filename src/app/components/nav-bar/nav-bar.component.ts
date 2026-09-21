import {
  Component,
  OnInit
} from '@angular/core';

import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth/auth.service';
import { CarritoService } from '../../core/services/carrito/carrito.service';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    SearchBarComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  cantidadCarrito = 0;
  totalCarrito = 0;
  mostrarBuscador = false;

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
    this.mostrarBuscador = this.esRutaConBusqueda(this.router.url);
    this.router.events.pipe(filter(evento => evento instanceof NavigationEnd)).subscribe(evento => {
      this.mostrarBuscador = this.esRutaConBusqueda((evento as NavigationEnd).urlAfterRedirects);
    });

  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/home']);

  }

  rutaPanel(): string {
    return this.authService.obtenerRol() === 'TRABAJADOR' ? '/trabajador/dashboard' : '/mi-cuenta';
  }

  rutaPrincipal(): string { 
    return this.authService.obtenerRol() === 'TRABAJADOR' ? '/trabajador/dashboard' : '/home'; 
  }

  private esRutaConBusqueda(url: string): boolean {
    return url.startsWith('/home') || url.startsWith('/catalogo');
  }
}
