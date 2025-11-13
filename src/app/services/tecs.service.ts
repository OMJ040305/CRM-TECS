import { Injectable } from '@angular/core';
import { Tec } from '../models/tecs.model';
import { Career } from '../models/career.model';

@Injectable({
  providedIn: 'root'
})
export class TecService {
  private STORAGE = 'instituciones';

  getAll(): Tec[] {
    const raw = localStorage.getItem(this.STORAGE);
    return raw ? (JSON.parse(raw) as Tec[]) : [];
  }

  getById(id: number): Tec | undefined {
    return this.getAll().find(t => t.id === id);
  }

  add(tec: Omit<Tec, 'id' | 'carreras'>): { success: boolean; message: string } {
    const tecs = this.getAll();
    if (tecs.some(t => t.CCT === tec.CCT)) {
      return { success: false, message: 'CCT ya registrado' };
    }
    const newTec: Tec = { id: Date.now(), ...tec, carreras: [] };
    tecs.push(newTec);
    localStorage.setItem(this.STORAGE, JSON.stringify(tecs));
    return { success: true, message: 'Institución registrada' };
  }

  addCareer(tecId: number, career: Omit<Career, 'id'>): { success: boolean; message: string } {
    const tecs = this.getAll();
    const idx = tecs.findIndex(t => t.id === tecId);
    if (idx === -1) return { success: false, message: 'Institución no encontrada' };

    tecs[idx].carreras = tecs[idx].carreras ?? [];
    if (tecs[idx].carreras!.some(c => c.clave === career.clave)) {
      return { success: false, message: 'Clave de carrera ya existe' };
    }
    const newCareer: Career = { id: Date.now(), ...career };
    tecs[idx].carreras!.push(newCareer);
    localStorage.setItem(this.STORAGE, JSON.stringify(tecs));
    return { success: true, message: 'Carrera agregada' };
  }
}
