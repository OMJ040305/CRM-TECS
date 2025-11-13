import { Career } from './career.model';

export interface Tec {
  id: number;
  CCT: number;
  nombre: string;
  direccion: string;
  correo: string;
  telefono: string | null;
  representante: string;
  puestoRepresentante: string;
  logo?: string;
  carreras: Career[];
}
