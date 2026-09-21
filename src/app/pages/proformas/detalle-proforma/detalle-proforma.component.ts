import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Proforma } from '../../../core/class/models/proforma';
import { ProformaService } from '../../../core/services/proformas/proforma.service';

@Component({ selector: 'app-detalle-proforma', standalone: true, imports: [CommonModule, RouterLink, ButtonModule], templateUrl: './detalle-proforma.component.html' })
export class DetalleProformaComponent implements OnInit {
  proforma?: Proforma;
  constructor(private route: ActivatedRoute, private service: ProformaService) {}
  ngOnInit(): void { this.proforma = this.service.obtenerPorCodigo(this.route.snapshot.paramMap.get('codigo') ?? ''); }
  imprimir(): void { window.print(); }
}
