import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Proforma } from '../../../core/class/models/proforma';
import { ProformaService } from '../../../core/services/proformas/proforma.service';

@Component({
  selector: 'app-mis-proformas',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './mis-proformas.component.html',
  styleUrl: './mis-proformas.component.css'
})
export class MisProformasComponent implements OnInit {

  proformas: Proforma[] = [];

  constructor(
    private proformaService: ProformaService
  ) {}

  ngOnInit(): void {

    this.proformas =
      this.proformaService
        .obtenerProformasUsuario();

  }
}
