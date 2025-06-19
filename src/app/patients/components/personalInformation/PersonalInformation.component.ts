import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/Patient.model';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './personalInformation.component.html',
  styleUrls: ['./personalInformation.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  patient: Patient = null as unknown as Patient;
  isEditing: boolean = false;
  patientForm: FormGroup;
  patientId: string | null = null;

  // patient: Patient = {
  //   id: 1,
  //   name: 'Juan Pérez',
  //   dni: '12345678',
  //   birthDate: '1988-01-01',
  //   phone: '+1 234 567 890',
  //   address: 'Calle Principal #123',
  //   email: 'juan@example.com',
  //   gender: 'male',
  //   occupation: 'Ingeniero',
  //   landlinePhone: null,
  //   legalGuardianName: null,
  //   legalGuardianDni: null,
  //   age: 35,
  // };

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      phone: [null],
      address: [null],
      email: [null, [Validators.email]],
      gender: [null],
      occupation: [null],
      landlinePhone: [null],
      legalGuardianName: [null],
      legalGuardianDni: [null],
      age: [null, [Validators.min(0), Validators.max(150)]]
    });
  }

  ngOnInit(): void {
    this.patientId = this.activatedRoute.snapshot.params['id'];
    if (this.patientId) {
      this.patientService.getById(this.patientId).subscribe(result => {
        this.patient = result;
      });
    }
  }

  startEditing(): void {
    this.isEditing = true;
    // Crear una copia del paciente para editar
    if (this.patient) {
      this.patientForm.patchValue({
        name: this.patient.name || '',
        dni: this.patient.dni || '',
        birthDate: this.patient.birthDate || '',
        phone: this.patient.phone || null,
        address: this.patient.address || null,
        email: this.patient.email || null,
        gender: this.patient.gender || null,
        occupation: this.patient.occupation || null,
        landlinePhone: this.patient.landlinePhone || null,
        legalGuardianName: this.patient.legalGuardianName || null,
        legalGuardianDni: this.patient.legalGuardianDni || null,
        age: this.patient.age || null
      });
    } else {
      this.patientForm.reset();
    }
  }

  saveChanges(): void {
    if (this.patientForm.valid) {
      if (this.patientId) {
        this.patientService.update(this.patientId, this.patientForm.value).subscribe({
          next: (response) => {
            this.patient = response;
            this.isEditing = false;
          }
        });
      } else {
        this.patientService.create(this.patientForm.value).subscribe({
          next: (response) => {
            this.patient = response;
            this.isEditing = false;
            this.router.navigate(['/patients/view', response.id]);
          },
          error: (error) => {
            console.error('Error al guardar:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.patientForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.patientForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors?.['email']) {
        return 'Ingrese un email válido';
      }
      if (field.errors?.['min']) {
        return `El valor mínimo es ${field.errors['min'].min}`;
      }
      if (field.errors?.['max']) {
        return `El valor máximo es ${field.errors['max'].max}`;
      }
    }
    return '';
  }
}
