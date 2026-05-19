import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private apiUrl = '/api/auth/me';

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Récupère le profil de l'utilisateur connecté via le token JWT.
   */
  getMe(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(this.apiUrl);
  }

  /**
   * Retourne l'utilisateur actuellement stocké localement.
   */
  getCurrentUserSync(): Utilisateur | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
