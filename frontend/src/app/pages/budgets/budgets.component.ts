import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { CategorieService } from '../../services/categorie.service';
import { Budget, Categorie } from '../../models/models';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Gestion des Budgets</h1>
      <button class="btn btn-primary" (click)="showForm = !showForm">
        {{ showForm ? '✕ Fermer' : '+ Nouveau Budget' }}
      </button>
    </div>

    <!-- Formulaire -->
    <div class="glass-card form-card" *ngIf="showForm">
      <h3>Nouveau Budget</h3>
      <div class="form-grid">
        <div class="input-group">
          <label>Catégorie</label>
          <select [(ngModel)]="newBudget.categorieId">
            <option *ngFor="let c of categories" [value]="c.id">{{ c.nom }}</option>
          </select>
        </div>
        <div class="input-group">
          <label>Montant Alloué (€)</label>
          <input type="number" [(ngModel)]="newBudget.montantAlloue" placeholder="500" />
        </div>
        <div class="input-group">
          <label>Mois</label>
          <input type="number" [(ngModel)]="newBudget.mois" min="1" max="12" />
        </div>
        <div class="input-group">
          <label>Année</label>
          <input type="number" [(ngModel)]="newBudget.annee" />
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" (click)="createBudget()">Enregistrer</button>
        <button class="btn btn-ghost" (click)="showForm = false">Annuler</button>
      </div>
    </div>

    <!-- Grille des budgets -->
    <div *ngIf="budgets.length === 0" class="empty-state glass-card">
      <span>🎯</span><p>Aucun budget défini. Commencez par en créer un !</p>
    </div>

    <div class="budgets-grid">
      <div class="budget-card glass-card" *ngFor="let b of budgets"
           [class.budget-over]="b.depassement">
        <div class="budget-top">
          <h3>{{ b.categorieNom }}</h3>
          <span class="badge" [class.badge-danger]="b.depassement" [class.badge-success]="!b.depassement">
            {{ b.depassement ? '⚠️ Dépassé' : '✅ OK' }}
          </span>
        </div>
        <p class="period">{{ b.mois }}/{{ b.annee }}</p>
        <div class="amounts">
          <span [class.danger-text]="b.depassement">{{ b.montantDepense | number:'1.2-2' }} €</span>
          <span class="separator">/</span>
          <span>{{ b.montantAlloue | number:'1.2-2' }} €</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill"
               [style.width.%]="b.pourcentageConsomme"
               [style.background]="b.depassement ? 'var(--danger)' : b.pourcentageConsomme! > 75 ? 'var(--warning)' : 'var(--success)'">
          </div>
        </div>
        <div class="budget-footer">
          <span class="solde-label" [class.danger-text]="b.depassement" [class.success-text]="!b.depassement">
            Solde : {{ b.solde | number:'1.2-2' }} €
          </span>
          <button class="btn-action danger" (click)="deleteBudget(b.id!)">🗑️</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .form-card { margin-bottom: 25px; }
    .form-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 15px; }
    .form-actions { display: flex; gap: 10px; margin-top: 20px; }
    .btn-ghost { background: rgba(255,255,255,.05); color: var(--text-secondary); border: 1px solid var(--border-color); }
    .empty-state { text-align: center; padding: 40px; color: var(--text-secondary); }
    .empty-state span { font-size: 3rem; display: block; margin-bottom: 10px; }
    .budgets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 20px; }
    .budget-card { display: flex; flex-direction: column; gap: 12px; }
    .budget-over { border-color: rgba(239,68,68,.5); box-shadow: 0 0 20px rgba(239,68,68,.15); }
    .budget-top { display: flex; justify-content: space-between; align-items: center; }
    .budget-top h3 { margin: 0; }
    .period { color: var(--text-secondary); font-size: .85rem; margin: 0; }
    .amounts { font-size: 1.1rem; }
    .separator { margin: 0 6px; color: var(--text-secondary); }
    .progress-bar-bg { height: 8px; background: rgba(255,255,255,.1); border-radius: 4px; overflow: hidden; }
    .progress-bar-fill { height: 100%; border-radius: 4px; transition: width .3s; }
    .budget-footer { display: flex; justify-content: space-between; align-items: center; }
    .solde-label { font-weight: 600; }
    .success-text { color: var(--success); }
    .danger-text { color: var(--danger); }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: .75rem; font-weight: 700; }
    .badge-success { background: rgba(16,185,129,.1); color: var(--success); }
    .badge-danger { background: rgba(239,68,68,.1); color: var(--danger); }
    .btn-action { background: none; border: none; cursor: pointer; opacity: .6; transition: .2s; font-size: 1.1rem; }
    .btn-action:hover { opacity: 1; }
  `]
})
export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [];
  categories: Categorie[] = [];
  showForm = false;
  newBudget: Partial<Budget> = { mois: new Date().getMonth() + 1, annee: new Date().getFullYear(), utilisateurId: 1 };
  private readonly userId = 1;

  constructor(
    private budgetService: BudgetService,
    private categorieService: CategorieService
  ) {}

  ngOnInit() {
    this.load();
    this.categorieService.getAll().subscribe({ next: (c) => this.categories = c, error: () => {} });
  }

  load() {
    this.budgetService.getByUtilisateur(this.userId).subscribe({
      next: (b) => this.budgets = b, error: () => {}
    });
  }

  createBudget() {
    if (!this.newBudget.montantAlloue || !this.newBudget.categorieId) return;
    this.budgetService.create(this.newBudget as Budget).subscribe({
      next: () => { this.load(); this.showForm = false; },
      error: () => {}
    });
  }

  deleteBudget(id: number) {
    if (!confirm('Supprimer ce budget ?')) return;
    this.budgetService.delete(id).subscribe({ next: () => this.load(), error: () => {} });
  }
}
