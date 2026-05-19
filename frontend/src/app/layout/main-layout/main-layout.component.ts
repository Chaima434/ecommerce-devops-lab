import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="app-layout">
      <aside class="sidebar glass-card">
        <div class="logo">
          <div class="logo-icon"></div>
          <h2>FinManage</h2>
        </div>
        
        <nav class="nav-menu">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span>
            Tableau de Bord
          </a>
          <a routerLink="/transactions" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">💸</span>
            Transactions
          </a>
          <a routerLink="/categories" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🏷️</span>
            Catégories
          </a>
          <a routerLink="/budgets" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🎯</span>
            Budgets
          </a>
          <a routerLink="/epargne" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🏦</span>
            Épargne & Prêts
          </a>
          <a routerLink="/rapports" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📈</span>
            Rapports
          </a>
        </nav>
        
        <div class="user-profile" *ngIf="currentUser">
          <div class="avatar">{{ currentUser.nom.charAt(0) }}</div>
          <div class="user-info">
            <span class="name">{{ currentUser.nom }}</span>
            <span class="status" (click)="logout()" style="cursor:pointer; color: #f87171;">Déconnexion</span>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; min-height: 100vh; }
    .sidebar {
      width: 260px; border-radius: 0; border-left: none; border-top: none; border-bottom: none;
      display: flex; flex-direction: column; padding: 30px 20px; position: fixed; height: 100vh; z-index: 10;
    }
    .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 50px; padding: 0 10px; }
    .logo-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--accent-gradient); box-shadow: var(--shadow-glow); }
    .logo h2 { margin: 0; font-size: 1.5rem; background: linear-gradient(to right, #fff, #a0aec0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-menu { display: flex; flex-direction: column; gap: 10px; flex: 1; }
    .nav-item {
      display: flex; align-items: center; gap: 15px; padding: 12px 15px; text-decoration: none;
      color: var(--text-secondary); border-radius: var(--radius-md); transition: all var(--transition-fast); font-weight: 500;
    }
    .nav-item:hover, .nav-item.active { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
    .nav-item.active { background: rgba(99, 102, 241, 0.15); border-left: 3px solid var(--accent-primary); }
    .user-profile { display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(0, 0, 0, 0.2); border-radius: var(--radius-md); margin-top: auto; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--accent-secondary); display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .user-info { display: flex; flex-direction: column; }
    .user-info .name { font-size: 0.9rem; font-weight: 600; }
    .user-info .status { font-size: 0.75rem; color: var(--success); transition: color 0.2s; }
    .user-info .status:hover { color: #ef4444; }
    .main-content { flex: 1; margin-left: 260px; padding: 40px 50px; }
  `]
})
export class MainLayoutComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
