import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { JsonStorageService, Tec, Career } from '../../services/json-storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  tecs: Tec[] = [];
  selectedTec: Tec | null = null;

  // modals
  showAddTec = false;
  showAddCareer = false;

  // models
  newTec: Partial<Tec> = this.getEmptyTec();
  newCareer: Partial<Career> = this.getEmptyCareer();

  constructor(
    private storage: JsonStorageService,
    private auth: AuthService,
    private router: Router
  ) {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  private getEmptyTec(): Partial<Tec> {
    return {
      CCT: 0,
      nombre: '',
      direccion: '',
      correo: '',
      telefono: null,
      representante: '',
      puestoRepresentante: '',
      logo: undefined,
      carreras: []
    };
  }

  private getEmptyCareer(): Partial<Career> {
    return {
      nombre: '',
      clave: '',
      poblacion: '',
      logo: undefined
    };
  }

  loadData(): void {
    this.tecs = this.storage.getAllTecs();
  }

  // -------------------------------
  // INSTITUCIONES
  // -------------------------------
  openTecModal(): void {
    this.newTec = this.getEmptyTec();
    this.showAddTec = true;
  }

  closeTecModal(): void {
    this.showAddTec = false;
  }

  submitTec(): void {
    if (!this.newTec.nombre || !this.newTec.CCT) {
      alert('Nombre y CCT obligatorios');
      return;
    }

    const res = this.storage.addTec(this.newTec as any);
    alert(res.message);

    if (res.success) {
      this.loadData();
      this.showAddTec = false;
    }
  }

  handleTecLogoInput(files: FileList | null): void {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => (this.newTec.logo = reader.result as string);
    reader.readAsDataURL(file);
  }

  // -------------------------------
  // CARRERAS
  // -------------------------------
  viewCareers(tec: Tec): void {
    this.selectedTec = tec;
  }

  backToList(): void {
    this.selectedTec = null;
  }

  openCareerModal(): void {
    this.newCareer = this.getEmptyCareer();
    this.showAddCareer = true;
  }

  closeCareerModal(): void {
    this.showAddCareer = false;
  }

  handleCareerLogoInput(files: FileList | null): void {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => (this.newCareer.logo = reader.result as string);
    reader.readAsDataURL(file);
  }

  submitCareer(): void {
    if (!this.selectedTec) {
      alert('Selecciona institución');
      return;
    }

    if (!this.newCareer.nombre || !this.newCareer.clave) {
      alert('Nombre y clave obligatorios');
      return;
    }

    const res = this.storage.addCareerToTec(
      this.selectedTec.id,
      this.newCareer as any
    );
    alert(res.message);

    if (res.success) {
      this.loadData();
      this.selectedTec = this.storage.getTecById(this.selectedTec.id) ?? null;
      this.showAddCareer = false;
    }
  }

  deleteCareer(careerId: number): void {
    if (!this.selectedTec) return;

    if (!confirm('¿Eliminar esta carrera?')) return;

    const res = this.storage.deleteCareer(this.selectedTec.id, careerId);
    alert(res.message);

    if (res.success) {
      this.loadData();
      this.selectedTec = this.storage.getTecById(this.selectedTec.id) ?? null;
    }
  }

  deleteTec(tecId: number): void {
    if (!confirm('¿Eliminar esta institución?')) return;

    const res = this.storage.deleteTec(tecId);
    alert(res.message);

    if (res.success) {
      this.loadData();
    }
  }

  // -------------------------------
  // SESIÓN
  // -------------------------------
  logout(): void {
    this.auth.logout();
  }
}
