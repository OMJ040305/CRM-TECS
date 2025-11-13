import { Injectable } from '@angular/core';
import { User } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private STORAGE = 'usuarios';

  getAll(): User[] {
    const raw = localStorage.getItem(this.STORAGE);
    return raw ? (JSON.parse(raw) as User[]) : [];
  }

  getUserByCorreo(correo: string): User | undefined {
    return this.getAll().find(u => u.correo === correo);
  }

  add(user: Omit<User, 'id'>): { success: boolean; message: string } {
    const users = this.getAll();
    if (users.some(u => u.correo === user.correo)) {
      return { success: false, message: 'Correo ya registrado' };
    }
    const newUser: User = { id: Date.now(), ...user };
    users.push(newUser);
    localStorage.setItem(this.STORAGE, JSON.stringify(users));
    return { success: true, message: 'Usuario registrado' };
  }

  validateCredentials(correo: string, password: string): User | null {
    const u = this.getUserByCorreo(correo);
    if (u && u.password === password) return u;
    return null;
  }
}
