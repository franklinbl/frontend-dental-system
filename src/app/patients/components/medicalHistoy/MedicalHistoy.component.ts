import { Component, OnInit } from '@angular/core';
import { MedicalHistory } from '../../models/MedicalHistory.model';

@Component({
  selector: 'app-medical-histoy',
  standalone: true,
  imports: [],
  templateUrl: './medicalHistoy.component.html',
  styleUrls: ['./medicalHistoy.component.scss']
})
export class MedicalHistoyComponent implements OnInit {
  medicalHistory: MedicalHistory = {
    id: 1,
    patientId: 1,
    isOnTreatment: true,
    treatmentDetails: 'Tratamiento para hipertensión',
    allergicToMedication: false,
    medicationAllergyDetails: null,
    hasAsthma: false,
    proneToBleeding: false,
    heartDiseaseHistory: true,
    heartDiseaseDetails: 'Antecedentes de arritmia',
    bloodPressure: 'normal',
    anesthesiaComplications: false,
    anesthesiaDetails: null,
    diseasesDiabetes: false,
    diseasesTuberculosis: false,
    diseasesVenereal: false,
    diseasesBleedingDisorder: false,
    diseasesGastrointestinal: true,
    diseasesHiv: false,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  };

  constructor() {}

  ngOnInit(): void {
  }
}
