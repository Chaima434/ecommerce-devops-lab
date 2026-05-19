import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private apiUrl = '/api/budgets';

  constructor(private http: HttpClient) { }

  getByUtilisateur(userId: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/utilisateur/${userId}`);
  }

  create(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  update(id: number, budget: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, budget);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
