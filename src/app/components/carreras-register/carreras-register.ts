import { Component } from '@angular/core';
import { Career } from '../../models/career.model';

@Component({
  selector: 'app-carreras-register',
  imports: [],
  templateUrl: './carreras-register.html',
  styleUrl: './carreras-register.css'
})
export class CarrerasRegister {
    nuevaCarrera: Omit<Career, 'id'> ={
    nombre: '',
    clave: '',
    poblacion: '',
    logo: ''
    }
}
