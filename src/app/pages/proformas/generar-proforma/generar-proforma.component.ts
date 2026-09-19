import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

import { Proforma } from '../../../core/class/models/proforma';
import { ProformaService } from '../../../core/services/proformas/proforma.service';

@Component({
  selector: 'app-generar-proforma',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavBarComponent
  ],
  templateUrl: './generar-proforma.component.html',
  styleUrl: './generar-proforma.component.css'
})
export class GenerarProformaComponent {

  proforma: Proforma | null = null;

  constructor(
    private proformaService: ProformaService,
    private router: Router
  ) {}

  generar(): void {

    const resultado =
      this.proformaService.generarProforma();

    if (!resultado) {
      return;
    }

    this.proforma = resultado;
  }

  imprimir(): void {
    window.print();
  }
}