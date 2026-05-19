import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prevision } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PrevisionService {
  private apiUrl = '/api/previsions';

  constructor(private http: HttpClient) { }

  getByUtilisateur(userId: number): Observable<Prevision[]> {
    return this.http.get<Prevision[]>(`${this.apiUrl}/utilisateur/${userId}`);
  }

  create(p: Prevision): Observable<Prevision> {
    return this.http.post<Prevision>(this.apiUrl, p);
  }

  update(id: number, p: Prevision): Observable<Prevision> {
    return this.http.put<Prevision>(`${this.apiUrl}/${id}`, p);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
