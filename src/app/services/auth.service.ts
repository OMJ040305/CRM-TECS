import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JsonStorageService, User } from './json-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private storage: JsonStorageService
  ) {
    // Cargar usuario actual desde el storage
    const currentUser = this.storage.getCurrentUser();
    this.currentUserSubject.next(currentUser);
  }

  login(correo: string, password: string): boolean {
    const user = this.storage.validateCredentials(correo, password);

    if (!user) return false;

    this.storage.setCurrentUser(user);
    this.currentUserSubject.next(user);

    return true;
  }

  logout(): void {
    this.storage.setCurrentUser(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  hasRole(role: 'admin' | 'representante' | 'estudiante'): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }
}
