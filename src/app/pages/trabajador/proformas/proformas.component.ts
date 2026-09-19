import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

import { ProformaService } from '../../../core/services/proformas/proforma.service';

@Component({
  selector: 'app-proformas',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent
  ],
  templateUrl: './proformas.component.html',
  styleUrl: './proformas.component.css'
})
export class ProformasComponent {

  proformas;

  constructor(
    private proformaService: ProformaService
  ) {

    this.proformas =
      this.proformaService.obtenerTodas();

  }
}