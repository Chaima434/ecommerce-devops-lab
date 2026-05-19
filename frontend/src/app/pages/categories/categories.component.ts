import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../models/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Catégories</h1>
        <p class="subtitle">Gérez vos catégories de dépenses et revenus</p>
      </div>
      <button class="btn btn-primary" (click)="openAddModal()">
        <span class="btn-icon">＋</span> Nouvelle Catégorie
      </button>
    </div>

    <!-- Stats bar -->
    <div class="stats-row">
      <div class="stat-chip glass-card">
        <span class="stat-icon">🗂️</span>
        <div>
          <div class="stat-val">{{ categories.length }}</div>
          <div class="stat-lbl">Total</div>
        </div>
      </div>
      <div class="stat-chip glass-card">
        <span class="stat-icon">📤</span>
        <div>
          <div class="stat-val">{{ countByType('DEPENSE') }}</div>
          <div class="stat-lbl">Dépenses</div>
        </div>
      </div>
      <div class="stat-chip glass-card">
        <span class="stat-icon">📥</span>
        <div>
          <div class="stat-val">{{ countByType('REVENU') }}</div>
          <div class="stat-lbl">Revenus</div>
        </div>
      </div>
      <div class="stat-chip glass-card">
        <span class="stat-icon">✨</span>
        <div>
          <div class="stat-val">{{ countPersonnalisees() }}</div>
          <div class="stat-lbl">Personnalisées</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Rechercher une catégorie…" [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" />
      </div>
      <div class="filter-chips">
        <button class="filter-chip" [class.active]="filterType === ''" (click)="filterType = ''; applyFilters()">Tout</button>
        <button class="filter-chip" [class.active]="filterType === 'DEPENSE'" (click)="filterType = 'DEPENSE'; applyFilters()">Dépenses</button>
        <button class="filter-chip" [class.active]="filterType === 'REVENU'" (click)="filterType = 'REVENU'; applyFilters()">Revenus</button>
        <button class="filter-chip" [class.active]="filterType === 'AUTRE'" (click)="filterType = 'AUTRE'; applyFilters()">Autres</button>
      </div>
    </div>

    <!-- Empty state -->
    <div *ngIf="filtered.length === 0 && !loading" class="empty-state glass-card">
      <div class="empty-icon">🗂️</div>
      <h3>Aucune catégorie trouvée</h3>
      <p>{{ searchTerm || filterType ? 'Essayez de modifier vos filtres.' : 'Créez votre première catégorie pour commencer.' }}</p>
      <button *ngIf="!searchTerm && !filterType" class="btn btn-primary" (click)="openAddModal()">Créer une catégorie</button>
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement…</p>
    </div>

    <!-- Cards grid -->
    <div class="categories-grid" *ngIf="!loading && filtered.length > 0">
      <div class="cat-card glass-card" *ngFor="let cat of filtered" [style.--cat-color]="cat.couleur || '#6366f1'">
        <div class="cat-header">
          <div class="cat-color-dot" [style.background]="cat.couleur || '#6366f1'"></div>
          <div class="cat-info">
            <h3 class="cat-name">{{ cat.nom }}</h3>
            <div class="cat-meta">
              <span class="badge" [ngClass]="getBadgeClass(cat.type)">{{ cat.type || 'N/A' }}</span>
              <span class="badge badge-custom" *ngIf="cat.personnalisee">✨ Personnalisée</span>
            </div>
          </div>
        </div>
        <div class="cat-color-bar" [style.background]="cat.couleur || '#6366f1'"></div>
        <div class="cat-actions">
          <button class="action-btn edit-btn" (click)="openEditModal(cat)" title="Modifier">
            <span>✏️</span> Modifier
          </button>
          <button class="action-btn delete-btn" (click)="confirmDelete(cat)" title="Supprimer">
            <span>🗑️</span> Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- ========== MODAL ADD / EDIT ========== -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-box glass-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ editMode ? '✏️ Modifier la catégorie' : '＋ Nouvelle catégorie' }}</h2>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <!-- Nom -->
          <div class="field">
            <label>Nom <span class="required">*</span></label>
            <input type="text" [(ngModel)]="form.nom" placeholder="Ex: Alimentation, Salaire…" [class.error]="submitted && !form.nom" />
            <span class="field-error" *ngIf="submitted && !form.nom">Le nom est requis.</span>
          </div>

          <!-- Type -->
          <div class="field">
            <label>Type</label>
            <div class="type-selector">
              <label class="type-option" [class.selected]="form.type === 'DEPENSE'" (click)="form.type = 'DEPENSE'">
                <span>📤</span> Dépense
              </label>
              <label class="type-option" [class.selected]="form.type === 'REVENU'" (click)="form.type = 'REVENU'">
                <span>📥</span> Revenu
              </label>
              <label class="type-option" [class.selected]="form.type === 'AUTRE'" (click)="form.type = 'AUTRE'">
                <span>🔀</span> Autre
              </label>
            </div>
          </div>

          <!-- Couleur -->
          <div class="field">
            <label>Couleur</label>
            <div class="color-row">
              <input type="color" [(ngModel)]="form.couleur" class="color-picker" />
              <div class="color-presets">
                <div class="color-preset" *ngFor="let c of colorPresets"
                     [style.background]="c" [class.active]="form.couleur === c"
                     (click)="form.couleur = c"></div>
              </div>
            </div>
          </div>

          <!-- Personnalisée -->
          <div class="field field-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="form.personnalisee" />
              <span class="checkmark"></span>
              Catégorie personnalisée
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving">
            <span *ngIf="saving" class="spinner-sm"></span>
            {{ saving ? 'Enregistrement…' : (editMode ? 'Mettre à jour' : 'Créer') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========== MODAL CONFIRMATION SUPPRESSION ========== -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="showDeleteModal = false">
      <div class="modal-box modal-sm glass-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>🗑️ Supprimer la catégorie</h2>
          <button class="close-btn" (click)="showDeleteModal = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="confirm-msg">Voulez-vous vraiment supprimer la catégorie
            <strong>« {{ catToDelete?.nom }} »</strong> ?
          </p>
          <p class="warn-msg">⚠️ Cette action est irréversible et peut affecter les transactions associées.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="showDeleteModal = false">Annuler</button>
          <button class="btn btn-danger" (click)="deleteConfirmed()" [disabled]="saving">
            <span *ngIf="saving" class="spinner-sm"></span>
            {{ saving ? 'Suppression…' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <div class="toast" [class.show]="toastVisible" [class.toast-error]="toastError">
      <span class="toast-icon">{{ toastError ? '✕' : '✓' }}</span>
      {{ toastMessage }}
    </div>
  `,
  styles: [`
    /* ---- Header ---- */
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .header-left h1 { margin: 0 0 4px; font-size: 1.8rem; }
    .subtitle { color: var(--text-secondary); font-size: .9rem; margin: 0; }

    /* ---- Stats ---- */
    .stats-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat-chip { display: flex; align-items: center; gap: 14px; padding: 16px 22px; border-radius: var(--radius-md); flex: 1; min-width: 130px; }
    .stat-icon { font-size: 1.8rem; }
    .stat-val { font-size: 1.5rem; font-weight: 700; }
    .stat-lbl { font-size: .75rem; color: var(--text-secondary); }

    /* ---- Filters ---- */
    .filters-bar { display: flex; gap: 16px; align-items: center; margin-bottom: 24px; flex-wrap: wrap; }
    .search-box { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,.05);
      border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 16px; flex: 1; min-width: 220px; }
    .search-box input { background: none; border: none; outline: none; color: var(--text-primary); font-size: .95rem; width: 100%; }
    .search-icon { font-size: 1rem; }
    .filter-chips { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-chip { padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color);
      background: transparent; color: var(--text-secondary); cursor: pointer; font-size: .85rem; transition: all .2s; }
    .filter-chip.active, .filter-chip:hover { background: var(--accent-primary); color: #fff; border-color: transparent; }

    /* ---- Grid ---- */
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

    .cat-card {
      border-radius: var(--radius-lg); overflow: hidden; transition: transform .2s, box-shadow .2s;
      border: 1px solid rgba(255,255,255,.06); position: relative;
    }
    .cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.35); }
    .cat-header { display: flex; align-items: flex-start; gap: 14px; padding: 20px 20px 14px; }
    .cat-color-dot { width: 14px; height: 14px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; box-shadow: 0 0 8px var(--cat-color); }
    .cat-name { margin: 0 0 8px; font-size: 1.05rem; font-weight: 600; }
    .cat-meta { display: flex; gap: 6px; flex-wrap: wrap; }
    .cat-color-bar { height: 3px; background: var(--cat-color); opacity: .7; margin: 0 20px; border-radius: 2px; }
    .cat-actions { display: flex; gap: 8px; padding: 14px 20px 18px; }

    /* ---- Badges ---- */
    .badge { padding: 3px 10px; border-radius: 12px; font-size: .72rem; font-weight: 700; text-transform: uppercase; }
    .badge-depense { background: rgba(239,68,68,.12); color: #f87171; }
    .badge-revenu  { background: rgba(16,185,129,.12); color: #34d399; }
    .badge-autre   { background: rgba(99,102,241,.12); color: #818cf8; }
    .badge-custom  { background: rgba(245,158,11,.12); color: #fbbf24; }

    /* ---- Action buttons ---- */
    .action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: none;
      border-radius: var(--radius-sm); cursor: pointer; font-size: .82rem; font-weight: 600; transition: all .2s; flex: 1; justify-content: center; }
    .edit-btn   { background: rgba(99,102,241,.15); color: #818cf8; }
    .edit-btn:hover   { background: rgba(99,102,241,.3); }
    .delete-btn { background: rgba(239,68,68,.12); color: #f87171; }
    .delete-btn:hover { background: rgba(239,68,68,.25); }

    /* ---- Empty / Loading ---- */
    .empty-state { text-align: center; padding: 60px 30px; }
    .empty-icon { font-size: 3.5rem; margin-bottom: 14px; }
    .empty-state h3 { margin: 0 0 8px; font-size: 1.2rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 20px; }
    .loading-state { text-align: center; padding: 60px; color: var(--text-secondary); }
    .spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,.1); border-top-color: var(--accent-primary);
      border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto 14px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ---- Modal ---- */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn .2s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-box { width: 100%; max-width: 480px; border-radius: var(--radius-lg); overflow: hidden;
      animation: slideUp .25s cubic-bezier(.34,1.56,.64,1); }
    .modal-sm { max-width: 420px; }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 22px 24px 0; }
    .modal-header h2 { margin: 0; font-size: 1.15rem; }
    .close-btn { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 1.2rem; padding: 4px; transition: color .2s; }
    .close-btn:hover { color: var(--text-primary); }
    .modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 18px; }
    .modal-footer { padding: 16px 24px 22px; display: flex; gap: 10px; justify-content: flex-end; }

    /* ---- Fields ---- */
    .field { display: flex; flex-direction: column; gap: 7px; }
    .field label { font-size: .85rem; color: var(--text-secondary); font-weight: 500; }
    .field input[type="text"], .field select { width: 100%; padding: 10px 14px; background: rgba(255,255,255,.05);
      border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-primary);
      font-size: .9rem; outline: none; transition: border-color .2s; box-sizing: border-box; }
    .field input:focus { border-color: var(--accent-primary); }
    .field input.error { border-color: var(--danger); }
    .field-error { font-size: .78rem; color: var(--danger); }
    .required { color: var(--danger); }

    /* Type selector */
    .type-selector { display: flex; gap: 8px; }
    .type-option { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border: 1px solid var(--border-color);
      border-radius: var(--radius-sm); cursor: pointer; font-size: .85rem; color: var(--text-secondary);
      transition: all .2s; flex: 1; justify-content: center; user-select: none; }
    .type-option.selected { border-color: var(--accent-primary); background: rgba(99,102,241,.15); color: #818cf8; }
    .type-option:hover:not(.selected) { border-color: rgba(255,255,255,.2); color: var(--text-primary); }

    /* Color */
    .color-row { display: flex; align-items: center; gap: 14px; }
    .color-picker { width: 44px; height: 44px; border: none; border-radius: var(--radius-sm); cursor: pointer;
      background: none; padding: 0; }
    .color-presets { display: flex; gap: 8px; flex-wrap: wrap; }
    .color-preset { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; transition: transform .15s, box-shadow .15s; }
    .color-preset:hover { transform: scale(1.2); }
    .color-preset.active { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--accent-primary); }

    /* Checkbox */
    .field-checkbox { flex-direction: row; }
    .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: .9rem; color: var(--text-primary); }
    .checkbox-label input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--accent-primary); cursor: pointer; }

    /* Confirm */
    .confirm-msg { margin: 0 0 10px; font-size: .95rem; line-height: 1.5; }
    .warn-msg { margin: 0; color: #fbbf24; font-size: .82rem; background: rgba(245,158,11,.08); padding: 10px 14px; border-radius: var(--radius-sm); }

    /* Buttons */
    .btn { padding: 10px 22px; border-radius: var(--radius-sm); border: none; cursor: pointer; font-size: .9rem;
      font-weight: 600; transition: all .2s; display: flex; align-items: center; gap: 8px; }
    .btn-primary { background: var(--accent-gradient); color: #fff; box-shadow: 0 4px 15px rgba(99,102,241,.3); }
    .btn-primary:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(99,102,241,.5); transform: translateY(-1px); }
    .btn-ghost { background: rgba(255,255,255,.05); color: var(--text-secondary); border: 1px solid var(--border-color); }
    .btn-ghost:hover { background: rgba(255,255,255,.1); color: var(--text-primary); }
    .btn-danger { background: rgba(239,68,68,.2); color: #f87171; border: 1px solid rgba(239,68,68,.3); }
    .btn-danger:hover:not(:disabled) { background: rgba(239,68,68,.35); }
    .btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }
    .btn-icon { font-size: 1.1rem; font-weight: 400; }
    .spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.2); border-top-color: #fff;
      border-radius: 50%; animation: spin .7s linear infinite; }

    /* Toast */
    .toast { position: fixed; bottom: 30px; right: 30px; background: rgba(30,41,59,.95);
      border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius-md); padding: 14px 22px;
      display: flex; align-items: center; gap: 12px; font-size: .9rem; font-weight: 500;
      transform: translateY(80px); opacity: 0; transition: all .35s cubic-bezier(.34,1.56,.64,1);
      z-index: 2000; box-shadow: 0 8px 30px rgba(0,0,0,.4); }
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast-icon { width: 22px; height: 22px; border-radius: 50%; background: var(--success);
      color: #fff; display: flex; align-items: center; justify-content: center; font-size: .8rem; font-weight: 700; }
    .toast.toast-error .toast-icon { background: var(--danger); }

    @media (max-width: 768px) {
      .categories-grid { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; gap: 14px; }
      .filters-bar { flex-direction: column; align-items: stretch; }
      .stats-row { gap: 10px; }
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Categorie[] = [];
  filtered: Categorie[] = [];
  loading = false;
  saving = false;

  searchTerm = '';
  filterType = '';

  showModal = false;
  showDeleteModal = false;
  editMode = false;
  submitted = false;

  form: Partial<Categorie> = {};
  catToDelete: Categorie | null = null;

  toastVisible = false;
  toastMessage = '';
  toastError = false;

  readonly colorPresets = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#10b981',
    '#06b6d4', '#3b82f6', '#64748b', '#a16207'
  ];

  constructor(private categorieService: CategorieService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.categorieService.getAll().subscribe({
      next: (data) => { this.categories = data; this.applyFilters(); this.loading = false; },
      error: () => { this.loading = false; this.showToast('Erreur lors du chargement.', true); }
    });
  }

  applyFilters() {
    this.filtered = this.categories.filter(c => {
      const matchSearch = !this.searchTerm ||
        c.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchType = !this.filterType || c.type === this.filterType;
      return matchSearch && matchType;
    });
  }

  countByType(type: string) { return this.categories.filter(c => c.type === type).length; }
  countPersonnalisees()      { return this.categories.filter(c => c.personnalisee).length; }

  getBadgeClass(type?: string) {
    if (type === 'DEPENSE') return 'badge-depense';
    if (type === 'REVENU')  return 'badge-revenu';
    return 'badge-autre';
  }

  openAddModal() {
    this.editMode = false;
    this.submitted = false;
    this.form = { nom: '', type: 'DEPENSE', couleur: '#6366f1', personnalisee: false };
    this.showModal = true;
  }

  openEditModal(cat: Categorie) {
    this.editMode = true;
    this.submitted = false;
    this.form = { ...cat };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    this.submitted = true;
    if (!this.form.nom?.trim()) return;
    this.saving = true;

    const payload: Categorie = {
      nom:           this.form.nom!.trim(),
      type:          this.form.type,
      couleur:       this.form.couleur,
      personnalisee: this.form.personnalisee ?? false
    };

    const obs = this.editMode
      ? this.categorieService.update(this.form.id!, payload)
      : this.categorieService.create(payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.load();
        this.showToast(this.editMode ? 'Catégorie mise à jour !' : 'Catégorie créée !');
      },
      error: () => {
        this.saving = false;
        this.showToast('Une erreur est survenue.', true);
      }
    });
  }

  confirmDelete(cat: Categorie) {
    this.catToDelete = cat;
    this.showDeleteModal = true;
  }

  deleteConfirmed() {
    if (!this.catToDelete?.id) return;
    this.saving = true;
    this.categorieService.delete(this.catToDelete.id).subscribe({
      next: () => {
        this.saving = false;
        this.showDeleteModal = false;
        this.catToDelete = null;
        this.load();
        this.showToast('Catégorie supprimée.');
      },
      error: () => {
        this.saving = false;
        this.showToast('Erreur lors de la suppression.', true);
      }
    });
  }

  showToast(msg: string, error = false) {
    this.toastMessage  = msg;
    this.toastError    = error;
    this.toastVisible  = true;
    setTimeout(() => this.toastVisible = false, 3000);
  }
}
