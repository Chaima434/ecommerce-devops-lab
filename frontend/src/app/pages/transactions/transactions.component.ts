import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CategorieService } from '../../services/categorie.service';
import { Transaction, Categorie } from '../../models/models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Transactions</h1>
      <button class="btn btn-primary" (click)="showForm = !showForm">
        {{ showForm ? '✕ Fermer' : '+ Nouvelle Transaction' }}
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div class="glass-card form-card" *ngIf="showForm">
      <h3>Nouvelle Transaction</h3>
      <div class="form-grid">
        <div class="input-group">
          <label>Montant (€)</label>
          <input type="number" [(ngModel)]="newTx.montant" placeholder="Ex: 150.00" />
        </div>
        <div class="input-group">
          <label>Type</label>
          <select [(ngModel)]="newTx.type">
            <option value="REVENU">Revenu</option>
            <option value="DEPENSE">Dépense</option>
            <option value="VIREMENT">Virement</option>
            <option value="EPARGNE">Épargne</option>
          </select>
        </div>
        <div class="input-group">
          <label>Description</label>
          <input type="text" [(ngModel)]="newTx.description" placeholder="Ex: Courses supermarché" />
        </div>
        <div class="input-group">
          <label>Source</label>
          <input type="text" [(ngModel)]="newTx.source" placeholder="Ex: Carte bancaire" />
        </div>
        <div class="input-group">
          <label>Catégorie</label>
          <select [(ngModel)]="newTx.categorieId">
            <option [ngValue]="undefined">-- Aucune --</option>
            <option *ngFor="let c of categories" [value]="c.id">{{ c.nom }}</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" (click)="createTransaction()">Enregistrer</button>
        <button class="btn btn-ghost" (click)="showForm = false">Annuler</button>
      </div>
    </div>

    <!-- Filtres rapides -->
    <div class="filters">
      <button class="filter-btn" [class.active]="filterType === ''" (click)="filterType = ''; applyFilter()">Tout</button>
      <button class="filter-btn" [class.active]="filterType === 'REVENU'" (click)="filterType='REVENU'; applyFilter()">Revenus</button>
      <button class="filter-btn" [class.active]="filterType === 'DEPENSE'" (click)="filterType='DEPENSE'; applyFilter()">Dépenses</button>
    </div>

    <!-- Liste des transactions -->
    <div *ngIf="filtered.length === 0" class="empty-state glass-card">
      <span>📭</span><p>Aucune transaction trouvée.</p>
    </div>

    <div class="glass-card" *ngIf="filtered.length > 0">
      <table class="table-full">
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Catégorie</th>
            <th>Source</th>
            <th>Montant</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of filtered">
            <td><span class="badge" [class.badge-success]="t.type === 'REVENU'" [class.badge-danger]="t.type === 'DEPENSE'"
                      [class.badge-info]="t.type === 'VIREMENT' || t.type === 'EPARGNE'">{{ t.type }}</span></td>
            <td>{{ t.description || '-' }}</td>
            <td>{{ t.categorieNom || '-' }}</td>
            <td>{{ t.source || '-' }}</td>
            <td class="font-bold" [class.success-text]="t.type === 'REVENU'" [class.danger-text]="t.type === 'DEPENSE'">
              {{ t.type === 'REVENU' ? '+' : '-' }} {{ t.montant | number:'1.2-2' }} €
            </td>
            <td>
              <button class="btn-action danger" (click)="deleteTransaction(t.id!)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .form-card { margin-bottom: 25px; }
    .form-card h3 { margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }
    .form-actions { display: flex; gap: 10px; margin-top: 20px; }
    .btn-ghost { background: rgba(255,255,255,.05); color: var(--text-secondary); border: 1px solid var(--border-color); }
    .filters { display: flex; gap: 10px; margin-bottom: 20px; }
    .filter-btn { padding: 8px 18px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer; transition: all .2s; }
    .filter-btn.active, .filter-btn:hover { background: var(--accent-primary); color: white; border-color: transparent; }
    .empty-state { text-align: center; padding: 40px; color: var(--text-secondary); }
    .empty-state span { font-size: 3rem; display: block; margin-bottom: 10px; }
    .table-full { width: 100%; border-collapse: collapse; }
    .table-full th, .table-full td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--border-color); }
    .table-full th { color: var(--text-secondary); font-weight: 500; font-size: .85rem; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: .75rem; font-weight: 700; }
    .badge-success { background: rgba(16,185,129,.1); color: var(--success); }
    .badge-danger { background: rgba(239,68,68,.1); color: var(--danger); }
    .badge-info { background: rgba(99,102,241,.1); color: var(--accent-primary); }
    .success-text { color: var(--success); }
    .danger-text { color: var(--danger); }
    .font-bold { font-weight: 700; }
    .btn-action { background: none; border: none; cursor: pointer; opacity: .6; transition: .2s; font-size: 1.1rem; }
    .btn-action:hover { opacity: 1; transform: scale(1.15); }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filtered: Transaction[] = [];
  categories: Categorie[] = [];
  showForm = false;
  filterType = '';

  newTx: Partial<Transaction> = { type: 'DEPENSE', utilisateurId: 1 };
  private readonly userId = 1;

  constructor(
    private transactionService: TransactionService,
    private categorieService: CategorieService
  ) {}

  ngOnInit() {
    this.load();
    this.categorieService.getAll().subscribe({ next: (c) => this.categories = c, error: () => {} });
  }

  load() {
    this.transactionService.getByUtilisateur(this.userId).subscribe({
      next: (t) => { this.transactions = t; this.applyFilter(); },
      error: () => {}
    });
  }

  applyFilter() {
    this.filtered = this.filterType
      ? this.transactions.filter(t => t.type === this.filterType)
      : [...this.transactions];
  }

  createTransaction() {
    if (!this.newTx.montant || !this.newTx.type) return;
    this.transactionService.create(this.newTx as Transaction).subscribe({
      next: () => { this.load(); this.showForm = false; this.newTx = { type: 'DEPENSE', utilisateurId: this.userId }; },
      error: () => {}
    });
  }

  deleteTransaction(id: number) {
    if (!confirm('Supprimer cette transaction ?')) return;
    this.transactionService.delete(id).subscribe({ next: () => this.load(), error: () => {} });
  }
}
