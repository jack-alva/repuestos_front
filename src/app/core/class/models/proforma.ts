import { DetalleProforma } from './detalle-proforma';

export interface Proforma {
  id: number;
  codigo: string;
  usuarioId: number;
  fecha: string;
  estado: 'PENDIENTE' | 'PREPARANDO' | 'LISTO PARA RECOGER' | 'ENTREGADO' | 'CANCELADO';
  total: number;
  detalles: DetalleProforma[];
  pagoPresencial?: boolean;
  fechaPago?: string;
  reservaVenceEn?: string;
}
