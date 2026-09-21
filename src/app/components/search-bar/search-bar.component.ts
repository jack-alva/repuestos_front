import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, InputTextModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  busqueda = '';

  constructor(private router: Router) {}

  buscar(): void {
    const termino = this.busqueda.trim();
    this.router.navigate(['/catalogo'], { queryParams: termino ? { busqueda: termino } : {} });
  }
}
