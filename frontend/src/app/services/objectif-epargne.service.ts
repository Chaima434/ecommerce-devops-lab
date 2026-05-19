import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectifEpargne } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ObjectifEpargneService {
  private apiUrl = '/api/objectifs-epargne';

  constructor(private http: HttpClient) { }

  getByUtilisateur(userId: number): Observable<ObjectifEpargne[]> {
    return this.http.get<ObjectifEpargne[]>(`${this.apiUrl}/utilisateur/${userId}`);
  }

  create(objectif: ObjectifEpargne): Observable<ObjectifEpargne> {
    return this.http.post<ObjectifEpargne>(this.apiUrl, objectif);
  }

  update(id: number, objectif: ObjectifEpargne): Observable<ObjectifEpargne> {
    return this.http.put<ObjectifEpargne>(`${this.apiUrl}/${id}`, objectif);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
