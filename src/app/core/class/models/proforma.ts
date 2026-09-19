import { DetalleProforma } from './detalle-proforma';

export interface Proforma {
  id: number;
  codigo: string;
  usuarioId: number;
  fecha: string;
  estado: 'PENDIENTE' | 'ATENDIDA' | 'CANCELADA';
  total: number;
  detalles: DetalleProforma[];
}