import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private apiUrl = '/api/categories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl);
  }

  create(cat: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, cat);
  }

  update(id: number, cat: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, cat);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
