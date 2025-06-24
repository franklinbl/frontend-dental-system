export interface Appointments {
  id?: number;
  date: string;
  patientId: number;
  patientName?: string;
  doctorId?: number;
  time: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}