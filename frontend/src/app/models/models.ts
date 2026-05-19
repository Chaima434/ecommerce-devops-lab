export interface Utilisateur {
  id?: number;
  nom: string;
  email: string;
  motDePasse?: string;
  dateInscription?: Date;
}

export interface Transaction {
  id?: number;
  montant: number;
  date?: Date;
  type: 'REVENU' | 'DEPENSE' | 'VIREMENT' | 'EPARGNE';
  description?: string;
  source?: string;
  utilisateurId: number;
  utilisateurNom?: string;
  categorieId?: number;
  categorieNom?: string;
}

export interface Categorie {
  id?: number;
  nom: string;
  type?: string;
  couleur?: string;
  personnalisee?: boolean;
}

export interface Budget {
  id?: number;
  montantAlloue: number;
  montantDepense?: number;
  mois: number;
  annee: number;
  categorieId: number;
  categorieNom?: string;
  utilisateurId: number;
  solde?: number;
  depassement?: boolean;
  pourcentageConsomme?: number;
}

export interface ObjectifEpargne {
  id?: number;
  intitule: string;
  montantCible: number;
  montantActuel?: number;
  dateEcheance?: Date;
  priorite?: number;
  utilisateurId: number;
  progresPercent?: number;
  estAtteint?: boolean;
}

export interface Pret {
  id?: number;
  typePret: string;
  montantTotal: number;
  capitalRestant?: number;
  tauxInteret: number;
  dateEcheance?: Date;
  utilisateurId: number;
  mensualiteEstimee?: number;
}

export interface Prevision {
  id?: number;
  mois: number;
  annee: number;
  revenuPrevu?: number;
  depensesPrevues?: number;
  utilisateurId: number;
  excedent?: number;
  enDeficit?: boolean;
}

export interface Rapport {
  id?: number;
  type: 'MENSUEL' | 'ANNUEL' | 'PERSONNALISE';
  periode?: string;
  dateGeneration?: Date;
  format?: string;
  utilisateurId: number;
}

export interface SoldeStats {
  revenus: number;
  depenses: number;
  solde: number;
}
