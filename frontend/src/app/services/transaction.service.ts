import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, SoldeStats } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = '/api/transactions';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getByUtilisateur(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/utilisateur/${userId}`);
  }

  getSolde(userId: number): Observable<SoldeStats> {
    return this.http.get<SoldeStats>(`${this.apiUrl}/utilisateur/${userId}/solde`);
  }

  create(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  update(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
