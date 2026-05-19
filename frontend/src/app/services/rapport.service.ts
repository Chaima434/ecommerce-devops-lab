import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rapport } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RapportService {
  private apiUrl = '/api/rapports';

  constructor(private http: HttpClient) { }

  getByUtilisateur(userId: number): Observable<Rapport[]> {
    return this.http.get<Rapport[]>(`${this.apiUrl}/utilisateur/${userId}`);
  }

  create(r: Rapport): Observable<Rapport> {
    return this.http.post<Rapport>(this.apiUrl, r);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
