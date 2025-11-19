import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {ModalComponent} from '../modal/modal.component';
import {JsonStorageService, Tec, Career} from '../../services/json-storage.service';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  tecs: Tec[] = [];
  selectedTec: Tec | null = null;

  showAddTec = false;
  showAddCareer = false;
  showEditCareer = false;

  newTec: Partial<Tec> = this.getEmptyTec();
  newCareer: Partial<Career> = this.getEmptyCareer();
  editingCareer: Career | null = null;

  private dataSubscription?: Subscription;

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

    this.dataSubscription = this.storage.data$.subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
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
      alumnosEsperados: 100,
      logo: undefined
    };
  }

  loadData(): void {
    this.tecs = this.storage.getAllTecs();
  }

  // Calcular porcentaje de ocupación de una carrera
  getOcupacionPercentage(carrera: Career): number {
    const esperados = parseInt(String(carrera.alumnosEsperados)) || 0;
    const inscritos = parseInt(String(carrera.poblacion)) || 0;

    if (esperados === 0) return 0;
    return Math.min((inscritos / esperados) * 100, 100);
  }

  // Obtener altura de barra para alumnos inscritos
  getBarHeight(carrera: Career, tipo: 'esperados' | 'inscritos'): number {
    const esperados = parseInt(String(carrera.alumnosEsperados)) || 0;
    const inscritos = parseInt(String(carrera.poblacion)) || 0;
    const max = Math.max(esperados, inscritos, 1);

    if (tipo === 'esperados') {
      return (esperados / max) * 100;
    } else {
      return (inscritos / max) * 100;
    }
  }

  // Determinar estado de la carrera
  getCareerStatus(carrera: Career): { label: string; color: string } {
    const esperados = parseInt(String(carrera.alumnosEsperados)) || 0;
    const inscritos = parseInt(String(carrera.poblacion)) || 0;

    if (esperados === 0) {
      return {label: 'Sin meta', color: '#9ca3af'};
    }

    const porcentaje = (inscritos / esperados) * 100;

    if (porcentaje >= 90) {
      return {label: 'Completo', color: '#10b981'};
    } else if (porcentaje >= 70) {
      return {label: 'Óptimo', color: '#3b82f6'};
    } else if (porcentaje >= 50) {
      return {label: 'Medio', color: '#f59e0b'};
    } else {
      return {label: 'Bajo', color: '#ef4444'};
    }
  }

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

  deleteTec(tecId: number): void {
    if (!confirm('¿Eliminar esta institución?')) return;

    const res = this.storage.deleteTec(tecId);
    alert(res.message);

    if (res.success) {
      this.loadData();
    }
  }

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

  openEditCareerModal(career: Career): void {
    this.editingCareer = {...career};
    this.showEditCareer = true;
  }

  closeEditCareerModal(): void {
    this.showEditCareer = false;
    this.editingCareer = null;
  }

  handleEditCareerLogoInput(files: FileList | null): void {
    if (!files || files.length === 0 || !this.editingCareer) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (this.editingCareer) {
        this.editingCareer.logo = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  submitEditCareer(): void {
    if (!this.selectedTec || !this.editingCareer) return;

    if (!this.editingCareer.nombre || !this.editingCareer.clave) {
      alert('Nombre y clave obligatorios');
      return;
    }

    const res = this.storage.updateCareer(
      this.selectedTec.id,
      this.editingCareer.id,
      this.editingCareer
    );
    alert(res.message);

    if (res.success) {
      this.loadData();
      this.selectedTec = this.storage.getTecById(this.selectedTec.id) ?? null;
      this.showEditCareer = false;
      this.editingCareer = null;
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

  // Calcular población total (mantener compatibilidad)
  getTotalPoblacion(): number {
    if (!this.selectedTec || !this.selectedTec.carreras) return 0;
    return this.selectedTec.carreras.reduce((total, carrera) => {
      return total + (parseInt(carrera.poblacion) || 0);
    }, 0);
  }

  // Calcular total de alumnos inscritos
  getTotalInscritos(): number {
    if (!this.selectedTec || !this.selectedTec.carreras) return 0;
    return this.selectedTec.carreras.reduce((total, carrera) => {
      return total + (parseInt(String(carrera.poblacion)) || 0);
    }, 0);
  }

  // Calcular total de alumnos esperados
  getTotalEsperados(): number {
    if (!this.selectedTec || !this.selectedTec.carreras) return 0;
    return this.selectedTec.carreras.reduce((total, carrera) => {
      return total + (parseInt(String(carrera.alumnosEsperados)) || 0);
    }, 0);
  }

  logout(): void {
    this.auth.logout();
  }
}
