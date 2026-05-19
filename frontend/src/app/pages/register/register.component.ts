import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card glass-card">
        <div class="logo-section">
          <div class="logo-icon"></div>
          <h1>FinManage</h1>
          <p>Créez votre compte gratuitement</p>
        </div>

        <form (submit)="onSubmit()" class="login-form">
          <div class="input-group">
            <label>Nom complet</label>
            <input type="text" [(ngModel)]="user.nom" name="nom" placeholder="Jean Dupont" required />
          </div>
          <div class="input-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="user.email" name="email" placeholder="votre@email.com" required />
          </div>
          <div class="input-group">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="user.motDePasse" name="password" placeholder="••••••••" required />
          </div>

          <div class="error-msg" *ngIf="error">
            {{ error }}
          </div>
          <div class="success-msg" *ngIf="success">
            Compte créé avec succès ! Redirection...
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading || success">
            {{ loading ? 'Création...' : 'S\'inscrire' }}
          </button>
        </form>

        <div class="footer-links">
          <p>Vous avez déjà un compte ? <a routerLink="/login">Connectez-vous</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex; justify-content: center; align-items: center; min-height: 100vh;
      background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
    }
    .login-card { width: 100%; max-width: 400px; padding: 40px; border-radius: var(--radius-lg); }
    .logo-section { text-align: center; margin-bottom: 35px; }
    .logo-icon { width: 48px; height: 48px; margin: 0 auto 15px; border-radius: 12px; background: var(--accent-gradient); box-shadow: var(--shadow-glow); }
    h1 { margin-bottom: 8px; font-size: 1.8rem; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: var(--text-secondary); font-size: 0.9rem; }
    .login-form { display: flex; flex-direction: column; gap: 20px; }
    .input-group label { display: block; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary); }
    .input-group input { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: white; outline: none; transition: border-color 0.2s; }
    .input-group input:focus { border-color: var(--accent-primary); }
    .btn-block { width: 100%; justify-content: center; padding: 14px; margin-top: 10px; }
    .error-msg { color: #f87171; font-size: 0.85rem; text-align: center; padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; }
    .success-msg { color: #10b981; font-size: 0.85rem; text-align: center; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; }
    .footer-links { text-align: center; margin-top: 25px; font-size: 0.85rem; }
    .footer-links a { color: var(--accent-primary); text-decoration: none; font-weight: 500; cursor: pointer; }
  `]
})
export class RegisterComponent {
  user = { nom: '', email: '', motDePasse: '' };
  loading = false;
  error = '';
  success = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.user.nom || !this.user.email || !this.user.motDePasse) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.register(this.user).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'inscription. L\'email est peut-être déjà utilisé.';
        this.loading = false;
      }
    });
  }
}
