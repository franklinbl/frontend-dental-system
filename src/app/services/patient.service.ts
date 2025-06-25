import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../patients/models/Patient.model';
import { PatientSearchResponse } from '../patients/models/Patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = 'http://localhost:3000/api/patients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  update(id: string, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchPatients(searchTerm: string): Observable<PatientSearchResponse> {
    return this.http.get<PatientSearchResponse>(`${this.apiUrl}/searchPatients?searchTerm=${encodeURIComponent(searchTerm)}`);
  }
}