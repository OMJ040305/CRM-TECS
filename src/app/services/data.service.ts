import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import DATA from '../data.json';

export interface Escuela {
  id: string;
  nombre: string;
  cct: string;
  telefono: string;
  extension: string;
  correo: string;
  representanteNombre: string;
  representantePuesto: string;
  direccion: string;
  pagina: string;
  encargadoRegistro: string;
}

export interface Carrera {
  id: string;
  name: string;
  code: string;
  escuelaId: string;
  studentsCount: number;
}

interface DataPayload {
  escuelas: Escuela[];
  carreras: Carrera[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<DataPayload>(DATA.payload);
  public data$ = this.dataSubject.asObservable();

  constructor() {
    // Cargar datos iniciales
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Si necesitas cargar desde localStorage como fallback
    const stored = localStorage.getItem('app_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.dataSubject.next(parsed);
      } catch (e) {
        console.error('Error al parsear datos almacenados', e);
        this.dataSubject.next(DATA.payload);
      }
    } else {
      this.dataSubject.next(DATA.payload);
    }
  }

  // Método para guardar cambios en localStorage (persistencia local)
  private saveToStorage(): void {
    const currentData = this.dataSubject.value;
    localStorage.setItem('app_data', JSON.stringify(currentData));
  }

  // ============= ESCUELAS =============

  getEscuelas(): Escuela[] {
    return this.dataSubject.value.escuelas;
  }

  getEscuelaById(id: string): Escuela | undefined {
    return this.dataSubject.value.escuelas.find(e => e.id === id);
  }

  getEscuelaByCCT(cct: string): Escuela | undefined {
    return this.dataSubject.value.escuelas.find(e => e.cct === cct);
  }

  addEscuela(escuela: Omit<Escuela, 'id'>): { success: boolean; message: string } {
    const currentData = this.dataSubject.value;

    // Verificar si ya existe el CCT
    if (currentData.escuelas.some(e => e.cct === escuela.cct)) {
      return { success: false, message: 'El CCT ya está registrado' };
    }

    const newEscuela: Escuela = {
      ...escuela,
      id: `esc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const updatedData = {
      ...currentData,
      escuelas: [...currentData.escuelas, newEscuela]
    };

    this.dataSubject.next(updatedData);
    this.saveToStorage();

    return { success: true, message: 'Escuela registrada exitosamente' };
  }

  updateEscuela(id: string, updates: Partial<Escuela>): { success: boolean; message: string } {
    const currentData = this.dataSubject.value;
    const index = currentData.escuelas.findIndex(e => e.id === id);

    if (index === -1) {
      return { success: false, message: 'Escuela no encontrada' };
    }

    const updatedEscuelas = [...currentData.escuelas];
    updatedEscuelas[index] = { ...updatedEscuelas[index], ...updates };

    const updatedData = {
      ...currentData,
      escuelas: updatedEscuelas
    };

    this.dataSubject.next(updatedData);
    this.saveToStorage();

    return { success: true, message: 'Escuela actualizada exitosamente' };
  }

  deleteEscuela(id: string): { success: boolean; message: string } {
    const currentData = this.dataSubject.value;

    // Verificar si hay carreras asociadas
    const hasCarreras = currentData.carreras.some(c => c.escuelaId === id);
    if (hasCarreras) {
      return { success: false, message: 'No se puede eliminar: hay carreras asociadas' };
    }

    const updatedData = {
      ...currentData,
      escuelas: currentData.escuelas.filter(e => e.id !== id)
    };

    this.dataSubject.next(updatedData);
    this.saveToStorage();

    return { success: true, message: 'Escuela eliminada exitosamente' };
  }

  // ============= CARRERAS =============

  getCarreras(): Carrera[] {
    return this.dataSubject.value.carreras;
  }

  getCarrerasByEscuela(escuelaId: string): Carrera[] {
    return this.dataSubject.value.carreras.filter(c => c.escuelaId === escuelaId);
  }

  getCarreraById(id: string): Carrera | undefined {
    return this.dataSubject.value.carreras.find(c => c.id === id);
  }

  addCarrera(carrera: Omit<Carrera, 'id'>): { success: boolean; message: string } {
    const currentData = this.dataSubject.value;

    // Verificar si la escuela existe
    if (!currentData.escuelas.some(e => e.id === carrera.escuelaId)) {
      return { success: false, message: 'La escuela no existe' };
    }

    // Verificar si ya existe el código de carrera en esa escuela
    if (currentData.carreras.some(c =>
      c.code === carrera.code && c.escuelaId === carrera.escuelaId
    )) {
      return { success: false, message: 'El código de carrera ya existe en esta escuela' };
    }

    const newCarrera: Carrera = {
      ...carrera,
      id: `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const updatedData = {
      ...currentData,
      carreras: [...currentData.carreras, newCarrera]
    };

    this.dataSubject.next(updatedData);
    this.saveToStorage();

    return { success: true, message: 'Carrera registrada exitosamente' };
  }

  updateCarrera(id: string, updates: Partial<Carrera>): { success: boolean; message: string } {
    const currentData = this.dataSubject.value;
    const index = currentData.carreras.findIndex(c => c.id === id);

    if (index === -1) {
      return { success: false, message: 'Carrera no encontrada' };
    }

    const updatedCarreras = [...currentData.carreras];
    updatedCarreras[index] = { ...updatedCarreras[index], ...updates };

    const updatedData = {
      ...currentData,
      carreras: updatedCarreras
    };

    this.dataSubject.next(updatedData);
    this.saveToStorage();

    return { success: true, message: 'Carrera actualizada exitosamente' };
  }

  deleteCarrera(id: string): { success: boolean; message: string } {
    const currentData = this.dataSubject.value;

    const updatedData = {
      ...currentData,
      carreras: currentData.carreras.filter(c => c.id !== id)
    };

    this.dataSubject.next(updatedData);
    this.saveToStorage();

    return { success: true, message: 'Carrera eliminada exitosamente' };
  }

  // ============= UTILIDADES =============

  resetData(): void {
    this.dataSubject.next(DATA.payload);
    localStorage.removeItem('app_data');
  }

  exportData(): string {
    return JSON.stringify(this.dataSubject.value, null, 2);
  }

  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.escuelas || !parsed.carreras) {
        return { success: false, message: 'Formato de datos inválido' };
      }
      this.dataSubject.next(parsed);
      this.saveToStorage();
      return { success: true, message: 'Datos importados exitosamente' };
    } catch (e) {
      return { success: false, message: 'Error al parsear JSON' };
    }
  }
}
