export interface MedicalHistory {
  id?: number;
  patientId: number;
  isOnTreatment: boolean;
  treatmentDetails?: string | null;
  allergicToMedication: boolean;
  medicationAllergyDetails?: string | null;
  hasAsthma: boolean;
  proneToBleeding: boolean;
  heartDiseaseHistory: boolean;
  heartDiseaseDetails?: string | null;
  bloodPressure: 'high' | 'low' | 'normal';
  anesthesiaComplications: boolean;
  anesthesiaDetails?: string | null;
  diseasesDiabetes: boolean;
  diseasesTuberculosis: boolean;
  diseasesVenereal: boolean;
  diseasesBleedingDisorder: boolean;
  diseasesGastrointestinal: boolean;
  diseasesHiv: boolean;
  createdAt?: string;
  updatedAt?: string;
}