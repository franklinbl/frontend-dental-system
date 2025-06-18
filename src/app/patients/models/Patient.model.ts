export interface Patient {
  id?: number;
  name: string;
  dni: string;
  birthDate: string; // Usualmente se maneja como string en el frontend
  phone?: string | null;
  address?: string | null;
  email?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  occupation?: string | null;
  landlinePhone?: string | null;
  legalGuardianName?: string | null;
  legalGuardianDni?: string | null;
  age?: number | null;
  createdAt?: string; // Fechas como string en frontend
  updatedAt?: string;
  // Relaciones (puedes definir interfaces para estos si las usas en el frontend)
  medicalHistories?: any[];
  appointments?: any[];
  toothRecords?: any[];
  treatmentRecords?: any[];
}