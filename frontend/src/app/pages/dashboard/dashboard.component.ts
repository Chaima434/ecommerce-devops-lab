import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { BudgetService } from '../../services/budget.service';
import { Transaction, Budget, SoldeStats } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="top-header">
      <div class="greeting">
        <h1>Tableau de Bord 📊</h1>
        <p>Voici un résumé de vos finances.</p>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card glass-card">
        <div class="card-icon" style="background: linear-gradient(135deg,#6366f1,#8b5cf6)">💰</div>
        <div class="card-info">
          <p class="card-label">Solde Net</p>
          <p class="card-value" [class.success-text]="stats.solde >= 0" [class.danger-text]="stats.solde < 0">
            {{ stats.solde | number:'1.2-2' }} €
          </p>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="card-icon" style="background: linear-gradient(135deg,#10b981,#059669)">📈</div>
        <div class="card-info">
          <p class="card-label">Total Revenus</p>
          <p class="card-value success-text">+ {{ stats.revenus | number:'1.2-2' }} €</p>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="card-icon" style="background: linear-gradient(135deg,#ef4444,#dc2626)">📉</div>
        <div class="card-info">
          <p class="card-label">Total Dépenses</p>
          <p class="card-value danger-text">- {{ stats.depenses | number:'1.2-2' }} €</p>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="card-icon" style="background: linear-gradient(135deg,#f59e0b,#d97706)">🎯</div>
        <div class="card-info">
          <p class="card-label">Budgets Actifs</p>
          <p class="card-value">{{ budgets.length }}</p>
        </div>
      </div>
    </div>

    <!-- Budgets en dépassement -->
    <div *ngIf="budgetsDepasses.length > 0" class="alert-section">
      <h2>⚠️ Alertes Budgets</h2>
      <div class="alerts-list">
        <div *ngFor="let b of budgetsDepasses" class="alert-item glass-card">
          <span class="alert-badge">DÉPASSÉ</span>
          <strong>{{ b.categorieNom }}</strong> — Dépensé : <span class="danger-text">{{ b.montantDepense | number:'1.2-2' }} €</span>
          / Alloué : {{ b.montantAlloue | number:'1.2-2' }} €
        </div>
      </div>
    </div>

    <!-- Transactions Récentes -->
    <div class="content-section">
      <div class="section-header">
        <h2>Transactions Récentes</h2>
        <a routerLink="/transactions" class="view-all">Voir tout →</a>
      </div>
      <div *ngIf="transactions.length === 0" class="empty-state glass-card">
        <span>📭</span><p>Aucune transaction. <a routerLink="/transactions">Ajouter la première</a></p>
      </div>
      <div class="transactions-list glass-card" *ngIf="transactions.length > 0">
        <div class="transaction-item" *ngFor="let t of transactions | slice:0:5">
          <div class="t-icon" [style.background]="t.type === 'REVENU' ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)'">
            {{ t.type === 'REVENU' ? '💰' : '💸' }}
          </div>
          <div class="t-details">
            <h4>{{ t.description || t.source || 'Sans titre' }}</h4>
            <span class="t-category">{{ t.categorieNom || t.type }}</span>
          </div>
          <div class="t-amount" [class.success-text]="t.type === 'REVENU'" [class.danger-text]="t.type !== 'REVENU'">
            {{ t.type === 'REVENU' ? '+' : '-' }} {{ t.montant | number:'1.2-2' }} €
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .top-header { margin-bottom: 35px; }
    .top-header p { color: var(--text-secondary); }
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-bottom: 35px; }
    .stat-card { display: flex; align-items: center; gap: 18px; }
    .card-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0; }
    .card-label { color: var(--text-secondary); font-size: .85rem; margin-bottom: 4px; }
    .card-value { font-size: 1.5rem; font-weight: 700; }
    .success-text { color: var(--success); }
    .danger-text { color: var(--danger); }
    .alert-section { margin-bottom: 35px; }
    .alert-section h2 { margin-bottom: 15px; }
    .alerts-list { display: flex; flex-direction: column; gap: 10px; }
    .alert-item { display: flex; align-items: center; gap: 15px; padding: 15px; border-left: 3px solid var(--danger); }
    .alert-badge { background: rgba(239,68,68,.1); color: var(--danger); padding: 3px 8px; border-radius: 5px; font-size: .75rem; font-weight: 700; flex-shrink: 0; }
    .content-section { margin-bottom: 35px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .view-all { color: var(--accent-primary); text-decoration: none; font-size: .9rem; }
    .empty-state { text-align: center; padding: 40px; color: var(--text-secondary); }
    .empty-state span { font-size: 3rem; display: block; margin-bottom: 10px; }
    .empty-state a { color: var(--accent-primary); }
    .transactions-list { display: flex; flex-direction: column; gap: 12px; }
    .transaction-item { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: var(--radius-md); transition: background .2s; }
    .transaction-item:hover { background: rgba(255,255,255,.04); }
    .t-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
    .t-details { flex: 1; }
    .t-details h4 { margin: 0 0 4px 0; font-size: .95rem; }
    .t-category { font-size: .8rem; color: var(--text-secondary); }
    .t-amount { font-weight: 600; font-size: 1rem; }
    @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }
  `]
})
export class DashboardComponent implements OnInit {
  stats: SoldeStats = { solde: 0, revenus: 0, depenses: 0 };
  transactions: Transaction[] = [];
  budgets: Budget[] = [];
  budgetsDepasses: Budget[] = [];

  // Simule userId=1 (à remplacer par un service d'authentification)
  private readonly userId = 1;

  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.transactionService.getSolde(this.userId).subscribe({
      next: (s) => this.stats = s,
      error: () => this.stats = { solde: 0, revenus: 0, depenses: 0 }
    });

    this.transactionService.getByUtilisateur(this.userId).subscribe({
      next: (t) => this.transactions = t,
      error: () => this.transactions = []
    });

    this.budgetService.getByUtilisateur(this.userId).subscribe({
      next: (b) => {
        this.budgets = b;
        this.budgetsDepasses = b.filter(x => x.depassement);
      },
      error: () => this.budgets = []
    });
  }
}
