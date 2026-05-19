import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObjectifEpargneService } from '../../services/objectif-epargne.service';
import { PretService } from '../../services/pret.service';
import { ObjectifEpargne, Pret } from '../../models/models';

@Component({
  selector: 'app-epargne',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h1>Épargne & Prêts</h1></div>

    <div class="two-cols">
      <!-- ÉPARGNE -->
      <section>
        <div class="section-title">
          <h2>🏆 Objectifs d'Épargne</h2>
          <button class="btn btn-primary btn-sm" (click)="showObjForm = !showObjForm">
            {{ showObjForm ? '✕' : '+ Objectif' }}
          </button>
        </div>

        <div class="glass-card form-card" *ngIf="showObjForm">
          <div class="input-group">
            <label>Intitulé</label>
            <input type="text" [(ngModel)]="newObj.intitule" placeholder="Ex: Voyage Japon" />
          </div>
          <div class="input-group">
            <label>Montant Cible (€)</label>
            <input type="number" [(ngModel)]="newObj.montantCible" placeholder="3000" />
          </div>
          <div class="input-group">
            <label>Montant Actuel (€)</label>
            <input type="number" [(ngModel)]="newObj.montantActuel" placeholder="0" />
          </div>
          <div class="input-group">
            <label>Priorité (1-5)</label>
            <input type="number" [(ngModel)]="newObj.priorite" min="1" max="5" />
          </div>
          <button class="btn btn-primary" (click)="createObjectif()">Enregistrer</button>
        </div>

        <div *ngIf="objectifs.length === 0" class="empty-state">
          <span>🎯</span><p>Aucun objectif d'épargne.</p>
        </div>

        <div class="obj-card glass-card" *ngFor="let o of objectifs">
          <div class="obj-header">
            <h3>{{ o.intitule }}</h3>
            <span class="badge" [class.badge-success]="o.estAtteint" [class.badge-info]="!o.estAtteint">
              {{ o.estAtteint ? '✅ Atteint' : '🎯 En cours' }}
            </span>
          </div>
          <div class="amounts">
            <span class="success-text">{{ o.montantActuel | number:'1.2-2' }} €</span>
            <span class="sep">/</span>
            <span>{{ o.montantCible | number:'1.2-2' }} €</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" [style.width.%]="o.progresPercent"
                 [style.background]="o.estAtteint ? 'var(--success)' : 'var(--accent-primary)'"></div>
          </div>
          <div class="obj-footer">
            <span class="pct-text">{{ o.progresPercent | number:'1.0-0' }}% accompli</span>
            <button class="btn-action" (click)="deleteObjectif(o.id!)">🗑️</button>
          </div>
        </div>
      </section>

      <!-- PRÊTS -->
      <section>
        <div class="section-title">
          <h2>🏦 Prêts en Cours</h2>
          <button class="btn btn-primary btn-sm" (click)="showPretForm = !showPretForm">
            {{ showPretForm ? '✕' : '+ Prêt' }}
          </button>
        </div>

        <div class="glass-card form-card" *ngIf="showPretForm">
          <div class="input-group">
            <label>Type de Prêt</label>
            <select [(ngModel)]="newPret.typePret">
              <option value="Immobilier">Immobilier</option>
              <option value="Automobile">Automobile</option>
              <option value="Personnel">Personnel</option>
              <option value="Consommation">Consommation</option>
            </select>
          </div>
          <div class="input-group">
            <label>Montant Total (€)</label>
            <input type="number" [(ngModel)]="newPret.montantTotal" placeholder="15000" />
          </div>
          <div class="input-group">
            <label>Capital Restant (€)</label>
            <input type="number" [(ngModel)]="newPret.capitalRestant" placeholder="12000" />
          </div>
          <div class="input-group">
            <label>Taux d'Intérêt (%)</label>
            <input type="number" [(ngModel)]="newPret.tauxInteret" placeholder="2.5" />
          </div>
          <button class="btn btn-primary" (click)="createPret()">Enregistrer</button>
        </div>

        <div *ngIf="prets.length === 0" class="empty-state">
          <span>🏦</span><p>Aucun prêt enregistré.</p>
        </div>

        <div class="obj-card glass-card" *ngFor="let p of prets">
          <div class="obj-header">
            <h3>{{ p.typePret }}</h3>
            <span class="badge badge-warning">En remboursement</span>
          </div>
          <div class="amounts">
            <span class="danger-text">{{ p.capitalRestant | number:'1.2-2' }} €</span>
            <span class="sep">restant /</span>
            <span>{{ p.montantTotal | number:'1.2-2' }} € total</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill"
                 [style.width.%]="((p.montantTotal! - p.capitalRestant!) / p.montantTotal!) * 100"
                 style="background: var(--accent-primary)"></div>
          </div>
          <div class="obj-footer">
            <span class="pct-text">Mensualité estimée : <strong>{{ p.mensualiteEstimee | number:'1.2-2' }} €</strong></span>
            <button class="btn-action" (click)="deletePret(p.id!)">🗑️</button>
          </div>
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
    .obj-card { margin-bottom: 15px; display: flex; flex-direction: column; gap: 12px; }
    .obj-header { display: flex; justify-content: space-between; align-items: center; }
    .obj-header h3 { margin: 0; }
    .amounts { font-size: 1.05rem; }
    .sep { margin: 0 6px; color: var(--text-secondary); }
    .progress-bar-bg { height: 8px; background: rgba(255,255,255,.1); border-radius: 4px; overflow: hidden; }
    .progress-bar-fill { height: 100%; border-radius: 4px; transition: width .3s; }
    .obj-footer { display: flex; justify-content: space-between; align-items: center; }
    .pct-text { font-size: .85rem; color: var(--text-secondary); }
    .success-text { color: var(--success); }
    .danger-text { color: var(--danger); }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: .75rem; font-weight: 700; }
    .badge-success { background: rgba(16,185,129,.1); color: var(--success); }
    .badge-info { background: rgba(99,102,241,.1); color: var(--accent-primary); }
    .badge-warning { background: rgba(245,158,11,.1); color: var(--warning); }
    .btn-action { background: none; border: none; cursor: pointer; opacity: .6; font-size: 1.1rem; transition: .2s; }
    .btn-action:hover { opacity: 1; }
    @media (max-width: 900px) { .two-cols { grid-template-columns: 1fr; } }
  `]
})
export class EpargneComponent implements OnInit {
  objectifs: ObjectifEpargne[] = [];
  prets: Pret[] = [];
  showObjForm = false;
  showPretForm = false;
  newObj: Partial<ObjectifEpargne> = { priorite: 1, montantActuel: 0, utilisateurId: 1 };
  newPret: Partial<Pret> = { utilisateurId: 1 };
  private readonly userId = 1;

  constructor(
    private objectifService: ObjectifEpargneService,
    private pretService: PretService
  ) {}

  ngOnInit() {
    this.loadObjectifs();
    this.loadPrets();
  }

  loadObjectifs() {
    this.objectifService.getByUtilisateur(this.userId).subscribe({ next: (o) => this.objectifs = o, error: () => {} });
  }

  loadPrets() {
    this.pretService.getByUtilisateur(this.userId).subscribe({ next: (p) => this.prets = p, error: () => {} });
  }

  createObjectif() {
    if (!this.newObj.intitule || !this.newObj.montantCible) return;
    this.objectifService.create(this.newObj as ObjectifEpargne).subscribe({
      next: () => { this.loadObjectifs(); this.showObjForm = false; this.newObj = { priorite: 1, montantActuel: 0, utilisateurId: this.userId }; },
      error: () => {}
    });
  }

  deleteObjectif(id: number) {
    if (!confirm('Supprimer cet objectif ?')) return;
    this.objectifService.delete(id).subscribe({ next: () => this.loadObjectifs(), error: () => {} });
  }

  createPret() {
    if (!this.newPret.typePret || !this.newPret.montantTotal) return;
    this.pretService.create(this.newPret as Pret).subscribe({
      next: () => { this.loadPrets(); this.showPretForm = false; this.newPret = { utilisateurId: this.userId }; },
      error: () => {}
    });
  }

  deletePret(id: number) {
    if (!confirm('Supprimer ce prêt ?')) return;
    this.pretService.delete(id).subscribe({ next: () => this.loadPrets(), error: () => {} });
  }
}
