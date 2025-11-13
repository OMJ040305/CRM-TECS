import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { UserService } from '../../services/user.service';
import { TecService } from '../../services/tecs.service';
import { User } from '../../models/users.model';
import { Tec } from '../../models/tecs.model';
import { Career } from '../../models/career.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  // modal flags
  showTecModal = false;
  showUserModal = false;
  showCareerModal = false;

  // lists
  tecs: Tec[] = [];
  users: User[] = [];

  // models for forms
  newTec: Tec = this.emptyTec();
  newUser: Omit<User, 'id'> = { nombre: '', correo: '', password: '', rol: 'estudiante' };
  newCareer: Career = { nombre: '', clave: '', poblacion: '', logo: 'undefined' };

  // helper to select a tec for adding careers
  selectedTecCCT: number | null = null;

  // message (feedback)
  message = '';

  constructor(private userService: UserService, private tecService: TecService) {
    this.loadAll();
  }

emptyTec(): Tec {
  return {
    id: Date.now(), // genera un id único basado en la fecha actual
    CCT: 0,
    nombre: '',
    direccion: '',
    correo: '',
    telefono: null,
    representante: '',
    puestoRepresentante: '',
    carreras: [],
    logo: undefined
  };
}


  loadAll() {
    this.tecs = this.tecService.getAll();
    this.users = this.userService.getAll();
  }

  // ---------- USERS ----------
  openUserModal() {
    this.newUser = { nombre: '', correo: '', password: '', rol: 'estudiante' };
    this.showUserModal = true;
  }

  onUserModalClose() {
    this.showUserModal = false;
    this.message = '';
  }

  submitUser() {
    // basic validation
    if (!this.newUser.nombre.trim() || !this.newUser.correo.trim() || !this.newUser.password.trim()) {
      this.message = 'Completa todos los campos del usuario.';
      return;
    }
    const res = this.userService.add(this.newUser);
    this.message = res.message;
    if (res.success) {
      this.loadAll();
      this.showUserModal = false;
    }
  }

  // ---------- TECS ----------
  openTecModal() {
    this.newTec = this.emptyTec();
    this.showTecModal = true;
  }

  onTecModalClose() {
    this.showTecModal = false;
    this.message = '';
  }

  submitTec() {
    // validation
    if (!this.newTec.nombre.trim() || !this.newTec.CCT) {
      this.message = 'Nombre y CCT son obligatorios.';
      return;
    }
    const res = this.tecService.add(this.newTec);
    this.message = res.message;
    if (res.success) {
      this.loadAll();
      this.showTecModal = false;
    }
  }

  // handle logo upload for tec (file input)
  handleTecLogoInput(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.newTec.logo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ---------- CAREERS ----------
  openCareerModal(cct: number) {
    this.selectedTecCCT = cct;
    this.newCareer = { nombre: '', clave: '', poblacion: '', logo: 'undefined' };
    this.showCareerModal = true;
  }

  onCareerModalClose() {
    this.showCareerModal = false;
    this.selectedTecCCT = null;
    this.message = '';
  }

  submitCareer() {
    if (!this.selectedTecCCT) {
      this.message = 'Selecciona una institución.';
      return;
    }
    if (!this.newCareer.nombre.trim() || !this.newCareer.clave.trim()) {
      this.message = 'Nombre y clave son obligatorios.';
      return;
    }
    const res = this.tecService.addCareer(this.selectedTecCCT, this.newCareer);
    this.message = res.message;
    if (res.success) {
      this.loadAll();
      this.showCareerModal = false;
      this.selectedTecCCT = null;
    }
  }

  handleCareerLogoInput(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.newCareer.logo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // helper: preview logo or fallback
  getTecLogo(tec: Tec) {
    return tec.logo ? tec.logo : null;
  }
}
