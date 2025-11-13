import { Injectable } from "@angular/core";
import { Career } from "../models/career.model";

@Injectable({
    providedIn: 'root'
})

export class carrerasService {
    private readonly STORAGE_KEY = 'instituciones'

    private saveToStorage(carreras: Career[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carreras));
    }

    getCarreras(){
        return this.getCarrerasFromStorage();
    }

    getCarrerasFromStorage(){
        const data = localStorage.getItem(this.STORAGE_KEY)
        return data ? JSON.parse(data) : []
    }

    addCarreras(register: Omit<Career, 'id'>): { success: boolean; message: string } {        
        const carrerasList = this.getCarrerasFromStorage();

        carrerasList.push(register);
        this.saveToStorage(carrerasList);

        return { success: true, message: 'Carrera agregada correctamente' };
    }

}

