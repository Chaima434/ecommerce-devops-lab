import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrevisionService } from '../../services/prevision.service';
import { RapportService } from '../../services/rapport.service';
import { Prevision, Rapport } from '../../models/models';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h1>Rapports & Prévisions</h1></div>

    <div class="two-cols">
      <!-- PRÉVISIONS -->
      <section>
        <div class="section-title">
          <h2>📅 Prévisions Mensuelles</h2>
          <button class="btn btn-primary btn-sm" (click)="showPrevForm = !showPrevForm">
            {{ showPrevForm ? '✕' : '+ Prévision' }}
          </button>
        </div>

        <div class="glass-card form-card" *ngIf="showPrevForm">
          <div class="input-group">
            <label>Mois</label>
            <input type="number" [(ngModel)]="newPrev.mois" min="1" max="12" />
          </div>
          <div class="input-group">
            <label>Année</label>
            <input type="number" [(ngModel)]="newPrev.annee" />
          </div>
          <div class="input-group">
            <label>Revenus Prévus (€)</label>
            <input type="number" [(ngModel)]="newPrev.revenuPrevu" placeholder="4000" />
          </div>
          <div class="input-group">
            <label>Dépenses Prévues (€)</label>
            <input type="number" [(ngModel)]="newPrev.depensesPrevues" placeholder="2500" />
          </div>
          <button class="btn btn-primary" (click)="createPrevision()">Enregistrer</button>
        </div>

        <div *ngIf="previsions.length === 0" class="empty-state">
          <span>📅</span><p>Aucune prévision créée.</p>
        </div>

        <div class="prev-card glass-card" *ngFor="let p of previsions"
             [class.in-deficit]="p.enDeficit">
          <div class="prev-header">
            <strong>{{ p.mois }}/{{ p.annee }}</strong>
            <span class="badge" [class.badge-success]="!p.enDeficit" [class.badge-danger]="p.enDeficit">
              {{ p.enDeficit ? '⚠️ Déficit' : '✅ Excédent' }}
            </span>
          </div>
          <div class="prev-row"><span>Revenus prévus</span><span class="success-text">{{ p.revenuPrevu | number:'1.2-2' }} €</span></div>
          <div class="prev-row"><span>Dépenses prévues</span><span class="danger-text">{{ p.depensesPrevues | number:'1.2-2' }} €</span></div>
          <div class="prev-row total">
            <span>Excédent / Déficit</span>
            <span [class.success-text]="!p.enDeficit" [class.danger-text]="p.enDeficit">
              {{ p.excedent | number:'1.2-2' }} €
            </span>
          </div>
          <button class="btn-action" (click)="deletePrevision(p.id!)">🗑️</button>
        </div>
      </section>

      <!-- RAPPORTS -->
      <section>
        <div class="section-title">
          <h2>📊 Rapports Générés</h2>
          <button class="btn btn-primary btn-sm" (click)="createRapport()">🔄 Générer</button>
        </div>

        <div *ngIf="rapports.length === 0" class="empty-state">
          <span>📊</span><p>Aucun rapport généré. Cliquez sur "Générer" !</p>
        </div>

        <div class="rapport-card glass-card" *ngFor="let r of rapports">
          <div class="rapport-header">
            <span class="rapport-type">{{ r.type }}</span>
            <span class="rapport-format badge badge-info">{{ r.format }}</span>
          </div>
          <p class="rapport-periode">Période : {{ r.periode || 'Actuelle' }}</p>
          <p class="rapport-date">Généré le : {{ r.dateGeneration | date:'dd/MM/yyyy HH:mm' }}</p>
          <button class="btn-action" (click)="deleteRapport(r.id!)">🗑️</button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 30px; }
    .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .section-title h2 { margin: 0; }
    .btn-sm { padding: 6px 14px; font-size: .85rem; }
    .form-card { margin-bottom: 15px; }
    .empty-state { text-align: center; padding: 30px; color: var(--text-secondary); }
    .empty-state span { font-size: 2.5rem; display: block; }
    .prev-card { margin-bottom: 15px; display: flex; flex-direction: column; gap: 10px; }
    .prev-card.in-deficit { border-color: rgba(239,68,68,.4); }
    .prev-header { display: flex; justify-content: space-between; align-items: center; }
    .prev-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-color); font-size: .9rem; }
    .prev-row.total { font-weight: 700; border-bottom: none; font-size: 1rem; }
    .success-text { color: var(--success); }
    .danger-text { color: var(--danger); }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: .75rem; font-weight: 700; }
    .badge-success { background: rgba(16,185,129,.1); color: var(--success); }
    .badge-danger { background: rgba(239,68,68,.1); color: var(--danger); }
    .badge-info { background: rgba(99,102,241,.1); color: var(--accent-primary); }
    .rapport-card { margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; }
    .rapport-header { display: flex; justify-content: space-between; align-items: center; }
    .rapport-type { font-weight: 700; font-size: 1.1rem; }
    .rapport-periode, .rapport-date { color: var(--text-secondary); font-size: .85rem; margin: 0; }
    .btn-action { background: none; border: none; cursor: pointer; opacity: .6; font-size: 1.1rem; transition: .2s; align-self: flex-end; }
    .btn-action:hover { opacity: 1; }
    @media (max-width: 900px) { .two-cols { grid-template-columns: 1fr; } }
  `]
})
export class RapportsComponent implements OnInit {
  previsions: Prevision[] = [];
  rapports: Rapport[] = [];
  showPrevForm = false;
  newPrev: Partial<Prevision> = {
    mois: new Date().getMonth() + 1,
    annee: new Date().getFullYear(),
    revenuPrevu: 0,
    depensesPrevues: 0,
    utilisateurId: 1
  };
  private readonly userId = 1;

  constructor(
    private previsionService: PrevisionService,
    private rapportService: RapportService
  ) {}

  ngOnInit() {
    this.loadPrevisions();
    this.loadRapports();
  }

  loadPrevisions() {
    this.previsionService.getByUtilisateur(this.userId).subscribe({ next: (p) => this.previsions = p, error: () => {} });
  }

  loadRapports() {
    this.rapportService.getByUtilisateur(this.userId).subscribe({ next: (r) => this.rapports = r, error: () => {} });
  }

  createPrevision() {
    if (!this.newPrev.mois || !this.newPrev.annee) return;
    this.previsionService.create(this.newPrev as Prevision).subscribe({
      next: () => { this.loadPrevisions(); this.showPrevForm = false; },
      error: () => {}
    });
  }

  deletePrevision(id: number) {
    if (!confirm('Supprimer cette prévision ?')) return;
    this.previsionService.delete(id).subscribe({ next: () => this.loadPrevisions(), error: () => {} });
  }

  createRapport() {
    this.rapportService.create({
      type: 'MENSUEL',
      periode: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      format: 'PDF',
      utilisateurId: this.userId
    }).subscribe({ next: () => this.loadRapports(), error: () => {} });
  }

  deleteRapport(id: number) {
    if (!confirm('Supprimer ce rapport ?')) return;
    this.rapportService.delete(id).subscribe({ next: () => this.loadRapports(), error: () => {} });
  }
}
