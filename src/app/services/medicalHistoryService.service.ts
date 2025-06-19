import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalHistory } from '../patients/models/MedicalHistory.model';

@Injectable({ providedIn: 'root' })
export class MedicalHistoryService {
  private apiUrl = 'http://localhost:3000/api/medical-histories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(this.apiUrl);
  }

  getById(id: string): Observable<MedicalHistory> {
    return this.http.get<MedicalHistory>(`${this.apiUrl}/${id}`);
  }

  getByPatientId(patientId: string): Observable<MedicalHistory> {
    return this.http.get<MedicalHistory>(`${this.apiUrl}/patient/${patientId}`);
  }

  create(medicalHistory: MedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(this.apiUrl, medicalHistory);
  }

  update(id: string, medicalHistory: MedicalHistory): Observable<MedicalHistory> {
    return this.http.put<MedicalHistory>(`${this.apiUrl}/${id}`, medicalHistory);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}