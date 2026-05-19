import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pret } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PretService {
  private apiUrl = '/api/prets';

  constructor(private http: HttpClient) { }

  getByUtilisateur(userId: number): Observable<Pret[]> {
    return this.http.get<Pret[]>(`${this.apiUrl}/utilisateur/${userId}`);
  }

  create(pret: Pret): Observable<Pret> {
    return this.http.post<Pret>(this.apiUrl, pret);
  }

  update(id: number, pret: Pret): Observable<Pret> {
    return this.http.put<Pret>(`${this.apiUrl}/${id}`, pret);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
