import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JsonStorageService } from '../../services/json-storage.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  showRegisterModal = false;
  loginUser = { correo: '', password: '' };

  // nuevo usuario para el modal de registro
  newUser = {
    nombre: '',
    correo: '',
    password: '',
    rol: 'estudiante' as 'estudiante' | 'representante' | 'admin'
  };

  constructor(
    private auth: AuthService,
    private storage: JsonStorageService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.loginUser.correo || !this.loginUser.password) {
      alert('Completa correo y contraseña');
      return;
    }

    const success = this.auth.login(this.loginUser.correo, this.loginUser.password);

    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Correo o contraseña incorrectos');
    }
  }

  openRegister(): void {
    this.newUser = {
      nombre: '',
      correo: '',
      password: '',
      rol: 'estudiante'
    };
    this.showRegisterModal = true;
  }

  closeRegister(): void {
    this.showRegisterModal = false;
  }

  submitRegister(): void {
    if (!this.newUser.nombre || !this.newUser.correo || !this.newUser.password) {
      alert('Completa todos los campos');
      return;
    }

    const res = this.storage.addUser(this.newUser);
    alert(res.message);

    if (res.success) {
      this.showRegisterModal = false;
      // Opcional: login automático después del registro
      this.loginUser.correo = this.newUser.correo;
      this.loginUser.password = this.newUser.password;
    }
  }
}
