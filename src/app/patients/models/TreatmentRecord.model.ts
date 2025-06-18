export interface TreatmentRecord {
  id?: number;
  patientId: number;
  date: string; // ISO string para la fecha
  treatmentDescription: string;
  amountPaid: number;
  remainingBalance: number;
  createdAt?: string;
  updatedAt?: string;
}