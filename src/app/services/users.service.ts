import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dentist, DentistSearchResponse } from '../users/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/users'; // URL del backend

  constructor(private http: HttpClient) {}

  searchDentists(searchTerm: string): Observable<DentistSearchResponse> {
    const url = `${this.apiUrl}/searchDentists?searchTerm=${encodeURIComponent(searchTerm)}`;
    return this.http.get<DentistSearchResponse>(url);
  }
}
