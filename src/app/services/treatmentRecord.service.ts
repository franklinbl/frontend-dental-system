import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TreatmentRecord } from '../patients/models/TreatmentRecord.model';

@Injectable({ providedIn: 'root' })
export class TreatmentRecordService {
  private apiUrl = 'http://localhost:3000/api/treatment-records';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TreatmentRecord[]> {
    return this.http.get<TreatmentRecord[]>(this.apiUrl);
  }

  getById(id: string): Observable<TreatmentRecord> {
    return this.http.get<TreatmentRecord>(`${this.apiUrl}/${id}`);
  }

  getByPatientId(patientId: string): Observable<TreatmentRecord[]> {
    return this.http.get<TreatmentRecord[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  create(TreatmentRecord: TreatmentRecord): Observable<TreatmentRecord> {
    return this.http.post<TreatmentRecord>(this.apiUrl, TreatmentRecord);
  }

  update(id: string, TreatmentRecord: TreatmentRecord): Observable<TreatmentRecord> {
    return this.http.put<TreatmentRecord>(`${this.apiUrl}/${id}`, TreatmentRecord);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}