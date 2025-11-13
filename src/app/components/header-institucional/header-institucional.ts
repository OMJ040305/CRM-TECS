// header-institucional.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/users.model';

@Component({
  selector: 'app-header-institucional',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-institucional.html',
  styleUrls: ['./header-institucional.css']
})
export class HeaderInstitucional implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoggedIn: boolean = false;
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  goToDashboard(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToProfile(): void {
  if (this.isLoggedIn && this.currentUser) {
    this.router.navigate(['/perfil']);
  } else {
    // Opcional: redirigir al login si no está autenticado
    this.router.navigate(['/login']);
  }
}
}