import { Component, OnInit, input } from '@angular/core';
import { MedicalHistory } from '../../models/MedicalHistory.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicalHistoryService } from '../../../services/medicalHistoryService.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medical-histoy',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './medicalHistoy.component.html',
  styleUrls: ['./medicalHistoy.component.scss']
})
export class MedicalHistoyComponent implements OnInit {
  patientId = input<string | null>();
  medicalHistory: MedicalHistory | null = null;
  isEditing: boolean = false;
  medicalHistoryForm: FormGroup;

  // medicalHistory: MedicalHistory = {
  //   id: 1,
  //   patientId: 1,
  //   isOnTreatment: true,
  //   treatmentDetails: 'Tratamiento para hipertensión',
  //   allergicToMedication: false,
  //   medicationAllergyDetails: null,
  //   hasAsthma: false,
  //   proneToBleeding: false,
  //   heartDiseaseHistory: true,
  //   heartDiseaseDetails: 'Antecedentes de arritmia',
  //   bloodPressure: 'normal',
  //   anesthesiaComplications: false,
  //   anesthesiaDetails: null,
  //   diseasesDiabetes: false,
  //   diseasesTuberculosis: false,
  //   diseasesVenereal: false,
  //   diseasesBleedingDisorder: false,
  //   diseasesGastrointestinal: true,
  //   diseasesHiv: false,
  //   createdAt: '2024-06-01T10:00:00Z',
  //   updatedAt: '2024-06-01T10:00:00Z'
  // };

  constructor(private fb: FormBuilder, private medicalHistoryService: MedicalHistoryService) {
    this.medicalHistoryForm = this.fb.group({
      isOnTreatment: [false, [Validators.required]],
      treatmentDetails: [''],
      allergicToMedication: [false, [Validators.required]],
      medicationAllergyDetails: [''],
      hasAsthma: [false, [Validators.required]],
      proneToBleeding: [false, [Validators.required]],
      heartDiseaseHistory: [false, [Validators.required]],
      heartDiseaseDetails: [''],
      bloodPressure: ['normal', [Validators.required]],
      anesthesiaComplications: [false, [Validators.required]],
      anesthesiaDetails: [''],
      diseasesDiabetes: [false, [Validators.required]],
      diseasesTuberculosis: [false, [Validators.required]],
      diseasesVenereal: [false, [Validators.required]],
      diseasesBleedingDisorder: [false, [Validators.required]],
      diseasesGastrointestinal: [false, [Validators.required]],
      diseasesHiv: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const patientId = this.patientId();
    if (patientId) {
      this.medicalHistoryService.getByPatientId(patientId).subscribe(result => {
        this.medicalHistory = result;
      });
    }
  }

  startEditing(): void {
    this.isEditing = true;
    if (this.medicalHistory) {
      this.medicalHistoryForm.patchValue({
        isOnTreatment: this.medicalHistory.isOnTreatment || false,
        treatmentDetails: this.medicalHistory.treatmentDetails || '',
        allergicToMedication: this.medicalHistory.allergicToMedication || false,
        medicationAllergyDetails: this.medicalHistory.medicationAllergyDetails || '',
        hasAsthma: this.medicalHistory.hasAsthma || false,
        proneToBleeding: this.medicalHistory.proneToBleeding || false,
        heartDiseaseHistory: this.medicalHistory.heartDiseaseHistory || false,
        heartDiseaseDetails: this.medicalHistory.heartDiseaseDetails || '',
        bloodPressure: this.medicalHistory.bloodPressure || 'normal',
        anesthesiaComplications: this.medicalHistory.anesthesiaComplications || false,
        anesthesiaDetails: this.medicalHistory.anesthesiaDetails || '',
        diseasesDiabetes: this.medicalHistory.diseasesDiabetes || false,
        diseasesTuberculosis: this.medicalHistory.diseasesTuberculosis || false,
        diseasesVenereal: this.medicalHistory.diseasesVenereal || false,
        diseasesBleedingDisorder: this.medicalHistory.diseasesBleedingDisorder || false,
        diseasesGastrointestinal: this.medicalHistory.diseasesGastrointestinal || false,
        diseasesHiv: this.medicalHistory.diseasesHiv || false
      });
    } else {
      this.medicalHistoryForm.reset();
    }
  }

  saveChanges(): void {
    if (this.medicalHistoryForm.valid) {
      const patientId = this.patientId();
      if (!patientId) return;

      const formData = {
        ...this.medicalHistoryForm.value,
        patientId: patientId
      };

      if (this.medicalHistory && this.medicalHistory.id) {
        // Actualizar historial existente
        this.medicalHistoryService.update(this.medicalHistory.id.toString(), formData).subscribe({
          next: (response) => {
            this.medicalHistory = response;
            this.isEditing = false;
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
          }
        });
      } else {
        // Crear nuevo historial
        this.medicalHistoryService.create(formData).subscribe({
          next: (response) => {
            this.medicalHistory = response;
            this.isEditing = false;
          },
          error: (error) => {
            console.error('Error al crear:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.medicalHistoryForm.reset();
  }

  getFieldError(fieldName: string): string {
    const field = this.medicalHistoryForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors && field.errors['required']) {
        return 'Este campo es requerido';
      }
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.medicalHistoryForm.controls).forEach(key => {
      const control = this.medicalHistoryForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
