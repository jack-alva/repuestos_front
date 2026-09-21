import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { TableModule } from 'primeng/table';

/**
 * Base visual para los listados del sistema. Cada pantalla aporta sus columnas
 * y filas, mientras que paginación, estados vacíos y el contenedor se mantienen
 * consistentes.
 */
@Component({
  selector: 'app-crud-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './crud-table.component.html'
})
export class CrudTableComponent<T> {
  @Input({ required: true }) value: T[] = [];
  @Input() dataKey = 'id';
  @Input() emptyMessage = 'No hay registros para mostrar.';
  @Input() paginator = true;
  @Input() rows = 8;

  @ContentChild('header', { read: TemplateRef }) headerTemplate?: TemplateRef<unknown>;
  @ContentChild('body', { read: TemplateRef }) bodyTemplate?: TemplateRef<unknown>;
}
